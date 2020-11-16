import React from 'react';
import { StyleSheet, Dimensions, ImageBackground, Text,ActivityIndicator, View, ScrollView, Alert, Platform,Animated, BackHandler, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon, Button,Input } from 'react-native-elements'
import Toast from "react-native-simple-toast";
import Modal from "react-native-modal";
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

class CoachDetailScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      isModalVisible:false,
      isEModalVisible:false,
      coache:{},
      likes: 0,
      fellower: 0,
      liked_by_user: 0,
      isFollowing: 0,
      ldisabled: false,
      fdisabled: false,
      loading:true,
      fadeAnim: new Animated.Value(0), // Initial value 
      reviewLoading:true,
      review:[],
      comment:'',
      current_id:'',
      edit_id:'',
      isRequest: false
    }
  }

componentDidMount() {
  this.getCoache();
  this.getReview();
  Animated.timing(
    this.state.fadeAnim,
    {
      toValue: 1,
      duration: 1000,
    }
  ).start();
}

getCoache = async () => {
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      fetch(setup.endPoint+"/account/user/get/"+this.props.navigation.state.params.id,{
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
                coache:res.data,
                likes: res.data.likeCount,
                fellower: res.data.followersCount,
                liked_by_user: res.data.liked_by_user,
                isFollowing: res.data.isFollowing,
                loading:false
              })
              console.log(this.props.navigation.state.params.id)
          }
      })
      .catch(error=>console.log(error)) //to catch the errors if any
    }
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
  
componentWillUnmount() {

}

follow = async (value) =>{
  value = value == 1?'unfollow':'follow'
  this.setState({
    fdisabled: true,
  })
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      fetch(setup.endPoint+"/user/profile/follow",{
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
          body: JSON.stringify({
            "id": this.props.navigation.state.params.id,
            "action": value
          })
      })
      .then((response)=>{
        return response.json()
      }).then((res)=> {
          console.log(res)
          if(value == 'unfollow'){
            this.setState({
              fellower: this.state.fellower - 1,
              isFollowing: 0,
            })
            Toast.show('Profile unfollowed');
          }else{
            this.setState({
              fellower: this.state.fellower + 1,
              isFollowing: 1,
            })
            Toast.show('Profile followed');
          }
          this.setState({
            fdisabled: false,
          })
          // if(res.status ==='success'){
          //     this.setState({
          //       coache:res.data,
          //       loading:false
          //     })
          // }
      })
      .catch(error=>console.log(error)) //to catch the errors if any
    }
  console.log(value)
}

like = async (value) =>{
  value = value == 1?'unlike':'like'
  this.setState({
    ldisabled: true,
  })
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      fetch(setup.endPoint+"/user/profile/like",{
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
          body: JSON.stringify({
            "id": this.props.navigation.state.params.id,
            "action": value
          })
      })
      .then((response)=>{
        return response.json()
      }).then((res)=> {
          console.log(res)
          if(value == 'unlike'){
            this.setState({
              likes: this.state.likes - 1,
              liked_by_user: 0,
            })
            Toast.show('Profile unliked');
          }else{
            this.setState({
              likes: this.state.likes + 1,
              liked_by_user: 1,
            })
            Toast.show('Profile liked');
          }
          this.setState({
            ldisabled: false,
          })
      })
      .catch(error=>console.log(error)) //to catch the errors if any
    }
}

openModal = () =>{
  this.setState({ isModalVisible: true });
}

comment = async () =>{
  this.setState({ isModalVisible: false });
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
            "reviewableId": this.props.navigation.state.params.id,
            "reviewableType": "user",
          })
      })
      .then((response)=>{
        return response.json()
      }).then((res)=> {
         console.log(res)
         this.getReview();
         this.setState({
          comment: '',
        })
        Toast.show('Review Added');

      })
      .catch(error=>console.log(error)) //to catch the errors if any
    }
}

delete_review = async (id) =>{
  let items = this.state.review;
  let token = await AsyncStorage.getItem('userToken');
  Alert.alert(
    "Delete",
    "Are you sure you want to delete this reviw?",
    [
      {
        text: "No",
        style: "cancel"
      },
      { text: "Yes", onPress: () => {
        if (token !== null) {
          token  = JSON.parse(token);
          fetch(setup.endPoint+"/review/"+id,{
              method: 'delete',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
              },
          })
          .then((response)=>{
            return response.json()
          }).then((res)=> {
            items.splice(items.findIndex(function(i){
                return i.id === id;
            }), 1);
            this.setState({
              review: items,
            })
            Toast.show(res.message);
    
          })
        }
      } }
    ],
    { cancelable: false }
  );
}


edit_review = async (review,id) =>{
  this.setState({
    comment: review,
    edit_id: id
  })
  this.setState({ isEModalVisible: true });
}



