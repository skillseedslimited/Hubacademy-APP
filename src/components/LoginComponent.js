import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import { Icon } from 'react-native-elements'
import { onSignOut } from "../auth";


const loginIcon = ({navigation, icon, name, type,screenName}) =>
  <TouchableOpacity style={{backgroundColor:"#fff",width:'30%', height:100, marginBottom:10,padding:15}}
  onPress={() => onSignOut().then(() => navigation.navigate(`${screenName}`))}
  >
    <View style={{flex:2,justifyContent:"center", alignItems:'center'}}>
        <Icon name ={icon} type={type} size={15} color="#003366" iconStyle={{width:15,height:15,margin:0,padding:0}} containerStyle={{borderTopWidth:1,borderRightWidth:1,borderColor:"#003366",paddingHorizontal:10,paddingVertical:10,borderRadius:20}} />         
    </View>
    <View style={{flex:1,justifyContent:"center", alignItems:'center'}}>
        <Text style={{textAlign:'center',fontSize:10}}>
          {name}
        </Text>
    </View>
  </TouchableOpacity>




export default loginIcon
