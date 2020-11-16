import React from 'react';
import { StyleSheet, KeyboardAvoidingView, ImageBackground, Image, Text, View, ScrollView,BackHandler, StatusBar, Alert, TouchableOpacity } from 'react-native';
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




class SignupScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        firstname: '',
        lastname:'',
        email: '',
        password: '',
        cpassword: '',
        auth_token: ''
      }
    }
  
    static navigationOptions = { 
      title: 'Log in',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
     }; 

     onBackPress = () => {
        return true;
      }

      register = () =>{
        if(!this.state.firstname || !this.state.lastname || !this.state.email || !this.state.password || !this.state.cpassword){
          // return Alert.alert("Error!","Enter your email address and password");
          return Toast.show('All field are required');
        }else if(this.state.password != this.state.cpassword){
          return Toast.show('Password mismatch');
        }
        NetInfo.fetch().then(state => {
          if(state.isConnected){
            this.sendData();
          }else{
            return Alert.alert("Error!","Check your network connection");
          }
        });
      }

      login = () =>{
        this.props.navigation.navigate('Login');
      }

      sendData = async () => {
        this.setState({loading: true})
        try{
          const fcmToken = await firebase.messaging().getToken()
          fetch(setup.endPoint+'/auth/register', {
              method: 'post',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                'firstname': this.state.firstname,
                'lastname':this.state.lastname,
                'email': this.state.email,
                'role': "87",
                'fcmToken': fcmToken,
                'password': this.state.password,
              })
            }).then((response) => response.json())
            .then((res) => {
              console.log(res)
              this.setState({loading: false})
              if(res.status == 'success'){
                this.storeData(res);
                // this.getData(res.token);
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
          style={{width: '100%', height: '100%'}}
        >
        <View style={styles.container}>
        <ScrollView
                contentContainerStyle={styles.container1}
                scrollEventThrottle={16}
              >
          {/* <StatusBar backgroundColor={colors.black} barStyle="dark-content" /> */}
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
          <View style={styles.topContent}>
            <Image  style={{height: 50,width:50}} resizeMode='contain' source={logo} />
          </View>
          {/* <View style={{width: '100%'}}>
            <Text style={styles.label}>EMAIL</Text>
          </View> */}
        
          <Input
            placeholder='First Name'
            placeholderTextColor="white"
            inputStyle={{color:'white',marginLeft:10}}
            inputContainerStyle={styles.Input}
            onChangeText={ TextInputValue =>
              this.setState({firstname : TextInputValue }) }
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
            placeholder='Last Name'
            placeholderTextColor="white"
            inputStyle={{color:'white',marginLeft:10}}
            inputContainerStyle={styles.Input}
            onChangeText={ TextInputValue =>
              this.setState({lastname : TextInputValue }) }
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
            placeholder='Email Address'
            placeholderTextColor="white"
            autoCapitalize="none"
            inputContainerStyle={styles.Input}
            inputStyle={{color:'white',marginLeft:10}}
            onChangeText={ TextInputValue =>
              this.setState({email : TextInputValue }) }
            containerStyle={{paddingHorizontal:0}}
            leftIcon={
              <Icon
                name='envelope'
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
           <Input
            placeholder='Re-type Password'
            placeholderTextColor="white"
            inputContainerStyle={styles.Input}
            inputStyle={{color:'white',marginLeft:10}}
            onChangeText={ TextInputValue =>
              this.setState({cpassword : TextInputValue }) }
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
          <View style={styles.midContent}>
          </View>
          {!this.state.loading ? (
              <TouchableOpacity style={styles.button}  onPress={this.register}>
                  <View style={styles.signup}>
                      <Text style={styles.signupText}>
                        REGISTER
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
          <TouchableOpacity style={styles.button}  onPress={this.login}>
                  <View style={styles.signin}>
                      <Text style={styles.signinText}>
                            LOGIN
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
    flex: 1,
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
      marginTop: '15%',
      marginBottom: 10
    },
    midContent: {
      width: '100%',
      alignItems: 'center',
      marginVertical: 15
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



export default SignupScreen
