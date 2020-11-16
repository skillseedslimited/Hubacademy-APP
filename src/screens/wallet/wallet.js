import React from 'react';
import { StyleSheet, Dimensions,UIManager, TextInput, Image, Text,ActivityIndicator, View, ScrollView, Alert, Platform,Animated, Keyboard, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon, Button,Input } from 'react-native-elements'
import { onSignOut } from "../../auth";
import CatsComponent from '../../components/CatsComponent'
import Toast from "react-native-simple-toast";
import Modal from "react-native-modal";
import moment from "moment";
import PaystackWebView from 'react-native-paystack-webview'
import wallet from  '../../asset/wallet.png';


let platform = Platform.OS;

let platformSpecificStyle = {}

if(platform === 'ios') { 
  platformSpecificStyle = {
    paddingTop: 30
  } 
}

const { State: TextInputState } = TextInput;

const { height } = Dimensions.get('window');
const INIT_HEIGHT = 70;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class WalletScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      fullname:'',
      userEmail:'',
      isModalVisible:false,
      amount:'',
      fadeAnim: new Animated.Value(0), // Initial value 
      loader: false,
      balance:0.00,
      history:[],
      historyLoad:false,
    }

    this.animatedHeight = new Animated.Value(INIT_HEIGHT);
  }

async componentDidMount() {
  let userData = await AsyncStorage.getItem('userData');
  this.setState({
    userEmail:JSON.parse(userData).email,
    fullname: JSON.parse(userData).fullname,
  })
  this.get_balance();
  this.get_history();
}



componentWillUnmount() {
  
}


openModal = () =>{
  this.setState({ isModalVisible: true });
}

start_trans = async (price) => {
  if(price <= 0 || !price){
    Toast.show('Invalid amount');
    return false
  }
  this.setState({
    loader:true
  })
  let token = await AsyncStorage.getItem('userToken');
  let ref = false
    if (token !== null) {
      token  = JSON.parse(token);
      await fetch(setup.endPoint+"/transaction/start",{
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
          body: JSON.stringify({
            "amount": price,
          })
      })
      .then((response)=>{
        return response.json()
      }).then( (res)=> {
          if(res.status ==='success'){
              ref = res.data.reference
          }else{
            ref = false
          }
      })
    }
    return ref
}


close_trans = async (price, ref) => {
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      await fetch(setup.endPoint+"/transaction/close",{
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
          body: JSON.stringify({
            "trans_ref": ref,
            "amount": price
          })
      })
      .then((response)=>{
        return response.json()
      }).then( (res)=> {
        if(res.status ==='success'){
          this.add_wallet(price, ref);
        }else{
          this.setState({
            loader:false,
          })
        }
      })
    }
}

add_wallet = async (price, ref) => {
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      await fetch(setup.endPoint+"/wallet/credit",{
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
          body: JSON.stringify({
            "trans_ref": ref,
            "amount": price
          })
      })
      .then((response)=>{
        return response.json()
      }).then( (res)=> {
        if(res.status ==='success'){
          this.setState({
            loader:false,
            isModalVisible:false,
            balance:res.data.value,
            amount:''
          })
          this.get_history()
        }else{
          this.setState({
            loader:false,
          })
        }
      })
    }
}

get_balance = async () => {
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      await fetch(setup.endPoint+"/wallet/balance",{
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
      })
      .then((response)=>{
        return response.json()
      }).then( (res)=> {
        console.log(res)
        if(res.status ==='success'){
          this.setState({
            balance:res.data.balance.value,
          })
          Toast.show('Balance updated');
        }
      })
    }
}

