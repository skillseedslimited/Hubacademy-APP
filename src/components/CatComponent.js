import React, { Component } from 'react'
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const CatComponent = ({navigation, id, image, name, screenName, size,marginL=0,marginR=0}) =>
  <TouchableOpacity 
  onPress={() =>
    navigation.navigate(`${screenName}`, {id:id} )}
  style={{borderRadius:10,marginBottom:(1*windowHeight)/100,marginLeft:marginL,marginRight:marginR,paddingHorizontal:0,paddingVertical:0, ...size}}>
   <ImageBackground
      source={{uri:image}}
      style={{width: '100%', height:'100%',borderRadius:10}}
      imageStyle={{
       resizeMode: 'cover',
       alignSelf: 'auto',
       borderRadius:10
      }}
      
   >
       <View
      style={{width: '100%',borderRadius:10, justifyContent:'flex-end', height:'100%',backgroundColor:'rgba(0, 0, 0, 0.6)'}}
      >
     <Text style={{fontSize:0.032*windowWidth,color:'white',padding:0.03*windowWidth}}>{name}</Text>
     </View>
   </ImageBackground>
  </TouchableOpacity>




export default CatComponent
