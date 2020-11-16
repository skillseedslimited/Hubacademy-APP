import React from 'react';
import { StyleSheet, Dimensions, Image, Text,ActivityIndicator, View, ScrollView, Alert, ImageBackground,Animated, Platform, TouchableOpacity } from 'react-native';
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




const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class AuthorSubScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      subAuthor:[],
      subCategory:[],
      settings:{},
      authorLoading:true,
      catLoading:true
    }
  }

  componentDidMount() {
    this.getSettings().then(()=>{
      this.getSubAuthor();
      this.getSubCat()
    })
  }

  getSettings = async () => {
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/settings/global/subscription",{
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Authorization': 'Bearer '+token
            },
        })
        .then((response)=>{
          return response.json()
        }).then((res)=> {
            if(res.status ==='success'){
              console.log(res.data)
              this.setState({
                settings:res.data,
              })
            }
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }

  getSubAuthor = async () => {
    this.setState({
      loading:true
    })
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/subscription/subscriptions?subscription_type=subscription&subscription_genus=author",{
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Authorization': 'Bearer '+token
            },
        })
        .then(response => response.json())
        .then((res)=> {
            this.setState({
              subAuthor:res.data,
              authorLoading:false
            })
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }

  getSubCat = async () => {
    this.setState({
      loading:true
    })
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/subscription/subscriptions?subscription_type=subscription&subscription_genus=category",{
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Authorization': 'Bearer '+token
            },
        })
        .then(response => response.json())
        .then((res)=> {
            this.setState({
              subCategory:res.data,
              catLoading:true
            })
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
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
          this.add_wallet(price, ref);
        }else{
          this.setState({
            loader:false,
          })
        }
      })
    }
}


subscribe = async (authorId) => {
  Alert.alert(
    "Subscribe",
    "Are you sure you want to subscribe to this author?",
    [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { 
        text: "Yes", 
        onPress: () => this.subscribeAuthor(authorId) 
      }
    ],
    { cancelable: false }
  );
}

subscribeCat = async (CatId) => {
  Alert.alert(
    "Subscribe",
    "Are you sure you want to subscribe to this category?",
    [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { 
        text: "Yes", 
        onPress: () => this.subscribeCategory(CatId) 
      }
    ],
    { cancelable: false }
  );
}

subscribeAuthor = async (authorId) => {
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      await fetch(setup.endPoint+"/subscription/subscribe/author",{
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
          body: JSON.stringify({
            "duration":"weekly",
            "amount": parseInt(this.state.settings.global_subscription_amount),
            "authorId": authorId,
            "forceSubscription" : "no"
          })
      })
      .then((response)=>{
        return response.json()
      }).then( (res)=> {
          console.log(res)
          Alert.alert(res.message)
      })
    }
}

