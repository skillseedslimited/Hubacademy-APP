import React from 'react';
import { StyleSheet, Dimensions,UIManager, TextInput, StatusBar, Text,ActivityIndicator, View, ScrollView, Alert, Platform,Animated, Keyboard, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon, Button,Input } from 'react-native-elements'
import { onSignOut } from "../../auth";
import CatsComponent from '../../components/CatsComponent'
import Toast from "react-native-simple-toast";
import Modal from "react-native-modal";
import moment from "moment";
import PaystackWebView from 'react-native-paystack-webview'
import { Avatar,Accessory } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker'



let platform = Platform.OS;

let platformSpecificStyle = {}

if(platform === 'ios') { 
  platformSpecificStyle = {
    paddingTop: 30
  } 
}


const { height } = Dimensions.get('window');
const INIT_HEIGHT = 70;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class WalletScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      loader: false,
      imageUrl: null,
      FirstName: "",
      lastName: "",
      phone: ""
    }

  }

async componentDidMount() {
  AsyncStorage.getItem("userData")
    .then(res => {
      console.log*('res')
      if (res !== null) {
        this.setState({
          FirstName: JSON.parse(res).firstname,
          lastName:JSON.parse(res).lastname,
          phone:JSON.parse(res).phone,
          imageUrl: setup.baseUrl+'/images/'+JSON.parse(res).photo || null,
        });
      }
    })
}

handleChoosePhoto = () => {
  const options = {
    title: 'Select Photo',
    noData: true,
  }
  ImagePicker.showImagePicker(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else {
      this.handleUploadPhoto(response);
    }
  })
}

createFormData = (photo) => {
  const data = new FormData();

  data.append("image", {
    name: photo.fileName,
    type: 'image/jpeg',
    uri:
    Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
  });

  return data;
}

handleUploadPhoto = async  (img) => {
  this.setState({
    loader:true,
    imageUrl: img.uri
  })
  let token = await AsyncStorage.getItem('userToken');
  let userData = await AsyncStorage.getItem('userData');
  if (token !== null) {
    token  = JSON.parse(token);
    userData  = JSON.parse(userData);
  fetch(setup.endPoint+"/user/profile/photo", {
    method: "PUT",
    body: this.createFormData(img),
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer '+token
    },
  })
    .then(response => response.json())
    .then(async res => {
      console.log(res)
      userData.photo = res.data.photo
      await AsyncStorage.setItem('userData', JSON.stringify(userData))
      this.setState({
        loader:false
      })
    })
    .catch(error => {
      console.log("upload error", error);
      this.setState({
        loader:false
      })
    });
  }
};



componentWillUnmount() {
  
}

update = async  () => {
  this.setState({
    loader:true,
  })
  let token = await AsyncStorage.getItem('userToken');
  let userData = await AsyncStorage.getItem('userData');
  if (token !== null) {
    token  = JSON.parse(token);
    userData  = JSON.parse(userData);
    let id = userData.id;
  fetch(setup.endPoint+"/account/user/"+id, {
    method: "PUT",
    body: JSON.stringify({
      'firstname': this.state.FirstName,
      'lastname':this.state.lastName,
      'phone': this.state.phone,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+token
    },
  })
    .then(response => response.json())
    .then(async res => {
      console.log(res)
      userData.firstname = this.state.FirstName
      userData.lastname = this.state.lastName
      userData.phone = this.state.phone
      await AsyncStorage.setItem('userData', JSON.stringify(userData))
      this.setState({
        loader:false
      })
    })
    .catch(error => {
      console.log("upload error", error);
      this.setState({
        loader:false
      })
    });
  }
};

 
  render() {
    const{loader,imageUrl,FirstName,lastName,phone} = this.state;
    return (
      <ScrollView style={[platformSpecificStyle, {width:'100%',height:'90%',backgroundColor:'#ffa726'}]}>
        <StatusBar  backgroundColor="#ffa726" barStyle="dark-content" />
        <View style={{width:'100%',paddingTop:(6*windowHeight)/100,alignItems:'center'}}>
          <View style={styles.header}>
            <TouchableOpacity style={{width:"10%"}} onPress={() => this.props.navigation.popToTop()}>
              <Icon name='arrow-back'  size={26} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      
        <View style={{flex:1, justifyContent:'center', alignItems:'center' }}>
          <View style ={{justifyContent:'center', alignItems:'center', paddingTop:5}}>
            {
              imageUrl?(
                <Avatar
                    title="E"
                    rounded
                    showEditButton
                    onPress={() => this.handleChoosePhoto()}
                    onEditPress={() => this.handleChoosePhoto()}
                    activeOpacity={0.7}
                    size={140}
                    source={{
                    uri: imageUrl,
                    }}
                />
              ):(
                <Avatar
                    title="E"
                    rounded
                    showEditButton
                    onPress={() => this.handleChoosePhoto()}
                    onEditPress={() => this.handleChoosePhoto()}
                    activeOpacity={0.7}
                    size={140}
                />
              )
            }
          
          </View>
          {
            loader&&(
              <Text style={{color:'white', fontSize:0.03*windowWidth,marginTop:20}}>
                Loading...
              </Text>
            )
          }
          
        </View>

        <View style={{flex:1, flexDirection:'row', paddingTop:5, marginTop:10 }}>
          <View style ={{flex:1, paddingHorizontal: 35}}>
              
              <View style={styles.form}>
                <Text style={styles.label}>
                  First Name
                </Text>
                <TextInput
                    multiline={false}
                    onChangeText={(text) => {
                      this.setState({
                        FirstName:text
                      })
                    }}
                    value={FirstName}
                    placeholder=''
                    style={styles.input}
                /> 
              </View>

              <View style={styles.form}>
                <Text>
                  Last Name
                </Text>
                <TextInput
                    multiline={false}
                    onChangeText={(text) => {
                      this.setState({
                        lastName:text
                      })
                    }}
                    value={lastName}
                    placeholder=''
                    style={styles.input}
                /> 
              </View>

              <View style={styles.form}>
                <Text>
                  Phone Number
                </Text>
                <TextInput
                    multiline={false}
                    keyboardType='phone-pad'
                    onChangeText={(text) => {
                      this.setState({
                        phone:text
                      })
                    }}
                    value={phone}
                    placeholder=''
                    style={styles.input}
                /> 
              </View>

              <TouchableOpacity onPress={() => {
                  this.update()
              }} 
              activeOpacity={0.7} style={{backgroundColor:'#ffca28', marginTop:25,justifyContent:'center',alignItems:'center',paddingVertical:11}}>
                <Text style={{fontSize:0.035*windowWidth}}>
                  UPDATE PROFILE
                </Text>
              </TouchableOpacity>

              <View style={{paddingVertical:15}}></View>
              
          </View>
        </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eceff1',
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
    padding: '10%'
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
  header:{
    zIndex:10,
    position:'absolute',
    width:'100%',
    padding:10,
    top:5,
    left:5
  },
  fab: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#ffa726', 
    borderRadius: 30, 
    elevation: 8,
    margin:10
  }, 
  form:{
    flex: 1,
    marginTop:20,
  },
  input:{
    backgroundColor: 'white',
    marginTop:3,
    width:"100%",
    paddingVertical:5,
    paddingHorizontal:10,
    fontSize:0.04*windowWidth
  },
  label:{
    fontSize:0.04*windowWidth
  }
});

export default WalletScreen;