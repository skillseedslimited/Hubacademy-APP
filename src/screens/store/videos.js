import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions,Animated,Alert, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon,Divider,Button } from 'react-native-elements'
import { onSignOut } from "../../auth";
import moment from "moment";
import PaystackWebView from 'react-native-paystack-webview'
import Modal from "react-native-modal";

import Video from 'react-native-video';
//Import React Native Video to play video
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
//Media Controls to control Play/Pause/Seek and full screen

import Orientation from 'react-native-orientation-locker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const chatUsers = [
  {
      id: 2,
      name: "React native tutorial - By Emibrown",
      avatar: "http://tiny.cc/women2",
      chatId: 11,
      isOnline : true,
  },
  {
      id: 1,
      name: "What is life all about - By Jaja",
      avatar: "http://tiny.cc/women4",
      chatId: 10,
      isOnline : true,
  },
  {
      id: 3,
      name: "What if the world was one - By Emibrown",
      avatar: "http://tiny.cc/men1",
      chatId: 12,
      isOnline : false,
  },
  {
      id: 4,
      name: "Last Days - By Aya",
      avatar: "http://tiny.cc/men3",
      chatId: 13,
      isOnline : true,
  },
]



class StoreVideoScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state={
      videos:[],
      loading:true,
      isModalVisible:false,
      currentItem: null,
      userEmail:'',
      fullname:''
    }
   
  }

  componentDidMount() {
    this.getVideos();
  }

  getVideos = async () => {
    let token = await AsyncStorage.getItem('userToken');
    let userData = await AsyncStorage.getItem('userData');
    this.setState({
      userEmail:JSON.parse(userData).email,
      fullname: JSON.parse(userData).fullname,
    })
    if (token !== null) {
      token  = JSON.parse(token);
      fetch(setup.endPoint+"/store/list?type_id=1",{
        method: 'get',
          headers: {
            Accept: 'application/json',
            'Authorization': 'Bearer '+token
          },
      })
      .then((response)=>{
        if(response.status == 200){
          return response.json()
        }else if(response.status == 400){
          return null
        }else{
          return onSignOut().then(() => this.props.navigation.navigate('SignedOut'))
        }
      }).then((res)=> {
          if(res){
            // console.log(res.data)
            this.setState({
              videos:res.data,
              loading:false
            })
          }else{
            this.setState({
              videos:[],
              loading:false
            })
          }
      })
      .catch(error=>console.log(error)) //to catch the errors if any
    }
  }


  componentWillUnmount() {
  
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: () => (
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity>
            <Icon name='search'  size={23} color="black" />
          </TouchableOpacity>
        </View>
      ),
    };
  };

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
                console.log(res)
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
            console.log(res)
            this.directPurchase(price, ref);
          }else{
            this.setState({
              loader:false,
            })
          }
        })
      }
  }

  directPurchase= async (price, ref) => {
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        await fetch(setup.endPoint+"/store/purchase/content/direct",{
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+token
            },
            body: JSON.stringify({
              "transaction_ref": ref,
              "amount": price,
              "authorId": this.state.currentItem.owner.id,
	            "contentId": this.state.currentItem.id,
            })
        })
        .then((response)=>{
          return response.json()
        }).then( (res)=> {
          console.log(res)
          if(res.status ==='success'){
            this.setState({ 
              isModalVisible: false,
            });
            Alert.alert(res.message)
          }else{
            Alert.alert(res.message)
          }
        })
      }
  }

  walletPurchase= async (price) => {
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        await fetch(setup.endPoint+"/store/purchase/content",{
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+token
            },
            body: JSON.stringify({
              "amount": price,
              "authorId": this.state.currentItem.owner.id,
	            "contentId": this.state.currentItem.id,
            })
        })
        .then((response)=>{
          return response.json()
        }).then( (res)=> {
          console.log(res)
          if(res.status ==='success'){
            this.setState({ 
              isModalVisible: false,
            });
            Alert.alert(res.message)
          }else{
            Alert.alert(res.message)
          }
        })
      }
  }

