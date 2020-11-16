import React, { Component } from "react"
import { Text, View, StyleSheet,Dimensions,Image, TouchableOpacity } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-community/async-storage';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  mediaDevices
} from 'react-native-webrtc';
import { socket } from "../../socket_io";
import axios from "axios";
import setup from  '../../setup';

const InCallManager



const configuration = { 
  iceServers: []
}; 

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;





class Calling extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        id: this.props.navigation.getParam('id'),
        uri: this.props.navigation.getParam('uri'),
        userName: this.props.navigation.getParam('name'),
        type:  this.props.navigation.getParam('type'),
        isMute: false,
        highVolume:false,
        status:this.props.navigation.getParam('type')=='ongoing'?'Calling...':'Connecting...',
        stream: null,
        remoteStream: null,
        timerOn: false,
        timerStart: 0,
        timerTime: 0
      }
      this.voice_call_init = this.voice_call_init.bind(this);
      this.voice_call = this.voice_call.bind(this);
    }

    startTimer = () => {
      this.setState({
        timerOn: true,
        timerTime: this.state.timerTime,
        timerStart: Date.now() - this.state.timerTime
      });
      this.timer = setInterval(() => {
        this.setState({
          timerTime: Date.now() - this.state.timerStart
        });
      }, 10);
    };

    stopTimer = () => {
      this.setState({ timerOn: false });
      clearInterval(this.timer);
    };



    async componentDidMount() {
      if(this.state.type == 'ongoing'){
        this.setCall();
      }
      await this.call_modal();
      socket.on('voice_call_init',this.voice_call_init)
      socket.on('voice_call',this.voice_call)
    }

    componentWillUnmount() {
      socket.off('voice_call_init',this.voice_call_init)
      socket.off('voice_call',this.voice_call)
    }
  
  voice_call_init = async (message) =>{
    switch(message.type){
        case "ringing":
          this.setState({
            status: 'Ringing...'
          })
          InCallManager.start({media: 'audio', ringback: '_DTMF_'});
        break;
        case "user_busy":
          this.setState({
            status: 'User Busy'
          })
        break;
        default:
        break;
    }
  }

  voice_call = async (message) =>{
    switch(message.type){
        case "connecting":
      
        break;
        case "answerOffer": 
            this.handleAnswer(message.answer); 
        break;
        case "candidate": 
            this.handleCandidate(message.candidate); 
        break; 
        case "offer": 
            this.handleOffer(message.offer); 
        break; 
        case "leave": 
            this.handleLeave(); 
        break; 
        default:
        break;
    }
  }

  handleLeave = () => { 
    this.yourConn.close(); 
    this.yourConn.onicecandidate = null; 
    this.yourConn.onaddstream = null; 
    this.yourConn.onconnectionstatechange = null;
    this.setState({
      status: 'Call ended'
    })
    InCallManager.stop({busytone: '_DTMF_'});
};

  handleAnswer = (answer) => { 
      // this.setState({
      //   status: 'On call'
      // })
      // InCallManager.stopRingback();
   
      this.yourConn.setRemoteDescription(new RTCSessionDescription(answer)); 
  };

  handleCandidate = async (candidate) => { 
  
      await this.yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
  };

  handleOffer = async (offer) => { 
    this.yourConn.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = "yourConn"
    await this.yourConn.setLocalDescription(answer);
    socket.send({ 
        type: "answerOffer", 
        answer: answer,
        id: this.props.navigation.getParam('id')
    }); 
 
};