subscribeCategory = async (CatId) => {
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      await fetch(setup.endPoint+"/subscription/subscribe/category",{
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
          body: JSON.stringify({
            "duration":"weekly",
            "amount": parseInt(this.state.settings.global_subscription_amount),
            "categoryId": CatId,
            "forceSubscription" : "no"
          })
      })
      .then((response)=>{
        return response.json()
      }).then( (res)=> {
          console.log(res)
          Alert.alert(res.message)
      })
    }
}




 
  render() {
    const{subAuthor,subCategory,settings,authorLoading,catLoading} = this.state;
    if(settings.global_subscription_by == 'author'){
    return (
      <ScrollView style={[platformSpecificStyle,{width:'100%',height:'90%',backgroundColor:'#eceff1'}]}>
      <View style={{width:'100%',paddingTop:(6*windowHeight)/100,alignItems:'center'}}>
          <View style={styles.header}>
            <TouchableOpacity style={{width:"10%"}} onPress={() => this.props.navigation.popToTop()}>
              <Icon name='arrow-back'  size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingHorizontal: (6*windowWidth)/100}}>
          <Text style={{color:'black',fontSize: 0.09*windowWidth}}>
            My Subsriptions
          </Text>
          <Text style={{color:'black',fontSize: 0.035*windowWidth}}>
            Author
          </Text>
        </View>
        {
          authorLoading? (
            <View style={styles.loader}> 
              <ActivityIndicator size="large" color="#ffa726"/>
            </View>
          ): (
            
              subAuthor.length == 0 ? (
                <View style={{paddingHorizontal: (6*windowWidth)/100, marginTop:(2*windowWidth)/100}}>
                  <Text style={{fontSize: 0.035*windowWidth}}>
                    No subscription available. 
                  </Text>
                </View>
              ): (
        
            <View style={{paddingHorizontal: (6*windowWidth)/100}}>
            {subAuthor.map((item, i) => (
              <TouchableOpacity key={item.id} activeOpacity={.8}
              onPress={() =>this.props.navigation.navigate(`Author`, {id:item.data.id} )}
              style={{width:'100%',height:(15*windowHeight)/100, borderBottomWidth:1,borderBottomColor:'#bdbdbd'}}>
                <View style={{flex:1,flexDirection:'row', alignItems:'center'}}>
                <View style={{}}>
                  <ImageBackground
                  source={{uri:setup.baseUrl+'/images/'+item.data.photo || ''}}
                  imageStyle={{
                  resizeMode: 'cover',
                  alignSelf: 'auto',
                  borderRadius:10,
                  backgroundColor:'gray'
                  }}
                 style={{width:(12*windowWidth)/100,aspectRatio: 1}}>
                 </ImageBackground>
                 </View>
                 <View style={{flex:2, marginLeft:(3*windowWidth)/100}}>
                    <Text style={{fontSize: 0.04*windowWidth,marginBottom:'2%'}}>
                    {item.data.firstname}  {item.data.lastname}
                    </Text>
                </View>
                <View style={{flex:1,}}>
                  {
                    !item.isExpired? (
                      <View style={{backgroundColor:'black',justifyContent:'center',alignItems:'center',borderRadius:5,padding:0.02*windowWidth}}>
                        <Text style={{color:'white',fontSize:0.03*windowWidth}}>
                        {moment(item.expiresAt).format("MMMM Do")}
                        </Text>
                      </View> 
                    ) : (
                      <TouchableOpacity  onPress={() => this.subscribe(item.data.id)} activeOpacity={.8} style={{backgroundColor:'#e0e0e0',justifyContent:'center',alignItems:'center',borderRadius:5,padding:0.02*windowWidth}}>
                        <Text style={{color:'#757575',fontSize:0.03*windowWidth}}>
                          RENEW
                        </Text>
                      </TouchableOpacity>
                    )
                  }
                </View>
                </View>
              </TouchableOpacity>
            )
            )}   
            </View>
          ))
        }
      </ScrollView>
    );
    }else if(settings.global_subscription_by == 'category'){
      return (
        <ScrollView style={[platformSpecificStyle,{width:'100%',height:'90%',backgroundColor:'#eceff1'}]}>
          <View style={{width:'100%',paddingTop:(6*windowHeight)/100,alignItems:'center'}}>
            <View style={styles.header}>
              <TouchableOpacity style={{width:"10%"}} onPress={() => this.props.navigation.popToTop()}>
                <Icon name='arrow-back'  size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{paddingHorizontal: (6*windowWidth)/100}}>
            <Text style={{color:'black',fontSize: 0.09*windowWidth}}>
              My Subsriptions
            </Text>
            <Text style={{color:'black',fontSize: 0.035*windowWidth}}>
            Category
            </Text>
          </View>
          {
            catLoading? (
              <View style={styles.loader}> 
                <ActivityIndicator size="large" color="#ffa726"/>
              </View>
            ): (
              
                subCategory.length == 0 ? (
                  <View style={{paddingHorizontal: (6*windowWidth)/100, marginTop:(2*windowWidth)/100}}>
                    <Text style={{fontSize: 0.035*windowWidth}}>
                      No subscription available. 
                    </Text>
                  </View>
                ): (
          
              <View style={{paddingHorizontal: (6*windowWidth)/100}}>
              {subCategory.map((item, i) => (
                <TouchableOpacity key={item.id} activeOpacity={.8}
                onPress={() =>this.props.navigation.navigate(`Author`, {id:item.data.id} )}
                style={{width:'100%',height:(15*windowHeight)/100, borderBottomWidth:1,borderBottomColor:'#bdbdbd'}}>
                  <View style={{flex:1,flexDirection:'row', alignItems:'center'}}>
                  <View style={{}}>
                    <ImageBackground
                    source={{uri:setup.baseUrl+'/images/'+item.data.photo || ''}}
                    imageStyle={{
                    resizeMode: 'cover',
                    alignSelf: 'auto',
                    borderRadius:10,
                    backgroundColor:'gray'
                    }}
                   style={{width:(12*windowWidth)/100,aspectRatio: 1}}>
                   </ImageBackground>
                   </View>
                   <View style={{flex:2, marginLeft:(3*windowWidth)/100}}>
                      <Text style={{fontSize: 0.04*windowWidth,marginBottom:'2%'}}>
                      {item.data.name}
                      </Text>
                  </View>
                  <View style={{flex:1,}}>
                    {
                      !item.isExpired? (
                        <View style={{backgroundColor:'black',justifyContent:'center',alignItems:'center',borderRadius:5,padding:0.02*windowWidth}}>
                          <Text style={{color:'white',fontSize:0.03*windowWidth}}>
                          {moment(item.expiresAt).format("MMMM Do")}
                          </Text>
                        </View> 
                      ) : (
                        <TouchableOpacity  onPress={() => this.subscribe(item.data.id)} activeOpacity={.8} style={{backgroundColor:'#e0e0e0',justifyContent:'center',alignItems:'center',borderRadius:5,padding:0.02*windowWidth}}>
                          <Text style={{color:'#757575',fontSize:0.03*windowWidth}}>
                            RENEW
                          </Text>
                        </TouchableOpacity>
                      )
                    }
                  </View>
                  </View>
                </TouchableOpacity>
              )
              )}   
              </View>
            ))
          }
        </ScrollView>
      );
    }else{
      return(
        <ScrollView style={[platformSpecificStyle,{width:'100%',height:'90%',backgroundColor:'#eceff1'}]}>
            <View style={{width:'100%',paddingTop:(6*windowHeight)/100,alignItems:'center'}}>
              <View style={styles.header}>
                <TouchableOpacity style={{width:"10%"}} onPress={() => this.props.navigation.popToTop()}>
                  <Icon name='arrow-back'  size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{paddingHorizontal: (6*windowWidth)/100}}>
              <Text style={{color:'black',fontSize: 0.09*windowWidth}}>
                My Subsriptions
              </Text>
              <Text style={{color:'black',fontSize: 0.035*windowWidth}}>
                Loading...
              </Text>
            </View>
        </ScrollView>
      )
    }
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
    height: (40*windowHeight)/100,
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
    left:(0.1*windowHeight)/100
  },
  fab: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#ffa726', 
    borderRadius: 30, 
    elevation: 8 
  }, 
});

export default AuthorSubScreen;