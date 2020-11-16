import { socket } from "./socket_io";
import AsyncStorage from '@react-native-community/async-storage';
import firebase from "react-native-firebase";
import { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';
import notification from "./notification";






const startSocket = async () => {

    socket.on('connect', async () => {
        const userData = await AsyncStorage.getItem('userData');
        console.log(socket.connected); // true
        
        if (userData !== null) {
            socket.send({
                type: "login",
                id: JSON.parse(userData).id,
            })
        }
    });

  
    socket.on('disconnect', () => {
        console.log('disconnect'); // true
    });
  

};


export default {
    startSocket,
};

 