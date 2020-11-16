import React from 'react';
import { StyleSheet,Dimensions, Text, View, ImageBackground, Animated,StatusBar, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon, Button,Input } from 'react-native-elements'

import { onSignOut } from "../../auth";
import moment from "moment";
import Modal from "react-native-modal";

import Video from 'react-native-video';
//Import React Native Video to play video
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
//Media Controls to control Play/Pause/Seek and full screen

import Orientation from 'react-native-orientation-locker';
import Toast from "react-native-simple-toast";



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



class VideoScreen extends React.Component {

  videoPlayer;

  constructor(props) {
    super(props);
    this.state={
      videos:[],
      isAModalVisible:false,
      isEModalVisible:false,
      isModalVisible:false,
      loading: true,
      video:'',
      title:'',
      date:null,
      videoheight:250,

      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: false,
      playerState: PLAYER_STATES.PLAYING,
      screenType: 'contain',

      reviewLoading:true,
      review:[],
      comment:'',
      current_id:'',
      item_id: '',
      edit_id:''
    }
  }

  _onOrientationDidChange = (orientation) => {
    
  };

  onSeek = seek => {
    //Handler for change in seekbar
    this.videoPlayer.seek(seek);
  };
 
  onPaused = playerState => {
    //Handler for Video Pause
    this.setState({
      paused: !this.state.paused,
      playerState,
    });
  };
 
  onReplay = () => {
    //Handler for Replay
    this.setState({ playerState: PLAYER_STATES.PLAYING });
    this.videoPlayer.seek(0);
  };
 
