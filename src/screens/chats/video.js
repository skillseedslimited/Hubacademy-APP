import React, { Component } from "react"
import { Text, View, StyleSheet,Dimensions,TouchableOpacity } from 'react-native'
// import {Icon,MaterialIcon,} from '../../components/Shared/Index'
// import {colors} from '../../res/style/colors'
// import {fontSizes} from '../../res/style/fontSize'
// import {fonts} from '../../res/style/fonts'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-community/async-storage';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
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

const video = {
  width: 320,
  height: 240,
}





class VideoCall extends React.PureComponent {
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
        stream: {toURL: () => null},
        remoteStream: {toURL: () => null},
        timerOn: false,
        timerStart: 0,
        timerTime: 0
      }
      // this.voice_call_init = this.voice_call_init.bind(this);
      this.video_call = this.video_call.bind(this);
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
      // socket.on('voice_call_init',this.voice_call_init)
      socket.on('video_call',this.video_call)
    }

    componentWillUnmount() {
      // socket.off('voice_call_init',this.voice_call_init)
      socket.off('video_call',this.video_call)
    }
  
  voice_call_init = async (message) =>{
    console.log('called')
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

  video_call = async (message) =>{
    switch(message.type){
        case "ringing":
          this.setState({
            status: 'Ringing...'
          })
          InCallManager.start({media: 'audio', ringback: '_DTMF_'});
        break;
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
    console.log('leaving too')
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
      console.log('handleAnswer')
      console.log(answer)
      this.yourConn.setRemoteDescription(new RTCSessionDescription(answer)); 
  };

  handleCandidate = async (candidate) => { 
      console.log('handleCandidate')
      console.log(candidate)
      await this.yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
  };

  handleOffer = async (offer) => { 
    this.yourConn.setRemoteDescription(new RTCSessionDescription(offer));
    console.log('handleOffer 1')
    const answer = "yourConn"
    await this.yourConn.setLocalDescription(answer);
    console.log(answer)
    socket.emit("videocall",{
        type: "answerOffer", 
        answer: answer,
        id: this.props.navigation.getParam('id')
    }); 
    // this.setState({
    //   status: 'On call'
    // })
    // InCallManager.stopRingback();
};

acept_call = async () => {
  console.log(this.props.navigation.getParam('id')+' now')
  const offer = "yourConn";
  await this.yourConn.setLocalDescription(offer);
  console.log(offer)
  socket.emit("videocall",{
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
      socket.emit("videocall",{
          type: "leave",
          id: this.props.navigation.getParam('id')
      });  
      await InCallManager.stopRingback();
      await InCallManager.stop();
      this.props.navigation.pop(1)
    }

    call_modal = async () =>{
      let isFront = true;
      mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices.getUserMedia({ 
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 60,
          },
          facingMode: isFront ? 'user' : 'environment',
          optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
      })
      .then((myStream) => this.streamHandlerOut(myStream))
      .catch( (error) => this.errorHandlerOut(error));
    })

    }

    errorHandlerOut = (error) => { 
        console.log(error); 
    }

    streamHandlerOut = async (myStream) => { 
      console.log('myStream');
      console.log(myStream.toURL());
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
        console.log('oniceconnectionstatechange')
        console.log(event.target.iceConnectionState)
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
        console.log('onicecandidate')
          if (event.candidate) { 
            console.log('onicecandidate 1')
            socket.emit("videocall",{
                type: "candidate", 
                candidate: event.candidate,
                id: this.props.navigation.getParam('id')
            }); 
            console.log('onicecandidate 2')
          } 
      };

      if(this.state.type != 'ongoing'){
        await this.acept_call();
        console.log('acept_call')
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
    await axios.post(setup.endPoint+"/chat/video_call_user", 
    { 
    "receiver": this.props.navigation.getParam('id'),
    }, 
    options).
    then( async(response) => {
      socket.emit("videocall",{
          type: 'call_user',
          caller: {
              id: JSON.parse(userData).id,
              realName: JSON.parse(userData).fullname,
              image: JSON.parse(userData).photo
          },
          recipient: {
              id: this.props.navigation.getParam('id'),
              realName: this.props.navigation.getParam('name')
          },
      })
      console.log(response.data.message)
    });
  }  

   render(){
    const {id,status,isMute,highVolume,uri,userName,remoteStream,stream,timerTime} = this.state
    let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
    let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
    return (
      <View style={styles.container}>
        <View style={[styles.videosr]}>
          <RTCView style={{flex:1}} zOrder={20} objectFit={"cover"} mirror={true} streamURL={remoteStream.toURL()} />
        </View>
        <View style={[styles.videosl]}>
          <RTCView style={{flex:1}} zOrder={20} objectFit={"cover"} mirror={true} streamURL={stream.toURL()} />
        </View>
     
        <View style={[styles.profileImg]}>
        
          <View style={styles.actionIconContainer}>
            <TouchableOpacity style={styles.actionIconWrapper} onPress={this.onMute} style={styles.callBTN}>
              <MaterialIcon  name={isMute ? "microphone-off" : "microphone"}  size={22}  color='black'/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconWrapper} onPress={this.onVolume} size={22} style={styles.callBTN}>
              <MaterialIcon  name={highVolume ? "volume-high" : "volume-off"}  color='black'/>
            </TouchableOpacity>
            <TouchableOpacity  onPress={this.endCall} style={styles.endCallWrapper}>
              <MaterialIcon name="phone-hangup" size={22} color='white'/>
            </TouchableOpacity>
          </View>
        </View>
        {
           status != 'on_call'?(
            <View style={styles.profileNameContainer}>
              <Text style={styles.profileName}>{userName}</Text>  
              <View style={styles.brandingWrapper}>
                <Text style={styles.whatsappText}>{status}</Text>
              </View>
            </View>  
           ):null
        }
      </View>
    )
   }
    
}

const SIZE = 45
const END_CALL_SIZE = 45

const styles = StyleSheet.create({
    container : {
      flex :1 ,
      backgroundColor : 'white',
    },
    videosl: {
      width: (25*windowWidth)/100,
      height: (25*windowHeight)/100,
      position: 'absolute',
      bottom:5,
      right:10,
      overflow: 'hidden',
      backgroundColor:'black',
      borderRadius: 20,
    },
    videosr: {
     flex:1,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor:'black',
      borderRadius: 20,
    },
    profileImg : {
       position:'absolute',
       top:5,
       width : '100%',
    }, 
    profileName : {
      fontSize : 0.035*windowWidth,
      color : 'white',
      textAlign : 'center',
      fontWeight:'bold'
    },
    profileNameContainer : {
      width: '100%',
      height:'100%',
      position:'absolute',
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
      justifyContent : 'space-between',
      flexDirection : 'column'
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
    },
    endCallWrapper : {
      width : END_CALL_SIZE,
      height : END_CALL_SIZE,
      borderRadius : END_CALL_SIZE/2,
      backgroundColor : 'red',
      justifyContent : 'center',
      alignItems : 'center'
    },    
    callBTN:{
      backgroundColor:'white',
      width : END_CALL_SIZE,
      height : END_CALL_SIZE,
      borderRadius : END_CALL_SIZE/2,
      justifyContent : 'center',
      alignItems : 'center'
    }
})


  

export default VideoCall