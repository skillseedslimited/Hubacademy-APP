import React, { useEffect } from 'react';
import {createAppContainer} from "react-navigation";
import { createRootNavigator } from "./src//router";
import { DeviceEventEmitter, Platform } from 'react-native';
import { isSignedIn } from "./src//auth";
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen'
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from "react-native-firebase";
import { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';
import notify from "./src/notification";
import callnotification from "./src/callnotification";
import messaging from "./src/messaging";
import startSocketIO from "./src/startSocketIO"
import { socket } from "./src/socket_io";
import Store from './src/Store'
import NavigationService from './src/NavigationService';
import setup from "./src//setup";



Icon.loadFont();
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
MaterialIcons.loadFont();

import Ionicons from 'react-native-vector-icons/Ionicons'
Ionicons.loadFont();

import Feather from 'react-native-vector-icons/Feather'
Feather.loadFont();

import Octicons from 'react-native-vector-icons/Octicons'
Octicons.loadFont();


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
MaterialCommunityIcons.loadFont();



export default class App extends React.Component {
  constructor(props) {
    super(props);
    firebase.messaging().hasPermission()
    .then(enabled => {
      if (enabled) {
        // user has permissions
        console.log(enabled)
      } else {
        // user doesn't have permission
        console.log('no')
      } 
    });

    firebase.messaging().requestPermission()
    .then(() => {
      // User has authorised  
      console.log('ok')
    })
    .catch(error => {
      // User has rejected permissions  
    });

    firebase.messaging().getToken()
    .then(fcmToken => {
      if (fcmToken) {
        // user has a device token
        console.log('fcmToken '+fcmToken)
      } else {
        // user doesn't have a device token yet
      } 
    });
    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }


  componentDidMount() {
    isSignedIn()
    .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
    .catch(err => alert("An error occurred"));

    startSocketIO.startSocket();

    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        console.log('notification1')
    });

    this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
        // Process your notification as required
        console.log('notification2')
        console.log(notification)
     
        let alert = notify.onMessage(notification._data)
        firebase.notifications().displayNotification(alert)
    });

    this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          console.log('action');
          console.log(action);

          // Get information about the notification that was opened
          const notification = notificationOpen.notification;
          if(notification._data){
            switch(notification._data.type) {
                case "message":
                  NavigationService.navigate('Chat',{
                    id:notification._data.userId,
                    userName:notification._data.title,
                  })
                  break;
                case "call_user":
                  NavigationService.navigate('VoiceCall',{
                    id:notification._data.id,
                    uri:setup.baseUrl+'/images/'+notification._data.photo,
                    name:notification._data.title,
                    type: 'incoming'
                  })
                  break;
                case "videocall":
                  NavigationService.navigate('VideoCall',{
                    id:notification._data.id,
                    uri:notification._data.photo,
                    name:notification._data.title,
                    type: 'incoming'
                  })
                  break;

                default:
                    break;
            }
          }
          console.log(notification._data)
      });

      // to process message broadcasted from onMessageReceived method
    this.messageListener = firebase.messaging().onMessage(async(message) => {
        // put your logic to process message
        const data = JSON.parse(message.data.data);
        console.log('messageListener')
        console.log(data)

        let userData = await AsyncStorage.getItem('userData');

        switch(message.data.type) {
            case "message":
              messaging.getMessage(data)
              break;
            case "voice_call":
              socket.send({
                  type:'ringing',
                  data: {
                    type: 'call_user',
                    caller: {
                        id: data.id,
                        realName: data.title,
                    },
                    recipient: {
                        id: JSON.parse(userData).id,
                        realName: JSON.parse(userData).realName
                    },
                  }
              });
              callnotification.callNotofication(data)
              break;
             case "videocall":
                socket.emit("videocall",{
                    type:'ringing',
                    data: {
                      type: 'call_user',
                      caller: {
                          id: data.id,
                          realName: data.title,
                      },
                      recipient: {
                          id: JSON.parse(userData).id,
                          realName: JSON.parse(userData).realName
                      },
                    }
                });
                callnotification.videoCallNotofication(data)
                break;
            default:
                break;
        }

      })

    Orientation.unlockAllOrientations()
  
  }

  componentWillUnmount() {
    this.removeNotificationDisplayedListener();
    this.removeNotificationListener();
    this.removeNotificationOpenedListener();
    this.messageListener();
  }

  checkOpenApp = () =>{
    // NavigationService.navigate('LoginScreen', {});
    firebase.notifications().getInitialNotification()
    .then((notificationOpen) => {
      if (notificationOpen) {
        console.log('yes sir')
        const notification = notificationOpen.notification;  
        if(notification._data){
          switch(notification._data.type) {
              case "message":
                NavigationService.navigate('Chat',{
                  id:notification._data.userId,
                  userName:notification._data.title,
                })
                break;
              case "call_user":
                NavigationService.navigate('VoiceCall',{
                  id:notification._data.id,
                  uri:setup.baseUrl+'/images/'+notification._data.photo,
                  name:notification._data.title,
                  type: 'incoming'
                })
                break;
              case "videocall":
                NavigationService.navigate('VideoCall',{
                  id:notification._data.id,
                  uri:notification._data.photo,
                  name:notification._data.title,
                  type: 'incoming'
                })
                break;
              default:
                  break;
          }
        }
      }
    });
  }


  render() {
    const { checkedSignIn, signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }


    const App = createRootNavigator(signedIn);

    const Layout = createAppContainer(App);
    return (
      <Store>
            <Layout  
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
              this.checkOpenApp();
              SplashScreen.hide();
            }}/>
      </Store>
    )
  }

 
}