Edit_comment = async () =>{
  this.setState({ isEModalVisible: false });
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      fetch(setup.endPoint+"/review/"+this.state.edit_id,{
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
          body: JSON.stringify({
            "content": this.state.comment,
            "reviewableType": "user",
          })
      })
      .then((response)=>{
        return response.json()
      }).then((res)=> {
         this.getReview();
         this.setState({
          comment: '',
        })
        Toast.show('Review Edited');

      })
      .catch(error=>console.log(error)) //to catch the errors if any
    }
}

openChat = async (userName) =>{
  this.setState({
    isRequest: false
  })
  this.props.navigation.navigate(`Chat`, {
    id:this.props.navigation.state.params.id,
    userName
  })
}

openVideo = async (userName) =>{
  this.setState({
    isRequest: false
  })
  this.props.navigation.navigate(`VideoCall`, {
    id:this.props.navigation.state.params.id,
    name: userName,
    uri:setup.baseUrl+'/images/'+this.state.coache.photo || '',
    type:'ongoing'
  })
}


openVoice = async (userName) =>{
  this.setState({
    isRequest: false
  })
  this.props.navigation.navigate(`VoiceCall`, {
    id:this.props.navigation.state.params.id,
    name: userName,
    uri:setup.baseUrl+'/images/'+this.state.coache.photo || '',
    type:'ongoing'
  })
}









 
  render() {
    const{isModalVisible,isEModalVisible,coache,likes,fellower,isRequest,liked_by_user,isFollowing,ldisabled,fdisabled,loading,fadeAnim,reviewLoading,review,comment,current_id} = this.state;
    if(loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#ffa726"/>
        </View>
    )}
    return (
      <Animated.View style={[styles.container,platformSpecificStyle,{opacity: fadeAnim, }]}>
      <ScrollView style={{width:'100%',height:'90%',backgroundColor:'#eceff1'}}>
        <View style={{width:'100%',paddingTop:(6*windowHeight)/100,alignItems:'center'}}>
          <View style={styles.header}>
            <TouchableOpacity style={{width:"10%"}} onPress={() => this.props.navigation.popToTop()}>
              <Icon name='arrow-back'  size={24} color="black" />
            </TouchableOpacity>
          </View>
          <ImageBackground
            source={{uri:setup.baseUrl+'/images/'+coache.photo || ''}}
            style={{height:(16*windowHeight)/100,aspectRatio:1}}
          imageStyle={{
            resizeMode: 'cover',
            alignSelf: 'auto',
            borderRadius:10,
            backgroundColor:'gray'
          }}>
          </ImageBackground> 
          <Text style={{fontSize: 0.05*windowWidth}}>
          {coache.firstname}  {coache.lastname}
          </Text>
          <Text style={{color:'#616161',fontSize:0.04*windowWidth,marginBottom:(1*windowHeight)/100}}>
          {coache.category? coache.category.name : 'No category'}
          </Text>
          <View style={{width:'60%',flexDirection:'row',height:(4.5*windowHeight)/100,backgroundColor:'black',borderRadius:10,marginTop:(1*windowHeight)/100,justifyContent:'center',alignItems:'center'}}>
              <TouchableOpacity disabled={fdisabled} onPress={() => this.follow(isFollowing)} style={{flex:1,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#eceff1'}}>
                  <Text style={{fontSize: 0.03*windowWidth,color:'white'}}>
                  {isFollowing == 1 ? 'UNFOLLOW':'FOLLOW'}
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={ldisabled} onPress={() => this.like(liked_by_user)} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize: 0.03*windowWidth,color:'white'}}>
                  {liked_by_user == 1 ? 'UNLIKE':'LIKE'}
                  </Text>
              </TouchableOpacity>
          </View>
           <View style={{width:'90%',flexDirection:'row',height:(8*windowHeight)/100,backgroundColor:'#ffa726',borderRadius:10,marginTop:(1*windowHeight)/100,justifyContent:'center',alignItems:'center'}}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#eceff1'}}>
              <Text style={{fontSize: 0.04*windowWidth}}>
              {coache.subscriptionCount} 
                </Text>
                <Text style={{fontSize: 0.03*windowWidth}}>
                Subscribers
                </Text>
              </View>
              <View style={{flex:1,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#eceff1'}}>
              <Text style={{fontSize: 0.04*windowWidth}}>
                {fellower} 
                </Text>
                <Text style={{fontSize: 0.03*windowWidth}}>
                Followers
                </Text>
              </View>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize: 0.04*windowWidth}}>
              {likes}  
                </Text>
                <Text style={{fontSize: 0.03*windowWidth}}>
                  Likes
                </Text>
              </View>
          </View>
          <View style={{width:'100%',flexDirection:'column',minHeight:(45*windowHeight)/100,backgroundColor:'#ffa726',paddingHorizontal:'3%',paddingTop:20,borderTopLeftRadius: 20,borderTopRightRadius: 20,marginTop:(1*windowHeight)/100}}>
             <View style={{}}>
                <Text style={{fontSize: 0.035*windowWidth}}>
                  {coache.about || 'No About'}
                </Text>
             </View>
            <TouchableOpacity
            onPress={this.openModal}
              style={{width:'50%',backgroundColor:'black',marginTop:(2*windowHeight)/100,padding:5,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize: 0.03*windowWidth,color:'white'}}>
                Add Review
              </Text>
            </TouchableOpacity>
             <View style={{marginTop:(2*windowHeight)/100,minHeight:(30*windowHeight)/100,borderRadius:10,backgroundColor:'black',paddingHorizontal:'3%',paddingVertical:'3%'}}>
              
                {
                  reviewLoading ? (
                    <View style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}> 
                        <ActivityIndicator size="large" color="#ffa726"/>
                    </View>
                  ): review.length == 0?(
                    <Text style={{color:'white',fontSize: 0.035*windowWidth}}>
                    No review
                    </Text>
                  ):review.map((item, i) => (
                    <View key={item.id} style={{marginTop:(1*windowHeight)/100}}>
                      <Text style={{color:'#616161',fontSize: 0.03*windowWidth,marginTop:(1*windowHeight)/100}}>
                        {item.reviewBy.firstname}
                      </Text>
                      <Text style={{color:'white',fontSize: 0.035*windowWidth, paddingLeft:(4*windowWidth)/100}}>
                        {item.content}
                      </Text>
                      <View style={{flex:1,flexDirection:'row'}}>
                          <Text style={{color:'#616161',fontSize: 0.03*windowWidth,marginTop:(0.5*windowHeight)/100,paddingLeft:(4*windowWidth)/100}}>
                            {moment(item.createdAt, "YYYYMMDD").fromNow()}
                          </Text>
                          {
                            current_id == item.userId ? (
                              <>
                              <TouchableOpacity 
                              onPress={ () => this.edit_review(item.content,item.id)}
                              style={{marginTop:(0.5*windowHeight)/100,marginLeft:(10*windowWidth)/100}}>
                                <Text style={{color:'#616161',fontSize: 0.03*windowWidth}}>
                                  Edit
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity 
                              onPress={ () => this.delete_review(item.id)}
                              style={{marginTop:(0.5*windowHeight)/100,marginLeft:(10*windowWidth)/100}}>
                                <Text style={{color:'#616161',fontSize: 0.03*windowWidth}}>
                                Delete
                                </Text>
                              </TouchableOpacity>
                              </>
                            ) : null
                          }
                      </View>
                    </View>
                  ))
                }
             </View>
          </View>
        </View>
      </ScrollView>
      <View style={{width:'100%',height:'10%',backgroundColor:'#ffa726',paddingHorizontal:'4%', justifyContent:'center',alignItems:'center'}}>
        <Button
          onPress={() => this.setState({
            isRequest:true
          })}
          title="INITATE REQUEST"
          type='solid'
          titleStyle={{color:'black'}}
          buttonStyle={{backgroundColor:'#eceff1',borderRadius:10}}
          containerStyle={{width:'100%',}}
        />
      </View>
      <Modal isVisible={isModalVisible}
       backdropOpacity={0}
       useNativeDriver={true}
       animationInTiming={300}
       animationOutTiming={300}
       onShow={() => { this.input.focus(); }}
       hideModalContentWhileAnimating ={true}
        onBackdropPress={() => this.setState({ isModalVisible: false })}
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
             <View style={{flex:1}}>

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
             <View style={{flex:1}}>

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

        <Modal isVisible={isRequest}
        backdropOpacity={0}
        onBackButtonPress={() => this.setState({
          isRequest:false
        })}
        onBackdropPress={() => this.setState({
          isRequest:false
        })}
        useNativeDriver={true}
        animationInTiming={300}
        animationOutTiming={300}
        hideModalContentWhileAnimating
        style={{justifyContent:'flex-end',margin: 0}}>
          <View style={{ backgroundColor: 'white',height:'10%',borderTopLeftRadius:20,borderTopRightRadius:20,borderColor: 'rgba(0, 0, 0, 0.1)',}}>
            <View style={{flex:1}}>
              <View style={{flex:1,flexDirection:'row',paddingHorizontal:30,paddingVertical:20}}>
                <TouchableOpacity activeOpacity={.5} onPress={() => this.openChat(coache.firstname+' '+coache.lastname)} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                  <Icon name='chat' type='MaterialIcons'  size={18} color="#ffa726" />
                  <Text style={{fontSize:0.03*windowWidth,color:'#ffa726'}}>
                    Chat
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.5} onPress={() => this.openVoice(coache.firstname+' '+coache.lastname)}   style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                  <Icon name='call' type='MaterialIcons' size={18} color="#ffa726" />
                  <Text style={{fontSize:0.03*windowWidth,color:'#ffa726'}}>
                    Voice call
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.5} onPress={() => this.openVideo(coache.firstname+' '+coache.lastname)} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                  <Icon name='videocam' type='MaterialIcons' size={18} color="#ffa726" />
                  <Text style={{fontSize:0.03*windowWidth,color:'#ffa726'}}>
                    Video call 
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
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
    width: 56, 
    height: 56, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#ffa726', 
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
    width:'100%',
    padding:10,
    top:5,
    left:5
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
});

export default CoachDetailScreen;