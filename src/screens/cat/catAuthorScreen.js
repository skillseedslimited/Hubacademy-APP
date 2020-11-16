import React from 'react';
import { StyleSheet, Dimensions, ImageBackground, Text,ActivityIndicator, View, ScrollView, Alert, Platform,StatusBar, Button, BackHandler, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon } from 'react-native-elements'
import { onSignOut } from "../../auth";
import CatsComponent from '../../components/CatsComponent'
import PaystackWebView from 'react-native-paystack-webview'



const {height} = Dimensions.get('window');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let platform = Platform.OS;

let platformSpecificStyle = {}

if(platform === 'ios') { 
  platformSpecificStyle = {
    paddingTop: 30
  } 
}




class CatAuthorScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      cat:'',
      settings:{},
      userEmail:'',
      loading:true,
      authors:[],
      aloading:true,
      closeAmount:''
    }
   
  }

  componentDidMount() {
   this.getAuthors();
   this.getSettings().then(()=>{
    this.getCat();
   });
   console.log(this.props.navigation.state.params.id)
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
              this.setState({
                settings:res.data,
              })
            }
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }


getAuthors = async () => {
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      fetch(setup.endPoint+"/account/user/list/authors/category/"+this.props.navigation.state.params.id,{
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
              if(res.data){
                this.setState({
                  authors:res.data,
                  aloading:false
                })
              }else{
                this.setState({
                  authors:[],
                  aloading:false
                })
              }  
          }else{
            this.setState({
              authors:[],
              aloading:false
            })
          }
      })
      .catch(error=>console.log(error)) //to catch the errors if any
    }
}



start_trans = async () => {
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
            "amount": parseInt(this.state.settings.global_subscription_amount),
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


getCat = async () => {
  let token = await AsyncStorage.getItem('userToken');
  let userData = await AsyncStorage.getItem('userData');
  this.setState({
    userEmail:JSON.parse(userData).email,
  })
    if (token !== null) {
      token  = JSON.parse(token);
      fetch(setup.endPoint+"/content/category/"+this.props.navigation.state.params.id,{
          method: 'get',
          headers: {
            Accept: 'application/json',
            'Authorization': 'Bearer '+token
          },
      })
      .then(response => response.json())
      .then((res)=> {
          if(res.status =='success'){
              this.setState({
                cat:res.data,
                loading:false
              })
          }else{
            onSignOut().then(() => this.props.navigation.navigate('SignedOut'))
          }
      })
      .catch(error=>console.log(error)) //to catch the errors if any
    }
}

subscribe = async () => {
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
        onPress: () => this.subscribeAuthor() 
      }
    ],
    { cancelable: false }
  );
}

subscribeAuthor = async () => {
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
            "categoryId": this.props.navigation.state.params.id,
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

  

  
 

  

  componentWillUnmount() {
  
  }

  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     headerRight: () => (
  //       <View style={{ paddingHorizontal: 20 }}>
  //         <TouchableOpacity>
  //           <Icon name='search'  size={23} color="black" />
  //         </TouchableOpacity>
  //       </View>
  //     ),
  //   };
  // };




 
  render() {
    const{cat,settings,userEmail,loading,aloading,authors} = this.state;
    // if(loading){
    //   return( 
    //     <View style={styles.loader}> 
    //       <ActivityIndicator size="large" color="#fff3e0"/>
    //     </View>
    // )}
    return (
      <ScrollView style={[styles.container]}>
          {
            Platform.OS === 'ios'?<StatusBar  barStyle="light-content" />:<StatusBar  barStyle="dark-content" />
          }
        <View style={{width:'100%',height:(height/100)*60, backgroundColor:'gray'}}>
          <View style={styles.header}>
            <TouchableOpacity style={[platformSpecificStyle,{width:"10%"}]} onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back'  size={23} color="white" />
            </TouchableOpacity>
          </View>
          {loading ? 
            (
              <ActivityIndicator style={{position: 'absolute',top:'50%',left:'45%'}} size="large" color="#fff3e0"/>
            ) :
            (
              <ImageBackground
              source={{uri:setup.baseUrl+'/images/'+cat.image_url}}
              style={{width: '100%', height:'100%', alignItems:'center'}}
              imageStyle={{
                resizeMode: 'cover',
                alignSelf: 'auto'
              }}>
                <View
                  style={{width: '100%', height:'100%',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingTop:'50%',paddingLeft:'5%',paddingRight:'5%'}}
                  >
                  <Text style={{fontSize:20,color:'white'}}>
                    {cat.name}
                  </Text>
                  <Text style={{fontSize:14,color:'white'}}>
                    {cat.description}
                  </Text>
                  {
                    settings.global_subscription_by == 'category'?(
                      <TouchableOpacity activeOpacity={.8}
                      onPress={() => this.subscribe()}
                      style={{backgroundColor:'#f57c00',paddingVertical:10,paddingHorizontal:10}}>
                      <Text style={{fontSize: 0.03*windowWidth,color:'black'}}>
                          {'SUBSCRIBE NOW'}
                        </Text>
                      </TouchableOpacity>
                    ): null
                  }
                </View>
             </ImageBackground> 
            )
          }
          <ImageBackground
           style={{width: '100%', height:'100%',}}>

          </ImageBackground> 
        </View>
        <View style={{padding:20}}> 
          <Text style={{fontSize:18,color:'#f57c00'}}>
            Authors
          </Text>
        </View>
        {aloading? (
                <View style={{  flex: 1,
                  backgroundColor:'#eceff1',
                  paddingHorizontal:15
                }}>
               <ActivityIndicator size="large" color="#f57c00"/>
             </View>
            ): 
             (
                <View style={{  flex: 1,
                  flexDirection:'row',
                  backgroundColor:'#eceff1',
                  flexWrap:'wrap',
                  paddingHorizontal:15
                }}>
                  {authors.map((item, i) => (
                    <CatsComponent key={item.id} navigation={this.props.navigation} screenName="Author" id={item.id} name={item.username} image={setup.baseUrl+'/images/'+item.image_url} size={{height:100,width:100}}/>
                  )
                  )}    
                    
              </View>
            )
            }
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
    backgroundColor:'#fff3e0',
    justifyContent: "center",
    alignItems: "center",
  },
  header:{
    zIndex:10,
    position:'absolute',
    width:'100%',
    padding:10,
    top:0,
  }
});

export default CatAuthorScreen;