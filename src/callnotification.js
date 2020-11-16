import firebase from "react-native-firebase";
import { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios";


const incoming_call = (data) => {
  const channel = new firebase.notifications.Android.Channel(
    "voice", // channelId
    "Messages Channel", // channel name
    firebase.notifications.Android.Importance.High // channel importance
  ).setDescription("Used for getting voice notification") // channel description
  .setSound('lovingly.mp3')
  firebase.notifications().android.createChannel(channel);

  // handle your message
  const notification = new firebase.notifications.Notification()
  .setNotificationId(data.id.toString())
  .setTitle(data.title)
  .setBody(data.body)
  .setSound(channel.sound)
  .setData(data)
  .android.setLargeIcon('ic_launcher_round')
  .android.setSmallIcon('ic_stat_phone')
  .android.setWhen(new Date().valueOf())
  .android.setCategory(firebase.notifications.Android.Category.Call)
  .android.setColor('#ffa726')
  .android.setColorized(true)
  .android.setChannelId('voice')
  .android.setVibrate([1000, 1000])
  .android.setDefaults([firebase.notifications.Android.Defaults.Vibrate])
  // .android.setGroup('messagesID')
  // .android.setGroupAlertBehaviour(firebase.notifications.Android.GroupAlert.Children)
  .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
  .android.setAutoCancel(true); // To remove notification when tapped on it
  const action1 = new firebase.notifications.Android.Action('Answer', 'ic_launcher', 'Answer');
  const action2 = new firebase.notifications.Android.Action('Reject', 'ic_launcher', 'Reject');

  // // Add the action to the notification
  // notification.android.addAction(action1);
  // // Add the action to the notification
  // notification.android.addAction(action2);

  return notification;
};


const incoming_video_call = (data) => {
  console.log(data)
  const channel = new firebase.notifications.Android.Channel(
    "voice", // channelId
    "Messages Channel", // channel name
    firebase.notifications.Android.Importance.High // channel importance
  ).setDescription("Used for getting voice notification") // channel description
  .setSound('lovingly.mp3')
  firebase.notifications().android.createChannel(channel);

  // handle your message
  const notification = new firebase.notifications.Notification()
  .setNotificationId(data.id.toString())
  .setTitle(data.title)
  .setBody(data.body)
  .setSound(channel.sound)
  .setData(data)
  .android.setLargeIcon('ic_launcher_round')
  .android.setSmallIcon('ic_stat_videocam')
  .android.setWhen(new Date().valueOf())
  .android.setCategory(firebase.notifications.Android.Category.Call)
  .android.setColor('#ffa726')
  .android.setColorized(true)
  .android.setChannelId('voice')
  .android.setVibrate([1000, 1000])
  .android.setDefaults([firebase.notifications.Android.Defaults.Vibrate])
  // .android.setGroup('messagesID')
  // .android.setGroupAlertBehaviour(firebase.notifications.Android.GroupAlert.Children)
  .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
  .android.setAutoCancel(true); // To remove notification when tapped on it
  const action1 = new firebase.notifications.Android.Action('Answer', 'ic_launcher', 'Answer');
  const action2 = new firebase.notifications.Android.Action('Reject', 'ic_launcher', 'Reject');

  // // Add the action to the notification
  // notification.android.addAction(action1);
  // // Add the action to the notification
  // notification.android.addAction(action2);

  return notification;
};


const callNotofication = (data) => {
  if(data){
    firebase.notifications().displayNotification(incoming_call({
        id:data.id,
        title:data.realName,
        body:'Incoming voice call.',
        type:'call_user',
    }))
  }
}

const videoCallNotofication = (data) => {
  if(data){
    firebase.notifications().displayNotification(incoming_video_call({
        id:data.id,
        title:data.realName,
        body:'Incoming video call.',
        type:'videocall',
    }))
  }
}






export default {
    callNotofication,
    videoCallNotofication
};

 