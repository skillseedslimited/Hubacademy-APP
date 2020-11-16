import React, { Component } from "react"
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
  ScrollView
} from "react-native"

import { Icon } from 'react-native-elements'
import ProfileComponent from '../../components/ProfileComponent'
import DrawerItem from '../../components/DrawerItemComponent'
import { onSignOut } from "../../auth";
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const userData = {
  username: 'Username',
  email: 'useremail@email.com'
}

let platform = Platform.OS;

let platformSpecificStyle = {}

if(platform === 'ios') { 
  platformSpecificStyle = {
    paddingTop: 30
  } 
}


class DrawerMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      email:'',
      photo:''
    }
  }

  componentDidMount() {
      AsyncStorage.getItem("userData")
      .then(res => {
        console.log*('res')
        if (res !== null) {
          this.setState({
            fullname: JSON.parse(res).fullname,
            email:JSON.parse(res).email,
            photo: JSON.parse(res).photo || null
          });
          this.getUser()
        }
      })
  }

  getUser = async () => {
 
    let token = await AsyncStorage.getItem('userToken');
    let userData = await AsyncStorage.getItem('userData');
      if (token !== null) {
        token  = JSON.parse(token);
        userData  = JSON.parse(userData);
        let id = userData.id;
        fetch(setup.endPoint+"/account/user/get/"+id,{
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Authorization': 'Bearer '+token
            },
        })
        .then((response)=>{
          return response.json()
        }).then(async(res)=> {
            if(res.status ==='success'){
              userData.firstname = res.data.firstname
              userData.lastname = res.data.lastname
              userData.photo  = res.data.photo
              userData.phone = res.data.phone
              await AsyncStorage.setItem('userData', JSON.stringify(userData))
              this.setState({
                fullname: res.data.firstname +" "+res.data.lastname,
                photo: res.data.photo
              });
              console.log("nav")
            }
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }


  

  render() {
    return (
      <View style={[platformSpecificStyle,styles.container]}>
        <ProfileComponent navigation={this.props.navigation} setup={setup} photo={this.state.photo} fullname={this.state.fullname} email={this.state.email}/>
        <ScrollView>
          <DrawerItem navigation={this.props.navigation}  name={'HOME'} screenName={'home'} />
          <DrawerItem navigation={this.props.navigation}  name={'CATEGORIES'} screenName={'Cats'} />
          <DrawerItem navigation={this.props.navigation}  name={'REFLECTIONS'} screenName={'Reflections'} />
          <DrawerItem navigation={this.props.navigation}  name={'COACHES'} screenName={'Coaches'} />
          <DrawerItem navigation={this.props.navigation}  name={'STORE'} screenName={'storeContent'}/>
          <DrawerItem navigation={this.props.navigation}  name={'PURCHASED'} screenName={'myContent'}/>

          <DrawerItem navigation={this.props.navigation}  name={'MESSAGES'} screenName={'Messages'} />
          <DrawerItem navigation={this.props.navigation}  name={'SUBSCRIPTIONS'} screenName={'Subscriptions'}/>
          <DrawerItem navigation={this.props.navigation}  name={'WALLET'} screenName={'Wallet'}/>
            <TouchableOpacity activeOpacity={.8}
              style={styles.menuItem2}
              onPress={() => onSignOut().then(() => this.props.navigation.navigate('SignedOut'))}
              >
              <Text style={styles.menuItemText}>LOG OUT</Text>
            </TouchableOpacity>
            <View style={{padding:40}}/>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'rgba(255,255,255,0.43)'
  },
  menuItem: {
    flexDirection:'row'
  },
  menuItemText: {
    fontSize:0.03*windowWidth,
    fontWeight:'700',
    color:'black'
  },
  menuItem2: {
    marginTop: 10,
    marginHorizontal: 40,
    padding: 5,
    alignItems: 'center',
    backgroundColor:'#ffa726',
    borderRadius: 20
  }
})

DrawerMenu.defaultProps = {};

DrawerMenu.propTypes = {};

export default DrawerMenu;
