import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions,StatusBar, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon,Divider,Button } from 'react-native-elements'
import { onSignOut } from "../../auth";
import moment from "moment";
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
      audios:[],
      loading:true
    }
   
  }

  componentDidMount() {
    this.getAudios();
  }

  getAudios = async () => {
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/store/list?type_id=5",{
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
                audios:res.data,
                loading:false
              })
            }else{
              this.setState({
                audios:[],
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

  
 
  render() {
    const{audios,loading} = this.state
    if(loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#ffa726"/>
        </View>
    )}
    return (
      <ScrollView style={{backgroundColor:'#eceff1'}}>
      <View style={{flex:1, backgroundColor:'#eceff1',paddingVertical:(1*windowWidth)/100, paddingHorizontal:(2*windowWidth)/100}}>
      {
        audios.length == 0 ? (
          <View>
            <TouchableOpacity
            onPress={this.getCoaches}>
              <Text style={{fontSize: 0.035*windowWidth}}>
                No audio content in the store check back later. 
              </Text>
            </TouchableOpacity>
          </View>
        ): null
      }
      {audios.map((item, i) => (
        <TouchableOpacity key={item.id}
         style={{width:'100%',backgroundColor:'#ffa726',marginTop:(1*windowHeight)/100}}>
           <View style={{flex:1}}>
             <ImageBackground
              source={require('../../asset/audio.jpg')}
              style={{height:(18*windowHeight)/100,alignItems:'center',justifyContent:'center'}}
               imageStyle={{
               resizeMode: 'cover',
               alignSelf: 'auto',
               backgroundColor:'gray'
             }}
             >
               <Icon name='ios-play' type="ionicon" size={0.08*windowWidth} color="white" />
             </ImageBackground>
             <View style={{flex:1,paddingHorizontal:(3*windowWidth)/100}}>
                 <Text style={{fontSize:0.035*windowWidth,paddingTop:(2*windowWidth)/100}}>
                     {item.title} - {item.owner.fullname}
                 </Text>
                 <View style={{flex:1,flexDirection:'row'}}>
                  <Text style={{color:'#bf360c',fontSize:0.03*windowWidth,marginBottom:(2*windowWidth)/100}}>
                    Price: {item.currency}{item.price}
                  </Text>
                  <Text style={{color:'#bf360c',marginLeft:(5*windowWidth)/100,fontSize:0.03*windowWidth,marginBottom:(2*windowWidth)/100}}>
                    {moment(item.createdAt, "YYYYMMDD").fromNow()}
                  </Text>
                 </View>
             </View>
           </View>
         </TouchableOpacity>
      )
      )}      
        <StatusBar  backgroundColor="#eceff1" barStyle="dark-content" />
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eceff1',
    paddingHorizontal:10
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