acept_call = async () => {
  const offer = "yourConn"
  await this.yourConn.setLocalDescription(offer);
  socket.send({ 
      type: "offer", 
      offer: offer,
      id: this.props.navigation.getParam('id')
  }); 
}

   

    onMute = () =>{
      this.setState({
        isMute: !this.state.isMute
      })
      InCallManager.setMicrophoneMute(!this.state.isMute)
    }

    onVolume = () => {
      this.setState({
        highVolume: !this.state.highVolume
      })
      InCallManager.setForceSpeakerphoneOn(!this.state.highVolume)
    }

    endCall = async () => {
      await this.handleLeave();
      socket.send({ 
          type: "leave",
          id: this.props.navigation.getParam('id')
      });  
      InCallManager.stopRingback();
      InCallManager.stop();
      this.props.navigation.pop(1)
    }

    call_modal = async () =>{
      mediaDevices.getUserMedia({ 
          video: false, 
          audio: true 
      })
      .then((myStream) => this.streamHandlerOut(myStream))
      .catch( (error) => this.errorHandlerOut(error));
    }

    errorHandlerOut = (error) => { 
    }

    streamHandlerOut = async (myStream) => { 
      this.setState({
        stream: myStream
      })

      this.yourConn = new RTCPeerConnection(configuration)

      // setup stream listening 
      this.yourConn.addStream(myStream); 
    
      //when a remote user adds stream to the peer connection, we display it 
      this.yourConn.onaddstream = (e) => { 
          this.setState({
            remoteStream: e.stream
          })
      };
      
      this.yourConn.oniceconnectionstatechange = (event) => {
        switch(event.target.iceConnectionState) {
            case "connected":
            // The connection has become fully connected
              if(!this.state.timerOn){
                this.startTimer();
                InCallManager.stopRingback();
                InCallManager.start();
              }
              this.setState({
                status: 'on_call'
              })
            break;
            case "connecting":
              this.setState({
                status: 'Connecting...'
              })
              InCallManager.stop({busytone: '_DTMF_'});
            break
            case "failed":
              this.handleLeave();
              this.stopTimer();
            break;  
        }
    }
    
      this.yourConn.onicecandidate = (event) => {
          if (event.candidate) { 
            socket.send({ 
                type: "candidate", 
                candidate: event.candidate,
                id: this.props.navigation.getParam('id')
            }); 
          } 
      };

      if(this.state.type != 'ongoing'){
        await this.acept_call();
      }
  }

  setCall = async () =>{
    let userData = await AsyncStorage.getItem('userData');
    let token = await AsyncStorage.getItem('userToken');
    token  = JSON.parse(token);
    const options = {
        headers: {
        "Accept": "application/json",
        'Authorization': 'Bearer '+token
        },
    };
    await axios.post(setup.endPoint+"/chat/call_user", 
    { 
    "receiver": this.props.navigation.getParam('id'),
    }, 
    options).
    then( async(response) => {
      socket.send({ 
          type: 'call_user',
          caller: {
              id: JSON.parse(userData).id,
              realName: JSON.parse(userData).realName,
              image: JSON.parse(userData).photo
          },
          recipient: {
              id: this.props.navigation.getParam('id'),
              realName: this.props.navigation.getParam('name')
          },
      })
    });
  }  

   render(){
    const {id,status,isMute,highVolume,uri,userName,remoteStream,stream,timerTime} = this.state
    let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
    let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
    return (
      <View style={styles.container}>
        <View style={[styles.profileImg,{backgroundColor:'gray'}]}>
         <Image source={{uri}} style={styles.profileImg}/>
        </View>
        <View style={[styles.profileImg]}>
          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>{userName}</Text>  
            <View style={styles.brandingWrapper}>
              {
                status == 'on_call'?(
                  <Text style={styles.whatsappText}>{hours} : {minutes} : {seconds}</Text>
                ):(
                  <Text style={styles.whatsappText}>{status}</Text>
                )
              }
              <RTCView streamURL={remoteStream?.toURL()}/>
            </View>
          </View>  
          <View style={styles.actionIconContainer}>
            <TouchableOpacity style={styles.actionIconWrapper} onPress={this.onMute} style={styles.callBTN}>
              <MaterialIcon  name={isMute ? "microphone-off" : "microphone"}  size={22}  color='black'/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconWrapper} onPress={this.onVolume} size={22} style={styles.callBTN}>
              <MaterialIcon  name={highVolume ? "volume-high" : "volume-off"}  color='black'/>
            </TouchableOpacity>
          </View>
          <View style={styles.endCallContainer}>
            <TouchableOpacity  onPress={this.endCall} style={styles.endCallWrapper}>
              <MaterialIcon name="phone-hangup" size={22} color='white'/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
   }
    
}

const SIZE = 50
const END_CALL_SIZE = 55

const styles = StyleSheet.create({
    container : {
      flex :1 ,
      backgroundColor : 'white',
      
    },
    profileImg : {
       width : '100%',
       height : (40*windowHeight)/100,
    }, 
    profileName : {
      fontSize : 0.045*windowWidth,
      color : 'black',
      fontWeight:'bold',
      textAlign : 'center'
    },
    profileNameContainer : {
      padding : '2%',
      justifyContent : 'center',
      alignItems : 'center'
    },
    brandingWrapper : {
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'center',
      marginHorizontal : 10,
    },
    whatsappText : {
      fontSize : 0.035*windowWidth,
      color : 'gray',
      fontWeight:'bold',
      marginLeft : 4,
      marginTop : '2%',
      
    },
    actionIconContainer : {
      padding : '5%',
      // marginVertical :'2%',
      justifyContent : 'space-around',
      flexDirection : 'row'
    },
    actionIconWrapper : {
      width : SIZE,
      height : SIZE,
      borderRadius : SIZE/2,
      borderWidth : .8,
      borderColor : 'black',
      justifyContent : 'center',
      alignItems : 'center'
    },
    endCallContainer : {
      padding : '5%',
      justifyContent : 'center',
      alignItems : 'center',
      // marginVertical : '5%'
    },
    endCallWrapper : {
      width : END_CALL_SIZE,
      height : END_CALL_SIZE,
      borderRadius : END_CALL_SIZE/2,
      backgroundColor : '#FF3824',
      justifyContent : 'center',
      alignItems : 'center'
    },    
})

export default Calling