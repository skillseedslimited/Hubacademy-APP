import React from 'react';
import { StyleSheet, Dimensions, Image, Text,ActivityIndicator, View, ScrollView, Alert, ImageBackground,Animated, BackHandler, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon, Button,Input } from 'react-native-elements'
import { onSignOut } from "../../auth";
import CatsComponent from '../../components/CatsComponent'
import Toast from "react-native-simple-toast";
import Modal from "react-native-modal";
import moment from "moment";
// import AuthorSubScreen from './subscription'
import wallet from  '../../asset/wallet.png';





const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class SubScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      sub:[],
    }
  }

  componentDidMount() {

  }

 
  
componentWillUnmount() {

}

  render() {
    return (
      <AuthorSubScreen />
    ) 
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
    elevation: 8 
  }, 
});

export default SubScreen;