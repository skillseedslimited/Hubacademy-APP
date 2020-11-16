import React from 'react';
import { StyleSheet, ImageBackground, Image, Text, View, ScrollView,BackHandler, StatusBar, Alert, TouchableOpacity } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import setup from  '../../setup.js';
import { onSignIn } from "../../auth";
import {colors} from '../../res/colors'
import logo from  '../../asset/logo.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import Toast from "react-native-simple-toast";
import firebase from "react-native-firebase";
import { socket } from "../../socket_io";


 
class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
    }
  }

  componentDidMount() {
    socket.disconnect()
  }
  
  onBackPress = () => {
    return true;
  }

  login = () =>{
    if(!this.state.email){
      // return Alert.alert("Error!","Enter your email address and password");
      return Toast.show('Enter your email address');
    }
    NetInfo.fetch().then(state => {
      if(state.isConnected){
        this.sendData();
      }else{
        return Alert.alert("Error!","Check your network connection");
      }
    });
  }

  register = () =>{
    this.props.navigation.navigate('Signup');
  }
     sendData = async () => {
      this.setState({loading: true})
      try{
        const fcmToken = await firebase.messaging().getToken()
        fetch(setup.endPoint+'/auth/password/forgot', {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "email": this.state.email,
            })
          }).then((response) => response.json())
          .then((res) => {
            this.setState({loading: false})
            if(res.status == 'success'){
              Toast.show(res.message);
              Alert.alert('Massage!',res.message);
            }else if(res.status == 'fail'){
              Toast.show(res.message);
            }else{
              Alert.alert("Sorry!", "We cant process your resquest");
            }
       }).catch((error) => {
           console.error(error);
        });
      } catch (e) {
        // saving error
      }
    }
    isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }

    storeData = async (user) => {
      try{
        await AsyncStorage.setItem('userData', JSON.stringify(user.data))
        await AsyncStorage.setItem('userToken', JSON.stringify(user.token))
        } catch (e) {
          // saving error
        }
    }
    render() {
      return (
        <ImageBackground
          source={require('../../asset/bg.jpg')}
          style={{width: '100%', height:'100%'}}
          imageStyle={{
            resizeMode: 'cover',
            alignSelf: 'auto'
          }}>
       <View style={styles.container}>
        <ScrollView
                contentContainerStyle={styles.container1}
                scrollEventThrottle={16}
              >
          {/* <StatusBar backgroundColor={colors.black} barStyle="light-content" /> */}
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
          <View style={styles.topContent}>
            <Image  style={{height: 80,width:80}} resizeMode='contain' source={logo} />
          </View>
          <View style={styles.midContent}>
          <Text style={{color:'white'}}>Forgotten Your Password?</Text>
          </View>
         <Input
            placeholder='Enter your email address'
            placeholderTextColor="white"
            autoCapitalize="none"
            inputContainerStyle={styles.Input}
            inputStyle={{color:'white',marginLeft:10}}
            onChangeText={ TextInputValue =>
              this.setState({email : TextInputValue }) }
            containerStyle={{paddingHorizontal:0}}
            leftIcon={
              <Icon
                name='user'
                size={18}
                color='white'
              />
            }
          />   
          {!this.state.loading ? (
              <TouchableOpacity style={styles.button}  onPress={this.login}>
                  <View style={styles.signup}>
                      <Text style={styles.signupText}>
                            SEND
                      </Text>
                  </View> 
              </TouchableOpacity>
          ) : (
            <View style={styles.button}>
                <View style={styles.signup}>
                    <Text style={styles.signupText}>
                          SENDING...
                    </Text>
                </View> 
            </View>
          )}      
    
            </ScrollView>
        </View>
        </ImageBackground>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container1: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: '8%',
      paddingTop:25,
      paddingBottom: 10
    },
    topContent: {
      width: '100%',
      alignItems: 'center',
      marginTop: 50,
      marginBottom: 50
    },
    midContent: {
      width: '100%',
      alignItems: 'center',
      marginVertical: 25
    },
    button:{
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
        marginTop:'10%'
    },
    login:{
        width: '100%',
        padding: 14,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    loginText:{
        color: '#032D66',
        fontSize: 16
    },
    signup:{
        width: '100%',
        padding: 12,
        backgroundColor: '#B8860B',
        alignItems: 'center',
        borderRadius: 5,
        shadowRadius: 5,
        elevation: 0,
    },
    signin:{
      width: '100%',
      padding: 12,
      backgroundColor: 'white',
      alignItems: 'center',
      borderRadius: 5,
      shadowRadius: 5,
      elevation: 0,
  },
    signupText:{
        color: '#212121',
        fontSize: 14
    },
    signinText:{
      color: 'black',
      fontSize: 14
  },
    services:{
        width: '100%',
        padding: 14,
  
    },
    servicesText:{
        color: '#ccffff',
        fontSize: 16,
        opacity: 0.7
    },
    Input:{
      width: '100%', 
      marginTop: 20,
      borderWidth:1,
      borderColor:'white',
    },
    label:{
        fontSize: 12,
        margin: 0,
        padding: 0,
        color: '#032D66'
    },
    title:{
        fontSize: 22,
        marginBottom: 20,
        color: '#032D66'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    }
  })



export default LoginScreen;
