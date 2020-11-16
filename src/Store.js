import React, {createContext,useState, useReducer,useEffect} from "react";
import {
    InteractionManager,
    AppState
} from "react-native";
import NetInfo from "@react-native-community/netinfo"
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios";
import setup from  './setup';
// import { socket } from "./socket_io";
import { setIntervalAsync } from 'set-interval-async/dynamic'
import { clearIntervalAsync } from 'set-interval-async'
import event from './event'
import messaging from './messaging'
import firebase from "react-native-firebase";
import Reducer from './Reducer'


const initialState = {
    messages:[],
    pendingMessages: [],
    connection: false,
    conversations:[],
    conversationsload: false
};

const Store = ({children}) => {

    const [state, dispatch] = useReducer(Reducer, initialState);

    useEffect(() => {
        setIntervalAsync(
            async () => {
                InteractionManager.runAfterInteractions(async() => {
                    // ...long-running synchronous task...
                    if(AppState.currentState == 'active'){
                        await getMessages()
                    }
                });
            },
            2000
        )
    }, []);

    useEffect(() => {
        setIntervalAsync(
            async () => {
                InteractionManager.runAfterInteractions( async() => {
                    // ...long-running synchronous task...
                    await getMessagesStatus()
                });
            },
            2000
        )
    }, []);

    useEffect(() => {
        setIntervalAsync(
            async () => {
                InteractionManager.runAfterInteractions(async() => {
                    // ...long-running synchronous task...
                    await getMessagesSeen()
                });
            },
            2000
        )
    }, []);


    useEffect(() => {
        setIntervalAsync(
            async () => {
                InteractionManager.runAfterInteractions(async() => {
                    // ...long-running synchronous task...
                    await getConversation()
                });
            },
            2000
        )
    }, []);

    useEffect(() => {
        const _handleConnectionChange = (state) => {
            dispatch({type: event.SET_CONNECTION, payload: state.isInternetReachable});
        };
        NetInfo.addEventListener(_handleConnectionChange);
       
    },[]);

    useEffect(() => {
        if(state.connection){
            pendingMessages()
        }
    },[state.connection]);


    const getMessages = async () => {
        // console.log('getMessages')
        let allMessages = await AsyncStorage.getItem('messages')
        allMessages = await JSON.parse(allMessages)
        if(allMessages){
            let lastMessage = 0
            if (allMessages.length > 0){
                lastMessage = allMessages[allMessages.length-1].id
                await dispatch({type: event.SET_MESSAGES, payload: allMessages});
            }
            try{
                const userData = await AsyncStorage.getItem('userData');
                let id = JSON.parse(userData).id;
                let token = await AsyncStorage.getItem('userToken');
                token  = JSON.parse(token);
                const options = {
                    headers: {
                        "Accept": "application/json",
                        'Authorization':'Bearer '+token
                    },
                };
                await axios.get(setup.endPoint+"/chat/newchat_messages/"+lastMessage,options).
                then( async(response) => {
                    if(allMessages.length > 0){
                        for (const message of response.data.messages) {
                            if (await allMessages.filter(e => e.id != message.id).length > 0) {
                                allMessages = [...allMessages,message]
                                await AsyncStorage.setItem('messages',JSON.stringify(allMessages));
                            }
                        } 
                    }else{
                        allMessages = await [...response.data.messages]
                        await dispatch({type: event.SET_MESSAGES, payload: allMessages});
                        await AsyncStorage.setItem('messages',JSON.stringify(allMessages));
                    }
                });
            }catch (e) {
            }
        }
    }

    const getMessagesStatus = async () => {
        let allMessages = await AsyncStorage.getItem('messages')
        allMessages = await JSON.parse(allMessages)
        if(allMessages != null){
        try{
            let dMessages = allMessages.filter(e => e.seen == 2)

            let lastMessage = 0
            if (dMessages.length > 0){
                lastMessage = dMessages[dMessages.length-1].id
            }
            const userData = await AsyncStorage.getItem('userData');
            let token = await AsyncStorage.getItem('userToken');
            token  = JSON.parse(token);
            const options = {
                headers: {
                "Accept": "application/json",
                'Authorization': 'Bearer '+token
                },
            };
            await axios.get(setup.endPoint+"/chat/get_chat_status/"+lastMessage,options).
            then( async(response) => {
                for (const message of response.data.messages) {
                    allMessages.forEach( async (element, index) => {
                        if(element.id == message.id) {
                            allMessages[index].seen = message.seen;
                            await AsyncStorage.setItem('messages',JSON.stringify(allMessages));
                            await dispatch({type: event.SET_MESSAGES, payload: allMessages});
                        }
                    });
                }
            })
        }catch (e) {
            // console.log(e)
        }
        }
    }

    const getMessagesSeen = async () => {
        let allMessages = await AsyncStorage.getItem('messages')
        const userData = await AsyncStorage.getItem('userData');
        let token = await AsyncStorage.getItem('userToken');
        let id = ''
        if(userData != null){
            id  = JSON.parse(userData).id;
        }
        allMessages = await JSON.parse(allMessages)
        if(allMessages != null){
        try{
            let sMessages = allMessages.filter(e => e.seen == 3 && e.from_id == id )
            let lastMessage = 0
            if (sMessages.length > 0){
                lastMessage = sMessages[sMessages.length-1].id
            }
            token  = JSON.parse(token);
            const options = {
                headers: {
                "Accept": "application/json",
                'Authorization': 'Bearer '+token
                },
            };
            await axios.get(setup.endPoint+"/chat/get_chat_seen/"+lastMessage,options).
            then( async(response) => {
                for (const message of response.data.messages) {
                    allMessages.forEach( async (element, index) => {
                        if(element.id == message.id) {
                            allMessages[index].seen = message.seen;
                            await AsyncStorage.setItem('messages',JSON.stringify(allMessages));
                            await dispatch({type: event.SET_MESSAGES, payload: allMessages});
                        }
                    });
                }
            }).catch(function (error) {
                console.log(error);
            });
        }catch (e) {
            // console.log(e)
        }
        }
    }


    const getConversation = async () => {
        // console.log('getConversation')
        let allConversations = await AsyncStorage.getItem('conversations')
        allConversations = await JSON.parse(allConversations)
        if(allConversations){
            if (allConversations.length > 0){
                await dispatch({type: event.SET_CONVERSATIONS, payload: allConversations});
                await dispatch({type: event.SET_CONVERSATIONSLOAD, payload: true});
            }
            try{
                const userData = await AsyncStorage.getItem('userData');
                let token = await AsyncStorage.getItem('userToken');
                token  = JSON.parse(token);
                const options = {
                    headers: {
                        "Accept": "application/json",
                        'Authorization':'Bearer '+token
                    },
                };
                await axios.get(setup.endPoint+"/chat/conversations",options).
                then( async(response) => {
                    if(JSON.stringify(allConversations)!=JSON.stringify(response.data.conversations)){
                        // console.log(response.data.conversations)
                        allConversations = response.data.conversations
                        await dispatch({type: event.SET_CONVERSATIONS, payload: allConversations});
                        await AsyncStorage.setItem('conversations',JSON.stringify(allConversations));
                    }
                    await dispatch({type: event.SET_CONVERSATIONSLOAD, payload: true});
                })
                .catch(function (error) {
                    console.log(error);
                });
            }catch (e) {
            }
        }
    }

    const pendingMessages = async () =>{
        console.log('pendingMessages')
        let allPendingmessages = await AsyncStorage.getItem('pendingmessages')
        allPendingmessages = await JSON.parse(allPendingmessages)
        let allMessages = await AsyncStorage.getItem('messages')
        allMessages = await JSON.parse(allMessages)

        if(allPendingmessages != null){
            if(allPendingmessages.length > 0){
            for (const message of allPendingmessages) {
                try{
                const userData = await AsyncStorage.getItem('userData');
                let token = await AsyncStorage.getItem('userToken');
                token  = JSON.parse(token);
                if(token){
                    const options = {
                    headers: {
                        "Accept": "application/json",
                        'Authorization':'Bearer '+token
                    },
                    };
                    await axios.post(setup.endPoint+"/chat", 
                    { 
                    "to_id": message.to_id,
                    "content": message.content,
                    }, 
                    options).
                    then(async(response) => {
                        // console.log('test 2')
                        allPendingmessages = await AsyncStorage.getItem('pendingmessages')
                        allPendingmessages = await JSON.parse(allPendingmessages)
                        allPendingmessages = await allPendingmessages.filter(meg => meg.id != message.id)
                        await AsyncStorage.setItem('pendingmessages',JSON.stringify(allPendingmessages));

                        if (await allMessages.filter(e => e.id != response.data.message.id).length > 0) {
                            allMessages = [...allMessages,response.data.message]
                            await AsyncStorage.setItem('messages',JSON.stringify(allMessages));
                        }

                        await dispatch({type: event.REMOVE_PENDINGMESSAGES, payload:message.id});
                        await dispatch({type: event.ADD_MESSAGE, payload: response.data.message});
                    });
                }
                }catch (e) {
                }
            };
            }
        }
    }




    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;