import React, { useState,useEffect,useContext,useRef} from 'react'
import { StyleSheet, Dimensions, AppState, TextInput, Text,ActivityIndicator, View, FlatList, ScrollView,Animated, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon, Button,Input } from 'react-native-elements'
import { onSignOut } from "../../auth";
import {Context} from '../../Store'
import nextId from "react-id-generator";
import Modal from "react-native-modal";
import event from '../../event'
import axios from "axios";
import moment from "moment";



let platform = Platform.OS;

let platformSpecificStyle = {}

if(platform === 'ios') { 
  platformSpecificStyle = {
    paddingTop: 30
  } 
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const Item = ({chats,id, onLongPress}) => {
  const isSend =  chats.from_id != id

  return (
    <TouchableOpacity activeOpacity={.9} onLongPress={onLongPress} key={chats.id} style={[styles.chat, isSend ? styles.chatsent : styles.chatreceive]}>
      <View style={[styles.chatbox, isSend ? styles.sent : styles.receive]}>
        <Text style={isSend ? styles.sentText : styles.receiveText}>
          {chats.content}
        </Text>
      </View>
      <View style={{width:'100%',alignItems:'center',justifyContent: isSend?'flex-end':'flex-start',flexDirection:'row'}}>
        <Text style={{fontSize:0.03*windowWidth,color:'#757575',marginRight:5}}>{moment(chats.createdAt).calendar()}</Text>
        {
          isSend &&
            (
              chats.seen == 0 ? 
              (
                <Icon name='cloud-upload' size={15} color="gray" />
                ):(
                  chats.seen == 1?(
                    <Icon name='check' type='material-community' size={15} color="gray" />
                  ):(
                    chats.seen == 2?(
                      <Icon name='check-all' type='material-community' size={15} color="gray" />
                    ):(
                      <Icon name='check-all' type='material-community' size={15} color="#ffa726" />
                    )
                )
              )
            )
        }
      </View>
    </TouchableOpacity>
  );
}


const Chat = (props) => {

const [state, dispatch] = useContext(Context);

const [loading,setLoading] = useState(false);
const [typeMessage, setTypeMessage] = useState('');
const [isModalVisible, setIsModalVisible] = useState(false);
const [reply, setReply] = useState(false);
const [id, setId] = useState(props.navigation.getParam('id'))
const [name,setName] = useState(props.navigation.getParam('userName'))

const list = useRef();

useEffect(() => {
  let interval = null
  let localinterval = null
  const didFocus = props.navigation.addListener("didFocus", payload => {
    interval = setInterval(() => {
      if(AppState.currentState == 'active'){
        seeChat()
      }
    }, 1000);
    localinterval = setInterval(() => {
      if(AppState.currentState == 'active'){
        localsee()
      }
    }, 1000);
  });
  const willBlur = props.navigation.addListener("willBlur", payload => {
    clearInterval(interval);
    clearInterval(localinterval);
  })
  return () => {
    willBlur.remove();
    didFocus.remove();
  } 
}, []);


 
const seeChat = async () =>{
  let token = await AsyncStorage.getItem('userToken');
  token  = JSON.parse(token);
  const options = {
      headers: {
          "Accept": "application/json",
          'Authorization':'Bearer '+token
      },
  };
  try{
    await axios.post(setup.endPoint+"/chat/seeChat", 
    { 
    "from_id": id,
    }, 
    options).
    then( async(response) => {
      // console.log(response.data.messages)
    });
  }catch(e){

  }
}  

const localsee = async () =>{
  let allMessages = await AsyncStorage.getItem('messages')
  allMessages = await JSON.parse(allMessages)
  allMessages.forEach( async (element, index) => {
      if(element.from == id && element.seen < 3) {
        // console.log(element)
        allMessages[index].seen = 3;
        await AsyncStorage.setItem('messages',JSON.stringify(allMessages));
        await dispatch({type: event.SET_MESSAGES, payload: allMessages});
      }
  });
}


const sentMessage = async () => {
  if(typeMessage.length !== 0) {
    const userData = await AsyncStorage.getItem('userData');
    let sentMessages = typeMessage;
    setTypeMessage('')
    const newMessage ={
      id: nextId(),
      from_id: JSON.parse(userData).id,
      seen: 0,
      content: sentMessages,
      replay:null,
      to_id: id,
    }
    try{
    await dispatch({type: event.ADD_PENDINGMESSAGES, payload:newMessage});
    let token = await AsyncStorage.getItem('userToken');
    token  = JSON.parse(token);
    let allPendingmessages = await AsyncStorage.getItem('pendingmessages')
    allPendingmessages = await JSON.parse(allPendingmessages)
    allPendingmessages = [...allPendingmessages,newMessage]
    await AsyncStorage.setItem('pendingmessages',JSON.stringify(allPendingmessages));
      if(token){
          const options = {
          headers: {
              "Accept": "application/json",
              'Authorization':'Bearer '+token
          },
          };
          await axios.post(setup.endPoint+"/chat", 
          { 
          "to_id": id,
          "content": sentMessages,
          }, 
          options).
          then(async(response) => {
            let allMessages = await AsyncStorage.getItem('messages')
            allPendingmessages = await AsyncStorage.getItem('pendingmessages')
            allMessages = await JSON.parse(allMessages)
            allPendingmessages = await JSON.parse(allPendingmessages)
            allPendingmessages = await allPendingmessages.filter(meg => meg.id != newMessage.id)
            await AsyncStorage.setItem('pendingmessages',JSON.stringify(allPendingmessages));

            if (await allMessages.filter(e => e.id != response.data.message.id).length > 0) {
                allMessages = [...allMessages,response.data.message]
                await AsyncStorage.setItem('messages',JSON.stringify(allMessages));
                await dispatch({type: event.REMOVE_PENDINGMESSAGES, payload:newMessage.id});
                await dispatch({type: event.ADD_MESSAGE, payload: response.data.message});
            }
            await dispatch({type: event.REMOVE_PENDINGMESSAGES, payload:newMessage.id});
          });
      }
      }catch (e) {
        console.log(e)
      }
  }
}

const longpress = async () =>{
  setIsModalVisible(true)
}

const onreply = async () =>{
  setReply(true)
  setIsModalVisible(false)
}



 
return(
  <View style={[platformSpecificStyle,{flex:1,backgroundColor:'#eceff1'}]}>
      <View style={styles.header}>
        <TouchableOpacity style={{width:"10%"}} onPress={() => props.navigation.goBack()}>
          <Icon name='arrow-back'  size={28} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>props.navigation.navigate(`CoachDetails`, {id} )} style={{width:"80%",alignItems:'center'}}>
          <Text numberOfLines={1} style={{fontSize: 0.05*windowWidth,fontWeight:'bold',color:'gray'}}>
            {name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width:"10%"}}>
          <Icon name='search'  size={28} color="gray" />
        </TouchableOpacity>
      </View>
      <FlatList
        // ListHeaderComponent={() =>{
        //   return(
        //     <TouchableOpacity onPress={()=>{
        //       list.current.scrollToIndex({index:2})
        //     }}>
        //       <Text>
        //         Click me
        //       </Text>
        //     </TouchableOpacity>
        //   )
        // }}
        ref ={list}
        contentContainerStyle={styles.content}
        data={[...state.messages.filter(message => message.from_id == id || message.to_id == id),...state.pendingMessages.filter(pendingMessage => pendingMessage.from_id == id || pendingMessage.to_id == id)].reverse()}
        renderItem={({ item }) => <Item chats={item} id={id} onLongPress={longpress}/>}
        keyExtractor={item => item.id.toString()}
        inverted
      />
      {
        reply && (
          <View style={{height:60,backgroundColor:'white',marginHorizontal:20,paddingHorizontal:8,paddingVertical:6}}>
           
            <View style={{flex:1,backgroundColor:'#eeeeee',justifyContent:'center',padding:10}}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text numberOfLines={1} style={{color:'#ffa726',fontSize:0.035*windowWidth,fontWeight:'bold'}}>
                  You
                </Text>
                <TouchableOpacity onPress={()=>setReply(false)}>
                  <Icon name='close'  size={20} color="gray" />
                </TouchableOpacity>
              </View>
              <Text numberOfLines={1} style={{fontSize:0.035*windowWidth}}>
                hello where are you where una de for calabar nigeria for now
              </Text>
            </View>
          </View>
        )
      }
      <View style={styles.footer}>
       
        <View style={{backgroundColor:'white',flexDirection:'row',alignItems:'center',borderRadius:10,width:'100%',paddingHorizontal:10,paddingVertical:0}}>
          <TextInput
            style={{...styles.input}}
            placeholder="Say something..."
            underlineColorAndroid="transparent"
            multiline={true}
            onChangeText={(text) => setTypeMessage(text)}
            value={typeMessage}
          /> 
          <TouchableOpacity onPress={sentMessage} style={{width:"10%"}}>
            <Icon name='send'  size={27} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      {
        loading?(
          <View style={styles.loader}> 
            <ActivityIndicator size="large" color="#ffa726"/>
          </View>
        ):null
      }
      <Modal isVisible={isModalVisible}
        backdropOpacity={0}
        onBackButtonPress={() => setIsModalVisible(false)}
        onBackdropPress={() => setIsModalVisible(false)}
        useNativeDriver={true}
        animationInTiming={300}
        animationOutTiming={300}
        hideModalContentWhileAnimating
        style={{justifyContent:'flex-end',margin: 0}}>
          <View style={{ backgroundColor: 'white',height:'10%',borderTopLeftRadius:20,borderTopRightRadius:20,borderColor: 'rgba(0, 0, 0, 0.1)',}}>
            <View style={{flex:1}}>
              <View style={{flex:1,flexDirection:'row',paddingHorizontal:30,paddingVertical:20}}>
                <TouchableOpacity activeOpacity={.5} onPress={onreply} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                  <Icon name='reply' type='MaterialIcons'  size={18} color="#ffa726" />
                  <Text style={{fontSize:0.03*windowWidth,color:'#ffa726'}}>
                    Reply
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.5} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                  <Icon name='delete' type='MaterialIcons' size={18} color="#ffa726" />
                  <Text style={{fontSize:0.03*windowWidth,color:'#ffa726'}}>
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.5} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                  <Icon name='content-copy' type='MaterialIcons' size={18} color="#ffa726" />
                  <Text style={{fontSize:0.03*windowWidth,color:'#ffa726'}}>
                    Copy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  content : {
    padding : 10,
    paddingHorizontal:20
  },
  input : {
    flex:1,
    fontSize: 0.04*windowWidth,
    maxHeight: 100
  },
  loader:{
    marginTop:10,
    position:'absolute',
    width:'100%',
    height:'100%',
    justifyContent: "center",
    alignItems: "center",
  },
  header:{
    flexDirection:'row',
    alignItems:'center',
    zIndex:999,
    backgroundColor: 'white',
    width:'100%',
    padding:10,
  },
  footer:{
    // flexDirection:'row',
    alignItems:'center',
    width:'100%',
    paddingBottom:10,
    paddingHorizontal:20
  },
  chat:{
    width:'100%',
    paddingVertical:3,
  },
  chatreceive:{
    alignItems:'flex-start',
  },
  chatsent:{
    alignItems:'flex-end',
  },
  chatbox:{
    paddingHorizontal:10,
    paddingVertical:5,
    minWidth:70,
    maxWidth:250,
    borderRadius:10
  },
  sent:{
    backgroundColor:'black',
  },
  receive:{
    backgroundColor:'#ffa726',
  },
  sentText:{
    color:'white',
    paddingVertical:2,
    fontSize:0.035*windowWidth,
  },
  receiveText:{
    color:'black',
    paddingVertical:2,
    fontSize:0.035*windowWidth, 
  },  
});

export default Chat;