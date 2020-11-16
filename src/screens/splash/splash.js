import React from 'react';
import { StyleSheet, Text, View, Alert, Image, StatusBar } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import logo from  '../../asset/logo.png';
import AsyncStorage from '@react-native-community/async-storage';



class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.getData();
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      setTimeout(() => {
        if(value !== null) {
          // value previously stored
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Mainapp' })
            ],
          });
          this.props.navigation.dispatch(resetAction);
        }else{
          // this.props.navigation.navigate('Intro');
          Alert.alert(value);
        }
      }, 1000);  //5000 milliseconds
    } catch(e) {
      // error reading value
      Alert.alert("Error");
    }
  }


 
    static navigationOptions = { header: null }; 
    render() {
      return (
        <View style={styles.container}>
          <StatusBar backgroundColor="#032D66" barStyle="light-content" />
          <Image  style={{height: 150,width:120}} source={logo} />
          <Text style={styles.text}>Hub Academy</Text>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#032D66',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: 'white',
      fontSize: 20,
    },
  });

export default SplashScreen;