import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';


const socket = io('https://server.myacademyhub.com/api/v1/chat');

export const USER_KEY = "user";

export const onSignIn = () => {
  return new Promise(async (resolve, reject) => {
    try{
      await AsyncStorage.setItem(USER_KEY, "true")
      await AsyncStorage.setItem('messages', JSON.stringify([]))
      await AsyncStorage.setItem('pendingmessages', JSON.stringify([]))
      await AsyncStorage.setItem('conversations', JSON.stringify([]))
      resolve(true);
    }catch(e){
      reject(e)
    }
  })
}

export const onSignOut = () => {
  return new Promise(async (resolve, reject) => {
    try{
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      resolve(true);
    }catch(e){
      reject(e)
    }
  });
}



export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};
