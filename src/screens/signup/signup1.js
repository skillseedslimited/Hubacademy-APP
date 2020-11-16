import React from 'react';
import { StyleSheet, Text, ScrollView, View, TextInput,BackHandler,Alert, StatusBar, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import setup from  '../../setup.js';





class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber:'',
      password: '',
      cpassword: '',
      auth_token: '',
      emailValidate:true,
      mobileNumberValidate:true,
      passwordMatch: true
    }
  }

  onBackPress = () => {
    return true;
  }

  signup = () =>{
    if(!this.state.firstName || !this.state.lastName
     || !this.state.email || !this.state.mobileNumber
     || !this.state.password || !this.state.cpassword){
      return Alert.alert("Invalied data","All field are required");
    }
    NetInfo.fetch().then(state => {
      if(state.isConnected){
        this.sendData();
      }else{
        return Alert.alert("Error!","Check your network connection");
      }
    });
  }

  sendData = async () => {
    this.setState({loading: true})
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
    try{
      await AsyncStorage.setItem('@storage_Key', 'stored value')
      fetch(setup.endPoint+'/register', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "firstname": this.state.firstName,
            "lastname": this.state.lastName,
            "email": this.state.email,
            "mobile_number": this.state.mobileNumber,
            "password": this.state.password,
            "c_password": this.state.cpassword
          })
        }).then((response) => response.json())
        .then((res) => {
          this.setState({loading: false})
          BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
          if(res.success){
            Alert.alert("Success", "Your account has been created successfully.");
            this.props.navigation.navigate('Login')
          }else if(res.error){
            Alert.alert("Error!", "Something went wrong");
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
  
    static navigationOptions = { 
      title: 'Sign up',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
     }; 


    validate = (text,type) => {
      if(type == 'email'){
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(text)){
          this.setState({email:text})
          this.setState({emailValidate:true})
        }else {
          this.setState({email:''})
          this.setState({emailValidate:false})
        }
      }
      if(type == 'mobileNumber'){
        let reg = /[7-9][0-9]{9}$/ ;
        if(reg.test(text)){
          this.setState({mobileNumber:text})
          this.setState({mobileNumberValidate:true})
        }else {
          this.setState({mobileNumber:''})
          this.setState({mobileNumberValidate:false})
        }
      }
      if(type == 'passwordMatch'){ 
        if(this.state.password == text){
          this.setState({cpassword:text})
          this.setState({passwordMatch:true})
        }else {
          this.setState({cpassword:''})
          this.setState({passwordMatch:false})
        }
      }
    }


    render() {1
      return (        
          <View style={styles.container1}>
            <StatusBar backgroundColor="#032D66" barStyle="light-content" />
            <ScrollView
                contentContainerStyle={styles.container}
                scrollEventThrottle={16}
              >
            <View style={{width: '100%'}}>
              <Text style={styles.label}>FIRST NAME</Text>
            </View>
            <TextInput 
              style={styles.Input}
              onChangeText={ TextInputValue =>
                this.setState({firstName: TextInputValue }) }
            />
            <View style={{width: '100%'}}>
              <Text style={styles.label}>LAST NAME</Text>
            </View>
            <TextInput 
              style={styles.Input}
              onChangeText={ TextInputValue =>
                this.setState({lastName: TextInputValue }) }
            />
            <View style={{width: '100%'}}>
              <Text style={styles.label}>EMAIL NAME</Text>
            </View>
            <TextInput 
              style={[styles.Input, 
                !this.state.emailValidate ? styles.validate:null]}
              keyboardType={'email-address'}
              onChangeText={(text) => this.validate(text,'email')}
            />
            <View style={{width: '100%'}}>
              <Text style={styles.label}>MOBILE NUMBER</Text>
            </View>
            <TextInput 
              style={[styles.Input, 
                !this.state.mobileNumberValidate ? styles.validate:null]}
              keyboardType={'numeric'}
              onChangeText={(text) => this.validate(text,'mobileNumber')}
            />
            <View style={{width: '100%'}}>
              <Text style={styles.label}>PASSWORD</Text>
            </View>
            <TextInput 
              secureTextEntry={true}
              style={styles.Input}
              onChangeText={ TextInputValue =>
                this.setState({password: TextInputValue }) }
            />
            <View style={{width: '100%'}}>
              <Text style={styles.label}>CONFIRM PASSWORD</Text>
            </View>
            <TextInput 
              style={[styles.Input, 
                !this.state.passwordMatch ? styles.validate:null]}
              secureTextEntry={true}
              onChangeText={(text) => this.validate(text,'passwordMatch')}
            />
            {!this.state.loading ? (
            <TouchableOpacity style={styles.button}  onPress={this.signup}>
                <View style={styles.signup}>
                    <Text style={styles.signupText}>
                          Sign up
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
         </ScrollView>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container1: {
      flex: 1,
      backgroundColor: 'white',
    },
    container: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: '8%',
      paddingTop: '5%',
    },
    button:{
        width: '100%',
        marginTop: 0,
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
        padding: 14,
        backgroundColor: '#B8860B',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#B8860B',
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 2,
    },
    signupText:{
        color: 'white',
        fontSize: 16
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
      padding: 2,
      marginBottom: 20,
      borderBottomWidth: 1, 
      borderColor: '#032D66'
    },
    validate:{
      borderColor: 'red'
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
  })

export default SignupScreen;