get_history = async () => {
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      await fetch(setup.endPoint+"/wallet/history",{
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
      })
      .then((response)=>{
        return response.json()
      }).then( (res)=> {
        console.log(res)
        if(res.status ==='success'){
          this.setState({
            history:res.data,
            historyLoad:true
          })
        }
      })
    }
}


 
  render() {
    const{isModalVisible,amount,fullname,userEmail,loader,balance,history,shift} = this.state;
    return (
      <ScrollView style={[platformSpecificStyle, {width:'100%',height:'90%',backgroundColor:'#eceff1'}]}>
        <View style={{width:'100%',paddingTop:(6*windowHeight)/100,alignItems:'center'}}>
          <View style={styles.header}>
            <TouchableOpacity style={{width:"10%"}} onPress={() => this.props.navigation.popToTop()}>
              <Icon name='arrow-back'  size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingHorizontal: (6*windowWidth)/100}}>
          <Text style={{color:'black',fontSize: 0.09*windowWidth}}>
            Wallet
          </Text>
        </View>

        <View style={{marginHorizontal:(6*windowWidth)/100, flexDirection:'row',alignItems:'center', padding:(6*windowWidth)/100,  borderRadius:10, marginTop:(2*windowHeight)/100, elevation:8, backgroundColor:"white"}}>
          <View style={{flex:1}}>
            <Image  style={{height: (20*windowWidth)/100,width:(20*windowWidth)/100}} resizeMode='contain' source={wallet} />
          </View>
          <View style={{flex:2,marginLeft:(5*windowWidth)/100}}>
            <Text style={{color:'black',fontSize: 0.05*windowWidth}}>
              Your Wallet
            </Text>

            <Text style={{color:'gray',fontSize: 0.04*windowWidth}}>
            Details
            </Text>

            <View style={{flexDirection:'row',borderRadius:10,marginTop:(1*windowHeight)/100}}>
              <View style={{flex:1}}>
                <Text style={{fontSize: 0.045*windowWidth,color:'black'}}>
                N{balance} 
                </Text>
                <Text style={{fontSize: 0.03*windowWidth,color:'gray'}}>
                Balance
                </Text>
              </View>
            </View>
          </View>

        </View>


        <TouchableOpacity activeOpacity={.8} onPress={this.openModal}
        style={{marginHorizontal:(6*windowWidth)/100,backgroundColor:'#ffa726',marginTop:(2*windowHeight)/100,padding:(5*windowWidth)/100,borderRadius:10,justifyContent:'center',alignItems:'center', elevation: 8 }}>
          <Text style={{fontSize: 0.034*windowWidth,color:'black'}}>
            LOAD WALLET
          </Text>
        </TouchableOpacity>

        <View style={{paddingHorizontal: (6*windowWidth)/100,marginTop:(2*windowHeight)/100}}>
          <Text style={{color:'black',fontSize: 0.045*windowWidth}}>
            All Transactions
          </Text>
          <View style={{marginTop:(4*windowWidth)/100 }}>

          {history.map((item, i) => (
            <View key={item.id} style={{flex:1,flexDirection:'row',paddingVertical:(4*windowWidth)/100,borderTopWidth:1,borderTopColor:'#bdbdbd'}}>
              <View style={{flex:1}}>
                <Text style={{fontSize: 0.035*windowWidth}}>
                  {moment(item.createdAt).format('l')} {moment(item.createdAt).format('LT')}
                </Text>
              </View>
              <View style={{flex:1,alignItems:'flex-end'}}>
                <Text style={{fontSize: 0.035*windowWidth,color:item.type == 'deposit'?'green':'red'}}>
                  {item.type == 'deposit'?'+':'-'}N{item.amount}
                </Text>
              </View>
            </View>
          ))}

            


            
          </View>
        </View>



      <Modal isVisible={isModalVisible}
       backdropOpacity={0}
       useNativeDriver={true}
       animationInTiming={300}
       animationOutTiming={300}
       onShow={() => { this.input.focus(); }}
       hideModalContentWhileAnimating ={true}
        onBackdropPress={() => this.setState({ isModalVisible: false })}
        style={{justifyContent:'flex-end',margin: 0}}>
          <Animated.View style={[{ backgroundColor: 'white',height: this.animatedHeight,borderColor: 'rgba(0, 0, 0, 0.1)'}]}>
            <View style={{flexDirection:'row',marginHorizontal:'5%',borderBottomColor:'red',alignItems:'center'}}>
             <View style={{flex:3}}>
              <TextInput
                  ref={(input) => { this.input = input; }}
                  placeholder='Enter Amount'
                  placeholderTextColor="#616161"
                  value ={amount}
                  onFocus={() => {
                      Animated.spring(this.animatedHeight, {
                          toValue: INIT_HEIGHT + (Platform.OS === 'ios' ? (70*windowWidth)/100 : 0),
                          friction: 6
                      }).start();
                  }}
                  onBlur={() => {
                      Animated.spring(this.animatedHeight, {
                          toValue: INIT_HEIGHT,
                          friction: 6
                      }).start();
                  }}
                  keyboardType='numeric'
                  inputContainerStyle={{borderWidth:0,borderBottomWidth:0,height:70}}
                  inputStyle={{color:'black'}}
                  onChangeText={ TextInputValue =>
                    this.setState({amount : TextInputValue }) }
                  containerStyle={{paddingHorizontal:0,margin:10}}
                />
             </View>
             <View style={{flex:1}}>

            </View>
            <PaystackWebView
                btnStyles={styles.fab}
                paystackKey='pk_test_0ee9066ca21b4e9323d75442c0cdb7e82a29b3bc'
                amount={parseInt(amount)}
                billingEmail={userEmail}
                billingMobile=''
                billingName={fullname}
                ActivityIndicatorColor='#ffa726'
                onSend={()=> this.start_trans(parseInt(amount))}
                onCancel={()=>Alert.alert('Payment Canceled')}
                onSuccess={(ref)=>this.close_trans(amount, ref)}
              >
                {
                  loader?(
                    <ActivityIndicator size="small" color="black"/>
                    ):(
                    <Icon name="send" type='material' size={20} color="black" />
                  )
                }
              </PaystackWebView>
            </View>
          </Animated.View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eceff1',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: '2%',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  details: {
    color: 'white',
    fontSize: 14,
  },
  services: {
    backgroundColor: '#B8860B',
    width: '100%',
    marginVertical: '3%',
    padding: '10%'
  },
  fabIcon: { 
    fontSize: 40, 
    color: 'white'
  },
  loader:{
    flex: 1,
    backgroundColor:'#eceff1',
    justifyContent: "center",
    alignItems: "center",
  },
  header:{
    zIndex:10,
    position:'absolute',
    width:'100%',
    padding:10,
    top:5,
    left:5
  },
  fab: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#ffa726', 
    borderRadius: 30, 
    elevation: 8,
    margin:10
  }, 
});

export default WalletScreen;