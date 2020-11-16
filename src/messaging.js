import firebase from "react-native-firebase";
import { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import setup from "../src/setup";
import axios from "axios";
// import global from './global'

const notificationGroup = () => {
  const channel = new firebase.notifications.Android.Channel(
    "messages", // channelId
    "Messages Channel", // channel name
    firebase.notifications.Android.Importance.High // channel importance
  ).setDescription("Used for getting messages notification") // channel description
  .setSound('anxious.mp3')
  firebase.notifications().android.createChannel(channel);

  // handle your message
  const notification = new firebase.notifications.Notification()
  .setNotificationId('messagesID')
  .setTitle('Messages')
  .setSound(channel.sound)
  .android.setLargeIcon('ic_launcher_round')
  .android.setSmallIcon('ic_stat_chat')
  .android.setCategory(firebase.notifications.Android.Category.Message)
  .android.setColor('#ffa726')
  .android.setColorized(true)
  .android.setChannelId('messages')
  .android.setVibrate([1000, 1000])
  .android.setDefaults([firebase.notifications.Android.Defaults.Vibrate])
  .android.setGroup('messagesID')
  .android.setGroupSummary(true)
  .android.setGroupAlertBehaviour(firebase.notifications.Android.GroupAlert.Children)
  .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
  .android.setAutoCancel(true); // To remove notification when tapped on it
  return notification;
};

const shownotification = (data) => {
  console.log('data')
  console.log(data)
  const channel = new firebase.notifications.Android.Channel(
    "messages", // channelId
    "Messages Channel", // channel name
    firebase.notifications.Android.Importance.High // channel importance
  ).setDescription("Used for getting messages notification") // channel description
  .setSound('anxious.mp3')
  firebase.notifications().android.createChannel(channel);

  // handle your message
  const notification = new firebase.notifications.Notification()
  .setNotificationId(data.id.toString())
  .setTitle(data.title)
  .setBody(data.body)
  // .setSound(channel.sound)
  .setData(data)
  .android.setLargeIcon('ic_launcher_round')
  .android.setSmallIcon('ic_stat_chat')
  .android.setWhen(new Date().valueOf())
  .android.setCategory(firebase.notifications.Android.Category.Message)
  .android.setColor('#ffa726')
  .android.setColorized(true)
  .android.setChannelId('messages')
  .android.setVibrate([1000, 1000])
  .android.setDefaults([firebase.notifications.Android.Defaults.Vibrate])
  .android.setGroup('messagesID')
  .android.setGroupAlertBehaviour(firebase.notifications.Android.GroupAlert.Children)
  .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
  .android.setAutoCancel(true); // To remove notification when tapped on it
  return notification;
};


const getMessage = async (data) => {
  console.log(data.id)
  if(data){
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
              console.log('res1');
              let allMessages = await AsyncStorage.getItem('messages')
              allMessages = await JSON.parse(allMessages)
              // if (await allMessages.filter(e => e.id != res.data.message.id).length > 0) {
              //     // allMessages = [...allMessages,res.data.message.id]
              //     // await AsyncStorage.setItem('messages',JSON.stringify(allMessages));
                
              // }
              firebase.notifications().displayNotification(notificationGroup())
              firebase.notifications().displayNotification(shownotification({
                  id:res.data.message.id,
                  title:res.data.message.from.name,
                  body:res.data.message.content,
                  type:'message',
                  userId:res.data.message.from_id
              }))
          });
        }catch (e) {
          console.log(e);
        }
      }
  }
}






export default {
  notificationGroup,
  shownotification,
  getMessage
};

 