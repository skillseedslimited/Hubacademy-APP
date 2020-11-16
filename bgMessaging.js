// @flow
import firebase from 'react-native-firebase';
import messaging from "./src/messaging";
import { RemoteMessage } from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import setup from "./src//setup";
import callnotification from "./src/callnotification";
import { socket } from "./src/socket_io";
import axios from "axios";
import startSocketIO from "./src/startSocketIO"



export default async (message) => {
  
  const data = JSON.parse(message.data.data);
  // console.log(message)
  console.log("data 2")

  const onMessage = async (data) => {
    if(data){
      firebase.notifications().displayNotification(messaging.notificationGroup())
      firebase.notifications().displayNotification(messaging.shownotification({
          id:data.id,
          title:data.from.name,
          body:data.content,
          type:'message',
          userId:data.from_id
      }))
      return Promise.resolve();
    }
  }

  const getMessage = async (data) => {
    console.log(data.id)
    let token = await AsyncStorage.getItem('userToken');
    if(token){
        token  = JSON.parse(token);
        const options = {
            headers: {
              "Accept": "application/json",
              'Authorization':'Bearer '+token
            },
        };
        try{
        await axios.get(setup.endPoint+"/chat/message_by_id/"+data.id,options).
          then( async(res) => {
            console.log('why me')
            let allMessages = await AsyncStorage.getItem('messages')
            allMessages = await JSON.parse(allMessages)
            if (await allMessages.filter(e => e.id != res.data,message.id).length > 0) {
                allMessages = [...allMessages,res.data.message]
                await AsyncStorage.setItem('messages',JSON.stringify(allMessages));
                onMessage(res.data.message)
            }
          });
        }catch (e) {
          console.log(e)
          return Promise.resolve();
        }
    }
  }

  const main = async () => {
  let userData = await AsyncStorage.getItem('userData');

  switch(message.data.type) {
      case "message":
        getMessage(data)
        break;
      case "voice_call":
        await startSocketIO.startSocket();
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
                  realName: JSON.parse(userData).fullname
              },
            }
        });
        callnotification.callNotofication(data)
        break;
      case "videocall":
        await startSocketIO.startSocket();
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
                  realName: JSON.parse(userData).fullname
              },
            }
        });
        callnotification.videoCallNotofication(data)
        break;
      default:
          break;
  }
}

main()


  

 
  
  
}