openModal = (item) =>{
  this.setState({ 
    isModalVisible: true,
    currentItem: item
  });
}

  
 
  render() {
    const{videos,loading,isModalVisible,currentItem,userEmail,fullname} = this.state
    if(loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#ffa726"/>
        </View>
    )}
    return (
      <ScrollView style={{backgroundColor:'#eceff1'}}>
          <View style={styles.container}>
      {
        videos.length == 0 ? (
          <View>
            <TouchableOpacity
            onPress={this.getCoaches}>
              <Text style={{fontSize: 0.035*windowWidth}}>
                No video content in the store check back later. 
              </Text>
            </TouchableOpacity>
          </View>
        ): null
      }
      {videos.map((item, i) => (
         <TouchableOpacity key={item.id} activeOpacity={.8} onPress={() => this.openModal(item)}
         style={{width:(30*windowWidth)/100,backgroundColor:'#ffa726',marginTop:10,marginLeft:(3*windowWidth)/100}}>
           <View style={{flex:1}}>
             <ImageBackground
               source={require('../../asset/vcode.png')}
               // source={{uri:''}}
               style={{height:(13*windowHeight)/100,alignItems:'center',justifyContent:'center'}}
               imageStyle={{
               resizeMode: 'cover',
               alignSelf: 'auto'
             }}
             >
               <Icon name='ios-play' type="ionicon" size={0.07*windowWidth} color="white" />
             </ImageBackground>
             <View style={{flex:1,paddingHorizontal:10}}>
                 <Text style={{fontSize:0.03*windowWidth,paddingTop:5}}>
                     {item.title} - {item.owner.fullname} 
                 </Text>
                 {/* <Text style={{fontSize:0.03*windowWidth,paddingTop:5}}>
                  {moment(item.createdAt, "YYYYMMDD").fromNow()}
                 </Text> */}
                 <Text style={{fontSize:0.03*windowWidth,marginBottom:10}}>
                    Price: {item.currency}{item.price}
                 </Text>
             </View>
           </View>
         </TouchableOpacity>
      )
      )}      
       <Modal isVisible={isModalVisible}
       backdropOpacity={0.2}
       useNativeDriver={true}
       animationInTiming={300}
       animationOutTiming={300}
       hideModalContentWhileAnimating ={true}
        onBackdropPress={() => this.setState({ isModalVisible: false })}
        style={{justifyContent:'flex-end',margin: 0}}>
        {
          currentItem?(
            <Animated.View style={{ backgroundColor:'white',height:(30*windowHeight)/100,borderTopLeftRadius:20,borderTopRightRadius:20,borderColor: 'rgba(0, 0, 0, 0.1)',}}>
            <View style={{}}>
              <View style={{paddingHorizontal:'5%',paddingTop:10}}>
                  <Text style={{fontSize:0.05*windowWidth}}>Purchase Video</Text>
              </View>
              
                <View style={{marginHorizontal:'7%',marginTop:(3*windowHeight)/100}}>
                  <Text style={{fontSize:0.04*windowWidth}}>{currentItem.title} - By {currentItem.owner.fullname}</Text>
                  {/* <Text style={{fontSize:0.04*windowWidth}}>{moment(currentItem.createdAt, "YYYYMMDD").fromNow()}</Text> */}
                  <Text style={{fontSize:0.04*windowWidth}}>Price {currentItem.currency}{currentItem.price}</Text>
                </View>
                
                <TouchableOpacity onPress={() => this.walletPurchase(currentItem.price)} activeOpacity={.8} style={{paddingHorizontal:'7%',paddingTop:15}}>
                    <Text style={{fontSize:0.05*windowWidth,color:'#ffa726'}}>Purchase from wallet</Text>
                </TouchableOpacity>
                <PaystackWebView
                btnStyles={{paddingHorizontal:'7%',paddingTop:15}}
                paystackKey='pk_test_0ee9066ca21b4e9323d75442c0cdb7e82a29b3bc'
                amount={parseInt(currentItem.price)}
                billingEmail={userEmail}
                billingMobile=''
                billingName={fullname}
                ActivityIndicatorColor='#ffa726'
                onSend={()=> this.start_trans(parseInt(currentItem.price))}
                onCancel={()=>Alert.alert('Payment Canceled')}
                onSuccess={(ref)=>this.close_trans(currentItem.price, ref)}
              >
                <Text style={{fontSize:0.05*windowWidth,color:'#ffa726'}}>
                  Direct purchase
                </Text>
              </PaystackWebView>
            </View>
          </Animated.View>
          ):(
            <Animated.View>
            </Animated.View>
          )
        }
            
        </Modal>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap:'wrap',
    flexDirection:'row',
    justifyContent:'flex-start',
    backgroundColor: '#eceff1',
    // paddingHorizontal:(2*windowWidth)/100
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
    padding: '10%',
  },
  fab: { 
    position: 'absolute', 
    width: 56, 
    height: 56, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 20, 
    bottom: 20, 
    backgroundColor: '#032D66', 
    borderRadius: 30, 
    elevation: 8 
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
  mediaPlayer: {
    position: 'absolute',
    alignItems:'center',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
});

export default StoreVideoScreen;