import React from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator,ImageBackground, ScrollView, BackHandler, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon } from 'react-native-elements'
import { onSignOut } from "../../auth";
import Sound from 'react-native-sound';
import Toast from "react-native-simple-toast";

const {height} = Dimensions.get('window');







class ReflectionDetailsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      reflection:'',
      loading:true,
      playLoading:false,
      play:false
    }
   
  }


  componentDidMount() {
    this.getReflection();
  }

  play = () =>{
    this.setState({
      playLoading:true
    })
    this.hello = new Sound('https://myacademyhub.s3.amazonaws.com/audio/'+this.state.reflection.audio_link, null, (error) => {
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

  stop= ()=>{
    this.hello.stop(() => {
      // Note: If you want to play a sound after stopping and rewinding it,
      // it is important to call play() in a callback.
      this.setState({
        play:false
      })
    });
  }

  
 

  

  componentWillUnmount() {
  
  }

  getReflection = async () => {
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/reflection/"+this.props.navigation.state.params.id,{
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Authorization': 'Bearer '+token
            },
        })
        .then(response => response.json())
        .then((res)=> {
            if(res.status =='success'){
                this.setState({
                  reflection:res.data,
                  loading:false
                })
            }else{
              onSignOut().then(() => this.props.navigation.navigate('SignedOut'))
            }
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }




 
  render() {
    const{reflection,loading,playLoading,play} = this.state;
    return (
      <ScrollView style={styles.container}>
        <View style={{width:'100%',height:(height/100)*50, backgroundColor:'gray'}}>
          {/* <View style={styles.header}>
            <TouchableOpacity  onPress={() => this.props.navigation.popToTop()}>
              <Icon name='arrow-back'  size={23} color="white" />
            </TouchableOpacity>
            <Text style={{fontSize:18,paddingLeft:20,color:'white'}}>Reflection</Text>
          </View> */}
          {loading ? 
            (
              <ActivityIndicator style={{position: 'absolute',top:'50%',left:'45%'}} size="large" color="#fff3e0"/>
            ) :
            (
              <ImageBackground
              source={{uri:setup.baseUrl+'/images/'+reflection.image_link}}
              style={{width: '100%', height:'100%', alignItems:'center'}}
              imageStyle={{
                resizeMode: 'cover',
                alignSelf: 'auto'
              }}>
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
                    <TouchableOpacity onPress={()=>this.play()}>
                    <View>
                      <Icon name='play-circle' type="font-awesome" size={40} color="white" />
                    </View>
                </TouchableOpacity>
                  )}
                {playLoading? (
                    <ActivityIndicator style={{position: 'absolute',top:'50%',left:'50%'}} size="large" color="#fff3e0"/>
                ): null}


                </View>
             </ImageBackground> 
            )
          }
          <ImageBackground
           style={{width: '100%', height:'100%',}}>

          </ImageBackground> 
        </View>
        {loading?(
          <View style={{  flex: 1,
                  backgroundColor:'#eceff1',
                  paddingHorizontal:40
                }}>
               <ActivityIndicator size="large" color="#f57c00"/>
             </View>        ):(
          <View style={{padding:20}}> 
          <Text style={{fontSize:18,color:'#f57c00'}}>
            Title: 
          </Text>
          <Text style={{fontSize:16}}>
            {reflection.title}
          </Text>
          <Text style={{fontSize:18,marginTop:20,color:'#f57c00'}}>
            Content:
          </Text>
          <Text style={{fontSize:16}}>
          {reflection.content}
          </Text>
          <Text style={{fontSize:18,marginTop:20,color:'#f57c00'}}>
            Author:
          </Text>
          <Text style={{fontSize:14}}>
          {reflection.author}
          </Text>
          <Text style={{fontSize:18,marginTop:20,color:'#f57c00'}}>
            Date:
          </Text>
          <Text style={{fontSize:14}}>
          {reflection.date}
          </Text>
        </View> 
        )} 
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eceff1',
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
    padding: '10%'
  },
  fab: { 
    position: 'absolute', 
    width: 56, 
    height: 56, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 20, 
    bottom: 20, 
    backgroundColor: '#032D66', 
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
  header:{
    zIndex:10,
    position:'absolute',
    flex:1,
    flexDirection:'row',
    paddingHorizontal:20,
    paddingVertical:20,
    top:0,
  }
});

export default ReflectionDetailsScreen;