  onProgress = data => {
    const { isLoading, playerState } = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({ currentTime: data.currentTime });
    }
  };
  
  onLoad = data => this.setState({ duration: data.duration, isLoading: false });
  
  onLoadStart = data => this.setState({ isLoading: true });
  
  onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });
  
  onError = () => alert('Oh! ', error);
  
  exitFullScreen = () => {
    alert('Exit full screen');
  };
  
  enterFullScreen = () => {};
  
  onFullScreen = () => {
    StatusBar.setBarStyle("dark-content")
    if(!this.state.isFullScreen){
      this.setState({ 
        isFullScreen: true,
        videoheight: '100%' 
      });
      Orientation.lockToLandscapeLeft();
    }else{
      this.setState({ 
        isFullScreen: false,
        videoheight: 250 
      });
      Orientation.unlockAllOrientations()
    }
    // if (this.state.screenType == 'content')
    //   this.setState({ screenType: 'cover' });
    // else this.setState({ screenType: 'content' });
  };
  renderToolbar = () => (
    <View>
       <TouchableOpacity
        onPress={this.closeModal}>
            <Icon name="close" color="#ffa726" size={28} />
        </TouchableOpacity>
    </View>
  );
  onSeeking = currentTime => this.setState({ currentTime });


  //

  openNewModal = (item) => {
    this.setState({ 
      isModalVisible: true,
      video:item.content_media.url,
      title:item.title,
      date:item.createdAt,
      item_id: item.id
    });
  };

  closeModal = () => {
    // StatusBar.setBarStyle("dark-content")
    this.setState({ 
      isModalVisible: false,
      video:'',
      title:'',
      date:null,
      isFullScreen: false,
      videoheight: 250 
    });
    Orientation.unlockAllOrientations()
  };

  componentDidMount() {
    // this.props.navigation.setParams({menu: "false"})
    Orientation.unlockAllOrientations()
    this.getVideos()
    this.getReview();
  }


  getVideos = async () => {
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/content/list?owner_id="+this.props.navigation.state.params.id+"&type_id=1",{
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Authorization': 'Bearer '+token
            },
        })
        .then((response)=>{
          if(response.status == 200){
            return response.json()
          }else if(response.status == 400){
            return null
          }else{
            return onSignOut().then(() => this.props.navigation.navigate('SignedOut'))
          }
        }).then((res)=> {
            if(res){
              console.log(res.data)
                this.setState({
                  videos:res.data,
                  loading:false
                })
            }else{
              this.setState({
                videos:[],
                loading:false
              })
            }
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }

  
 

  

  componentWillUnmount() {
    // this.getVideos()
  }

  openModal = () =>{
    this.setState({ isAModalVisible: true });
  }

  getReview = async () => {
    let token = await AsyncStorage.getItem('userToken');
    let userData = await AsyncStorage.getItem('userData');
    this.setState({
      current_id:JSON.parse(userData).id,
    })
    console.log('userId '+ JSON.parse(userData).id)
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/user/profile/reviews/"+this.props.navigation.state.params.id,{
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Authorization': 'Bearer '+token
            },
        })
        .then((response)=>{
          return response.json()
        }).then((res)=> {
            if(res.status ==='success'){
                this.setState({
                  review:res.data,
                  reviewLoading:false
                })
            }
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }


  comment = async () =>{
    this.setState({ isAModalVisible: false });
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/review/create",{
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+token
            },
            body: JSON.stringify({
              "content": this.state.comment,
              "reviewableId": this.state.item_id,
              "reviewableType": "content",
            })
        })
        .then((response)=>{
          return response.json()
        }).then((res)=> {
           console.log(res)
          //  this.getReview();
           this.setState({
            comment: '',
          })
          Toast.show('Review Added');
  
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }




 
  render() {
    const{isAModalVisible,isEModalVisible,videos,loading,video,title,date,reviewLoading,review,comment,item_id,current_id} = this.state
    if(loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#bf360c"/>
        </View>
    )}
    if(videos.length == 0){
      return(
        <View style={styles.loader}> 
          <Text style={{color:'gray'}}>
              No video content
          </Text>
        </View>
      )
    }
    return (
      <ScrollView style={{ backgroundColor:"#eceff1"}}>
          <View style={styles.container}>
          <StatusBar  backgroundColor="#eceff1" barStyle="dark-content" />
        {videos.map((item, i) => (
        <TouchableOpacity key={item.id}
        onPress={() => this.openNewModal(item)}
        style={{width:(30*windowWidth)/100,backgroundColor:'#ffa726',marginTop:10}}>
          <View style={{flex:1}}>
            <ImageBackground
              source={require('../../asset/vcode.png')}
              // source={{uri:''}}
              style={{height:(13*windowHeight)/100,alignItems:'center',justifyContent:'center'}}
              imageStyle={{
              resizeMode: 'cover',
              alignSelf: 'auto'
            }}
            >
              <Icon name='ios-play' type="ionicon" size={0.07*windowWidth} color="white" />
            </ImageBackground>
            <View style={{flex:1,paddingHorizontal:10}}>
                <Text style={{fontSize:0.03*windowWidth,paddingTop:5}}>
                    {item.title}
                </Text>
                <Text style={{color:'#bf360c',fontSize:0.03*windowWidth,marginBottom:10}}>
                  {item.owner.fullname}
                </Text>
            </View>
          </View>
        </TouchableOpacity>
      )
      )}   
       <Modal isVisible={this.state.isModalVisible}
        backdropOpacity={0}
        useNativeDriver={true}
        animationInTiming={300}
        animationOutTiming={300}
        hideModalContentWhileAnimating
        onBackButtonPress ={() => this.setState({ isModalVisible: false})}
        // onBackdropPress={() => this.setState({ isModalVisible: false })}
        style={{justifyContent:'flex-end',margin: 0}}>
          <View style={{ backgroundColor: '#eceff1',height:'100%',borderColor: 'rgba(0, 0, 0, 0.1)',}}>
            <View style={{flex:1}}>

              <View style={{width:'100%',height:this.state.videoheight}}>
                <Video
                  onEnd={this.onEnd}
                  onLoad={this.onLoad}
                  onLoadStart={this.onLoadStart}
                  onProgress={this.onProgress}
                  paused={this.state.paused}
                  ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                  resizeMode={this.state.screenType}
                  // fullscreen={this.state.isFullScreen}
                  source={{ uri: setup.baseUrl+'/video/'+video}}
                  style={styles.mediaPlayer}
                  volume={10}
                />
                <MediaControls
                  duration={this.state.duration}
                  isLoading={this.state.isLoading}
                  mainColor="#333"
                  onFullScreen={this.onFullScreen}
                  onPaused={this.onPaused}
                  onReplay={this.onReplay}
                  onSeek={this.onSeek}
                  onSeeking={this.onSeeking}
                  playerState={this.state.playerState}
                  progress={this.state.currentTime}
                  toolbar={this.renderToolbar()}
                />
              </View>
              <ScrollView style={{width:'100%',height:200}}>
                <View style={{paddingHorizontal:10}}>
                  <Text style={{fontSize:20,paddingTop:5}}>
                      {title}
                  </Text>
                  <Text style={{color:'#bf360c',fontSize:14,marginBottom:10}}>
                    {moment(date, "YYYYMMDD").fromNow()}
                  </Text>
                </View>
                <View style={{paddingHorizontal:10}}>
                  <Text style={{fontSize:16,marginVertical:20}}>
                    Comments:
                  </Text>
                  <Button
                    onPress={this.openModal}
                    title='Add comment'
                    type='solid'
                    buttonStyle={{backgroundColor:'#ffa726'}}
                  />
                </View>

                {/* <View style={{width:'100%',borderBottomWidth:1,borderBottomColor:'#424242',paddingHorizontal:15,paddingVertical:15}}>
                  <View>
                    <Text style={{color:'#ffa726'}}>
                      Emibrown - 1 month ago
                    </Text>
                    <Text>
                     Nice video bro keep it up, i love this
                    </Text>
                  </View>
                </View> */}

              </ScrollView>
                
            </View>
          </View>
        </Modal>
        <Modal isVisible={isAModalVisible}
       backdropOpacity={0}
       useNativeDriver={true}
       animationInTiming={300}
       animationOutTiming={300}
       onShow={() => { this.input.focus(); }}
       hideModalContentWhileAnimating ={true}
        onBackdropPress={() => this.setState({ isAModalVisible: false })}
        onBackButtonPress ={() => this.setState({ isAModalVisible: false})}
        style={{justifyContent:'flex-end',margin: 0}}>
          <Animated.View style={{ backgroundColor: 'black',minHeight:(10*windowHeight)/100,borderColor: 'rgba(0, 0, 0, 0.1)',}}>
            <View style={{flex:1,flexDirection:'row',marginHorizontal:'5%',justifyContent:'center',alignItems:'center'}}>
             <View style={{flex:3}}>
              <Input
                  ref={(input) => { this.input = input; }}
                  placeholder='Enter review here'
                  placeholderTextColor="#616161"
                  value ={comment}
                  inputContainerStyle={{borderWidth:0,borderBottomWidth:0}}
                  inputStyle={{color:'white'}}
                  onChangeText={ TextInputValue =>
                    this.setState({comment : TextInputValue }) }
                  containerStyle={{paddingHorizontal:0}}
                  multiline
                />
             </View>
           
              <TouchableOpacity 
              onPress={this.comment}
                    style={styles.fab}
              >
                <Icon name="send" type='material' size={20} color="black" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Modal>

        <Modal isVisible={isEModalVisible}
       backdropOpacity={0}
       useNativeDriver={true}
       animationInTiming={300}
       animationOutTiming={300}
       onShow={() => { this.input.focus(); }}
       hideModalContentWhileAnimating ={true}
        onBackdropPress={() => this.setState({ isEModalVisible: false, comment: '' })}
        onBackButtonPress ={() => this.setState({ isEModalVisible: false})}
        style={{justifyContent:'flex-end',margin: 0}}>
          <Animated.View style={{ backgroundColor: 'black',minHeight:(10*windowHeight)/100,borderColor: 'rgba(0, 0, 0, 0.1)',}}>
            <View style={{flex:1,flexDirection:'row',marginHorizontal:'5%',justifyContent:'center',alignItems:'center'}}>
             <View style={{flex:3}}>
              <Input
                  ref={(input) => { this.input = input; }}
                  placeholder='Enter review here'
                  placeholderTextColor="#616161"
                  value ={comment}
                  inputContainerStyle={{borderWidth:0,borderBottomWidth:0}}
                  inputStyle={{color:'white'}}
                  onChangeText={ TextInputValue =>
                    this.setState({comment : TextInputValue }) }
                  containerStyle={{paddingHorizontal:0}}
                  multiline
                />
             </View>
            
              <TouchableOpacity 
              onPress={this.Edit_comment}
                    style={styles.fab}
              >
                <Icon name="send" type='material' size={20} color="black" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Modal>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap:'wrap',
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor: '#eceff1',
    paddingHorizontal:(3*windowWidth)/100
  },
  scroll: {
    flex: 1,
    paddingHorizontal: '2%',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  details: {
    color: 'white',
    fontSize: 14,
  },
  services: {
    backgroundColor: '#B8860B',
    width: '100%',
    marginVertical: '3%',
    padding: '10%',
  },
  fab: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#616161', 
    borderRadius: 30, 
    elevation: 8 
  }, 
  fabIcon: { 
    fontSize: 40, 
    color: 'white' 
  },
  loader:{
    flex: 1,
    backgroundColor:'#eceff1',
    justifyContent: "center",
    alignItems: "center",
  },
  mediaPlayer: {
    position: 'absolute',
    alignItems:'center',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
});

export default VideoScreen;