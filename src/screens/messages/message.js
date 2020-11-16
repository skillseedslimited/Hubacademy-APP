import React, { useState,useEffect,useContext} from 'react'
import { StyleSheet, Dimensions, Image, Text,ActivityIndicator, View, ScrollView, Alert, ImageBackground,Animated, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon, Button,Input } from 'react-native-elements'
import { onSignOut } from "../../auth";
import {Context} from '../../Store'
import dp from '../../asset/dp.jpg'



let platform = Platform.OS;

let platformSpecificStyle = {}

if(platform === 'ios') { 
  platformSpecificStyle = {
    paddingTop: 30
  } 
}




const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Messages = (props) => {

const [state, dispatch] = useContext(Context);



const onMessage = async(item)=>{
  props.navigation.navigate('Chat', {
    id:item.to_id,
    userName: item.to.name
  })
}


 



 
return(
  <View>
      <ScrollView style={[platformSpecificStyle,{width:'100%',height:'100%',backgroundColor:'#eceff1'}]}>
          <View style={{width:'100%',paddingTop:(6*windowHeight)/100,alignItems:'center'}}>
            <View style={styles.header}>
              <TouchableOpacity style={{width:"10%"}} onPress={() => props.navigation.goBack()}>
                <Icon name='arrow-back'  size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{paddingHorizontal: (6*windowWidth)/100}}>
            <Text style={{color:'black',fontSize: 0.09*windowWidth}}>
              Messages
            </Text>
          </View>

          <View style={{width:'100%',marginTop:10}}>

            {
               state.conversations.map(item => {
                return (
                  <TouchableOpacity key={item.id} activeOpacity={.8} onPress={() => onMessage(item)} style={{flex:1,flexDirection:'row',marginHorizontal:(6*windowWidth)/100,paddingVertical:20,alignItems:'center',borderBottomWidth:.8,borderBottomColor:'black'}}>
                  <View style={{width:60}}>
                    <Image  style={{height: 60,width:60, borderRadius:12,backgroundColor:'gray'}}  source={{uri:setup.baseUrl+'/images/'+item.to.photo || ''}} />
                  </View>
                  <View style={{flex:1,marginLeft:15}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                      <View style={{flex:1}}>
                        <Text numberOfLines={1} style={{fontSize:0.045*windowWidth,fontWeight:'bold'}}>{item.to.name}</Text>
                      </View>
                      {/* <View style={{flex:1,alignItems:'flex-end'}}>
                        <Icon name='circle' type='font-awesome' color='black' size={10} />
                      </View> */}
                    </View>
                    <View>
                      <Text numberOfLines={2} style={{fontSize:0.04*windowWidth}}>
                        {item.last_msg.content}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                )
              })
            }

          </View>
          <View style={{paddingVertical:70}}></View>
      </ScrollView>
      {
        !state.conversationsload?(
          <View style={styles.loader}> 
            <ActivityIndicator size="large" color="#ffa726"/>
          </View>
        ):null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  loader:{
    marginTop:10,
    position:'absolute',
    width:'100%',
    height:'100%',
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
});

export default Messages;