import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View,TouchableOpacity, ImageBackground, StatusBar,ActivityIndicator, Dimensions, ScrollView, BackHandler } from 'react-native';
import {today} from '../../actions/Reflections'
import CatComponent from '../../components/CatComponent'
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup.js';
import { onSignOut } from "../../auth";
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements'
import { socket } from "../../socket_io";





const {height} = Dimensions.get('window');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const mainHeight = (45*windowHeight)/100;





class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      reflection: null,
      loading:true,
      cat:[],
      cloading:true,
      songloaded:false
    }
  }


  componentDidMount() {
    this.getCat();
    this.getReflection()
    socket.connect()
  }

  getReflection = async () => {
    let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      fetch(setup.endPoint+"/reflection/today",{
          method: 'get',
          headers: {
            Accept: 'application/json',
            'Authorization': 'Bearer '+token
          },
      })
      .then(response => {
          if(response.status == 200){
            return response.json()
          }else if(response.status == 400){
            return null
          }else{
            onSignOut().then(() => this.props.navigation.navigate('SignedOut'))
          }
      })
      .then((res)=> {
          if(res){
              this.setState({
                reflection:res.data,
                loading:false
              })
          }else{
            this.setState({
              reflection:null,
              loading:false
            })
          }
      })
      .catch(error=>console.log(error)) //to catch the errors if any
    }
  }





getCat = async () => {
  let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/content/category/list",{
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Authorization': 'Bearer '+token
            },
        })
        .then(response => response.json())
        .then((res)=> {
            if(res.status ==='success'){
              AsyncStorage.setItem('hubCat', JSON.stringify(res.data)).then(() =>{
                this.setState({
                  cat:res.data,
                  cloading:false,
                })
              })
            }else{
              onSignOut().then(() => this.props.navigation.navigate('SignedOut'))
            }
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
}



render() {
  const{reflection,loading,cloading,cat,songloaded} = this.state;
  return (
    <View style={styles.container}>
        <StatusBar  backgroundColor="#eceff1" barStyle="dark-content" />
        <ScrollView>
        <View style={{flex:1,justifyContent:'space-between', alignItems:'center', height:(2*windowHeight)/100,flexDirection:'row', padding:18}}>
          <Text style={{position:'absolute', left:8, fontSize:0.035*windowWidth}} >Today's Reflection</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Reflections')} style={{position:'absolute', right:20}}>
            <Text style={{fontSize: 0.03*windowWidth}}>View all</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ImageBackground
          source={{uri:setup.baseUrl+'/images/'}}
          style={{width: '100%', height:mainHeight}}
          imageStyle={{
           resizeMode: 'cover',
           alignSelf: 'auto'
         }}
          >
           <View style={styles.reflection}>
                <View style={styles.cloader}> 
                  <ActivityIndicator size="large" color="#fff3e0"/>
                </View>
           </View>
         </ImageBackground>
         ): reflection ? 
         (
          <ImageBackground
          source={{uri:setup.baseUrl+'/images/'+reflection.image_link}}
          style={{width: '100%', height:mainHeight}}
          imageStyle={{
           resizeMode: 'cover',
           alignSelf: 'auto'
         }}
          >
           <View style={styles.reflection}>
               <Text style={{color:'#fff',fontWeight:"500",fontSize:0.035*windowWidth,textAlign:'center'}}>
                 {reflection.title}
               </Text>
               { reflection.content ? (
               <Text style={{color:'#fff',fontWeight:"500", width:350,fontSize:0.03*windowWidth,textAlign:'center'}}>
                       {reflection.content.slice(0,150)+ '...'}
               </Text>
                   ) : null }  
               <Text style={{color:'#fff',marginTop:20, marginBottom:14, textAlign:'center', fontSize:0.035*windowWidth}}>
                 -Relection by {reflection.author}-
               </Text>
               <TouchableOpacity onPress={()=> this.props.navigation.navigate('ReflectionDetails',{id:reflection.id})}>
                    <View>
                     <Icon name='ios-play' type="ionicon" size={0.07*windowWidth} color="white" />
                    </View>
               </TouchableOpacity>
           </View>
         </ImageBackground>
         ):
         (
          <ImageBackground
          source={{uri:setup.baseUrl+'/images/'}}
          style={{width: '100%', height:height/2 - 20,}}
          imageStyle={{
           resizeMode: 'cover',
           alignSelf: 'auto'
         }}
          >
           <View style={styles.reflection}>
               <Text style={{color:'#fff',fontWeight:"500",fontSize:0.035*windowWidth,textAlign:'center',marginBottom:20}}>
                 No Reflection for today
               </Text>
               <TouchableOpacity onPress={()=> this.props.navigation.navigate('Reflections')}>
                    <View>
                     <Icon name='ios-play' type="ionicon" size={0.07*windowWidth} color="white" />
                    </View>
               </TouchableOpacity>
           </View>
         </ImageBackground>
         )}
        
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Todo_List')} style={{width:'100%', alignItems:'center',backgroundColor:'#ff9800',paddingVertical:5}}>
          <Text style={{fontSize: 0.035*windowWidth}}>View all To-do list</Text>
        </TouchableOpacity>
        {cloading ? (
              <View style={styles.cloader}> 
              <ActivityIndicator size="large" color="#ff9800"/>
            </View>
          ):(
            <View style={styles.cat}>
            <View style={{flex:1,justifyContent:'space-between', alignItems:'center',flexDirection:'row', padding:10}}>
              <Text style={{fontSize:0.035*windowWidth, width:'50%'}}>Categories</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Cats')} style={{position:'absolute', right:20}}>
                <Text style={{fontSize: 0.03*windowWidth}}>View all</Text>
              </TouchableOpacity>
            </View>
            <View>
                <ScrollView 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                {cat.map((item, i) => (
                    <CatComponent key={item.id} navigation={this.props.navigation} marginR={5} marginL={5} screenName="CatDetails" id={item.id} name={item.name} image={setup.baseUrl+'/images/'+item.image_url} size={{height:(20*windowHeight)/100,width:(20*windowHeight)/100}}/>
                  )
                  )}       
                </ScrollView>
            </View>
        </View>
          )
          }
        </ScrollView>
    </View>
  );
}
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eceff1',
    },
    reflection: {
      width: '100%',
      height:mainHeight,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      alignItems:'center',
      justifyContent:'center'
    },
    cat: {
      paddingBottom:5
    },
    loader:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    cloader:{
      flex: 1,
      height:150,
      justifyContent: "center",
      alignItems: "center",
    }
  })

// export default HomeScreen;

export default HomeScreen