import firebase from "react-native-firebase";
import { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';



const onMessage = (data) => {
    const channel = new firebase.notifications.Android.Channel(
      "reminder", // channelId
      "Reminders Channel", // channel name
      firebase.notifications.Android.Importance.High // channel importance
    ).setDescription("Used for getting reminder notification") // channel description
    .setSound('wecker_sound.mp3')
    firebase.notifications().android.createChannel(channel);
  
    // handle your message
    const notification = new firebase.notifications.Notification()
    .setNotificationId(data.id)
    .setTitle(data.title)
    .setBody(data.body)
    .setSound(channel.sound)
    .setData(data)
    .android.setLargeIcon('ic_launcher_round')
    .android.setSmallIcon('ic_stat_alarm')
    .android.setCategory(firebase.notifications.Android.Category.Alarm)
    .android.setColor('#f44336')
    .android.setColorized(true)
    .android.setChannelId('reminder')
    .android.setOnlyAlertOnce(false)
    .android.setVibrate([1000, 1000])
    .android.setDefaults([firebase.notifications.Android.Defaults.Vibrate])
    .android.setGroup(data.type)
    // .android.setGroupAlertBehaviour(firebase.notifications.Android.GroupAlert.Children)
    // .android.setGroupSummary(true)
    // .android.setOngoing(true)
    .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
    .android.setAutoCancel(true); // To remove notification when tapped on it
  
    return notification;
};




export default {
    onMessage,
};

 