import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions,StatusBar,Animated,  ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon, Button,Input } from 'react-native-elements'

import moment from "moment";
import Modal from "react-native-modal";
import Sound from 'react-native-sound';
import Toast from "react-native-simple-toast";




const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;






class AudiosScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      audios:[],
      loading: true,
      audio:'',
      title:'',
      date:null,
      isAModalVisible:false,
      isEModalVisible:false,
      isModalVisible: false,

      playLoading:false,
      play:false,

      reviewLoading:true,
      review:[],
      comment:'',
      current_id:'',
      item_id: '',
      edit_id:''
    }
  }

  componentDidMount() {
    this.getVideos()
    // console.log(this.props.navigation.state.params.id)
  }


  getVideos = async () => {
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/content/list?type_id=5&free=yes",{
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
              // console.log(res.data)
              this.setState({
                audios:res.data,
                loading:false
              })
            }else{
              this.setState({
                audios:[],
                loading:false
              })
            }
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }

  openNewModal = (item) => {
    this.setState({ 
      isModalVisible: true,
      audio:item.content_media.url,
      title:item.title,
      date:item.createdAt,
    });
  };

 
  play = (audio_link) =>{
    this.setState({
      playLoading:true
    })
    this.hello = new Sound(setup.baseUrl+'/audio/'+audio_link, null, (error) => {
      if (error) {
        return Toast.show('Failed to load the audio');
      }
      this.setState({
        playLoading:false,
        play:true
      })
      this.hello.play((success) => {
        if (success) {
          this.setState({
            play:false
          })
          Toast.show('Finished playing');
        } else {
          this.setState({
            play:false
          })
          Toast.show('Failed to play the audio');
        }
      });
     
    });
  }

  stop = ()=>{
    this.hello.stop(() => {
      // Note: If you want to play a sound after stopping and rewinding it,
      // it is important to call play() in a callback.
      this.setState({
        play:false
      })
    });
  }

  closeModal = () => {
    if(this.state.play){
      this.stop()
    }
    this.setState({ 
      isModalVisible: false,
      audio:'',
      title:'',
      date:null,
      playLoading:false,
      play:false
    });
    
  };

  componentWillUnmount() {
  
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
    const{isAModalVisible,isEModalVisible,audios,loading,audio,title,date,play,playLoading,reviewLoading,review,comment,item_id,current_id} = this.state

    if(loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#ff9800"/>
        </View>
    )}
    if(audios.length == 0){
      return(
        <View style={styles.loader}> 
          <Text style={{color:'gray'}}>
              No audio content
          </Text>
        </View>
      )
    }
    return (
      <ScrollView style={{ backgroundColor:"#eceff1"}}>
      <View style={styles.container}>
          <StatusBar  backgroundColor="#eceff1" barStyle="dark-content" />
        {audios.map((item, i) => (
        <TouchableOpacity key={item.id}
        onPress={() => this.openNewModal(item)}
        style={{width:(30*windowWidth)/100,backgroundColor:'#ffa726',marginTop:10}}>
          <View style={{flex:1}}>
            <ImageBackground
              source={require('../../asset/audio.jpg')}
              // source={{uri:''}}
              style={{height:(13*windowHeight)/100,alignItems:'center',justifyContent:'center'}}
              imageStyle={{
              resizeMode: 'cover',
              alignSelf: 'auto'
            }}
            >
              <Icon name='ios-play' type="ionicon" size={0.07*windowWidth} color="black" />
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
        onBackButtonPress ={this.closeModal}
        // onBackdropPress={() => this.setState({ isModalVisible: false })}
        style={{justifyContent:'flex-end',margin: 0}}>
          <View style={{ backgroundColor: '#eceff1',height:'100%',borderColor: 'rgba(0, 0, 0, 0.1)',}}>
            <View style={{flex:1}}>
              <View style={{position:'absolute',zIndex:99,justifyContent:'space-between',flexDirection:'row',paddingHorizontal:30,paddingTop:10}}>
                  <TouchableOpacity
                  onPress={this.closeModal}>
                      <Icon name="close" color="#ffa726" size={28} />
                  </TouchableOpacity>
              </View>

              <View style={{width:'100%',height:250}}>
                <View
                  style={{width: '100%', height:'100%',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingTop:'30%',paddingLeft:'5%',paddingRight:'5%'}}
                  >
                  {play? (
                    <TouchableOpacity onPress={()=>this.stop()}>
                    <View>
                      <Icon name='stop-circle' type="font-awesome" size={40} color="white" />
                    </View>
                </TouchableOpacity>
                  ):(
                    <TouchableOpacity onPress={()=>this.play(audio)}>
                    <View>
                      <Icon name='play-circle' type="font-awesome" size={40} color="white" />
                    </View>
                </TouchableOpacity>
                  )}
                {playLoading? (
                    <ActivityIndicator style={{position: 'absolute',top:'50%',left:'50%'}} size="large" color="#fff3e0"/>
                ): null}


                </View>
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

export default AudiosScreen;