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
      // username: 'sami@gmail.com',
      // password: '11223344E',
      username: '',
      password: '',
    }
  }

  componentDidMount() {
    socket.disconnect()
  }
  
  onBackPress = () => {
    return true;
  }

  login = () =>{
    if(!this.state.username || !this.state.password){
      // return Alert.alert("Error!","Enter your email address and password");
      return Toast.show('Enter your email address and password');
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

  forgotpassword = () =>{
    this.props.navigation.navigate('forgotpassword');
  }

  

     sendData = async () => {
      this.setState({loading: true})
      try{
        const fcmToken = await firebase.messaging().getToken()
        fetch(setup.endPoint+'/auth/login', {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "email": this.state.username,
              "password": this.state.password,
              'fcmToken': fcmToken
            })
          }).then((response) => response.json())
          .then((res) => {
            this.setState({loading: false})
            if(res.status == 'success'){
              this.storeData(res);
              onSignIn().then(() => this.props.navigation.navigate('SignedIn'));
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

    getData = async (token) => {
      fetch(setup.endPoint+'/reflection/today', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token,
        }
      }).then((response) => response.json())
      .then((res) => {
        if(res.data){
          if(!this.isEmpty(res.data)){
            this.props.addReflection(res.data);
            AsyncStorage.setItem('toDayReflection', JSON.stringify(res.data)).then(() =>{
             onSignIn().then(() => this.props.navigation.navigate('SignedIn'));
            })
          }else{
            onSignIn().then(() => this.props.navigation.navigate('SignedIn'));
          }
        }else{
          return
        }
      })
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
            <Image  style={{height: 100,width:100}} resizeMode='contain' source={logo} />
          </View>
         <Input
            placeholder='Email'
            placeholderTextColor="white"
            autoCapitalize="none"
            inputContainerStyle={styles.Input}
            inputStyle={{color:'white',marginLeft:10}}
            onChangeText={ TextInputValue =>
              this.setState({username : TextInputValue }) }
            containerStyle={{paddingHorizontal:0}}
            leftIcon={
              <Icon
                name='user'
                size={18}
                color='white'
              />
            }
          />
           <Input
            placeholder='Password'
            placeholderTextColor="white"
            inputContainerStyle={styles.Input}
            inputStyle={{color:'white',marginLeft:10}}
            onChangeText={ TextInputValue =>
              this.setState({password : TextInputValue }) }
            containerStyle={{paddingHorizontal:0}}
            secureTextEntry={true}
            leftIcon={
              <Icon
                name='lock'
                size={18}
                color='white'
              />
            }
          />
          <TouchableOpacity  onPress={this.forgotpassword} activeOpacity={.8} style={styles.midContent}>
          <Text style={{color:'white'}}>Forgot Your Password?</Text>
          </TouchableOpacity>
          {!this.state.loading ? (
              <TouchableOpacity style={styles.button}  onPress={this.login}>
                  <View style={styles.signup}>
                      <Text style={styles.signupText}>
                            LOGIN
                      </Text>
                  </View> 
              </TouchableOpacity>
          ) : (
            <View style={styles.button}>
                <View style={styles.signup}>
                    <Text style={styles.signupText}>
                          Connecting...
                    </Text>
                </View> 
            </View>
          )}      
          <TouchableOpacity style={styles.button}  onPress={this.register}>
                  <View style={styles.signin}>
                      <Text style={styles.signinText}>
                            REGISTER
                      </Text>
                  </View> 
            </TouchableOpacity>
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
