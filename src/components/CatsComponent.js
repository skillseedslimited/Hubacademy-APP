import React, { Component } from 'react'
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text
} from 'react-native'
const CatsComponent =({navigation, id, image, name, screenName, size}) =>
<TouchableOpacity 
onPress={() =>
  navigation.navigate(`${screenName}`, {id:id,name:name} )}
style={{marginHorizontal:5, backgroundColor: '#fff',marginBottom:20,paddingHorizontal:0,paddingVertical:0, ...size}}>
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
      style={{width: '100%',borderRadius:10, height:'100%',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingTop:'50%',paddingLeft:'5%',paddingRight:'5%'}}
      >
   <Text style={{fontSize:14,color:'white'}}>{name}</Text>
   </View>
 </ImageBackground>
</TouchableOpacity>



export default CatsComponent
