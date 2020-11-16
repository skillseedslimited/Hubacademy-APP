import React from 'react';
import { StyleSheet, Dimensions, ImageBackground, Text,ActivityIndicator, View, ScrollView, Alert, Platform,Animated, BackHandler, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon, Button,Input } from 'react-native-elements'
import { onSignOut } from "../../auth";
import CatsComponent from '../../components/CatsComponent'
import Toast from "react-native-simple-toast";
import Modal from "react-native-modal";
import PaystackWebView from 'react-native-paystack-webview'
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

class AuthorScreen extends React.Component {

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
      settings:{},
      userEmail:'',
      current_id:'',
      edit_id:'',
      userHasSubscribed: 0
    }
  }


componentDidMount() {
  this.getSettings().then(()=>{
    console.log(this.props.navigation.state.params.id)
    this.getCoache();
  })
  this.getReview();
  Animated.timing(
    this.state.fadeAnim,
    {
      toValue: 1,
      duration: 1000,
    }
  ).start();
}

getSettings = async () => {
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      fetch(setup.endPoint+"/settings/global/subscription",{
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
            console.log(res.data)
            this.setState({
              settings:res.data,
            })
          }
      })
      .catch(error=>console.log(error)) //to catch the errors if any
    }
}

getCoache = async () => {
  let token = await AsyncStorage.getItem('userToken');
  let userData = await AsyncStorage.getItem('userData');
  this.setState({
    userEmail:JSON.parse(userData).email,
  })
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
              console.log(res.data)
              this.setState({
                coache:res.data,
                likes: res.data.likeCount,
                fellower: res.data.followersCount,
                liked_by_user: res.data.liked_by_user,
                isFollowing: res.data.isFollowing,
                userHasSubscribed: res.data.userHasSubscribed,
                loading:false
              })
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

start_trans = async () => {
  let token = await AsyncStorage.getItem('userToken');
  let ref = false
    if (token !== null) {
      token  = JSON.parse(token);
      await fetch(setup.endPoint+"/transaction/start",{
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
          body: JSON.stringify({
            "amount": parseInt(this.state.settings.global_subscription_amount),
          })
      })
      .then((response)=>{
        return response.json()
      }).then( (res)=> {
          if(res.status ==='success'){
              ref = res.data.reference
          }else{
            ref = false
          }
      })
    }
    return ref
}

subscribe = async () => {
  Alert.alert(
    "Subscribe",
    "Are you sure you want to subscribe to this author?",
    [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { 
        text: "Yes", 
        onPress: () => this.subscribeAuthor() 
      }
    ],
    { cancelable: false }
  );
}

viewContent = async () => {
    if(this.state.userHasSubscribed == 1){
      this.props.navigation.navigate(`Content`, {id: this.state.coache.id})
    }else(
      Alert.alert("Subscription not found",'Subsribe to author first')
    )
}

subscribeAuthor = async () => {
  let token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      token  = JSON.parse(token);
      await fetch(setup.endPoint+"/subscription/subscribe/author",{
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
          body: JSON.stringify({
            "duration":"weekly",
            "amount": parseInt(this.state.settings.global_subscription_amount),
            "authorId": this.props.navigation.state.params.id,
            "forceSubscription" : "no"
          })
      })
      .then((response)=>{
        return response.json()
      }).then( (res)=> {
          if(res.status == 'success'){
            console.log(res)
            this.setState({
              userHasSubscribed:1
            })
            Alert.alert('Status '+res.status,res.message)  
          }else{
            Alert.alert('Status '+res.status,res.message)  
          }
      })
    }
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

 
  render() {
    const{isModalVisible,userHasSubscribed,isEModalVisible,coache,likes,fellower,liked_by_user,isFollowing,ldisabled,fdisabled,loading,fadeAnim,reviewLoading,review,comment,settings,userEmail,current_id} = this.state;
    if(loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#ffa726"/>
        </View>
    )}
    return (
      <Animated.View style={[styles.container,{opacity: fadeAnim, }]}>
      <ScrollView style={{width:'100%',height:'90%',backgroundColor:'#eceff1'}}>
        <View style={{width:'100%',alignItems:'center'}}>
          <View style={[platformSpecificStyle,styles.header]}>
            <TouchableOpacity style={{width:"10%"}} onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back'  size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={{width:"10%"}} disabled={ldisabled} onPress={() => this.like(liked_by_user)}>
              {liked_by_user == 1 ? (
                  <Icon name='heart' type='font-awesome' size={22} color="red" />
              ):(
                <Icon name='heart' type='evilicon' size={26} color="red" />
              )}
            </TouchableOpacity>
          </View>
          <ImageBackground
            source={{uri:setup.baseUrl+'/images/'+coache.photo || ''}}
            style={{width: '100%',height:(40*windowHeight)/100, alignItems:'center'}}
            imageStyle={{
            resizeMode: 'cover',
            alignSelf: 'auto',
            backgroundColor:'gray'
          }}>
            <View style={{width: '100%', height:'100%',flexDirection:'column-reverse',backgroundColor:'rgba(0, 0, 0, 0.7)',alignItems:'center'}}>
              <Text style={{fontSize: 0.06*windowWidth,color:'white',padding:'5%'}}>
              {coache.firstname}  {coache.lastname}
              </Text>
            </View>
          </ImageBackground> 
          <View style={{width:'90%',flexDirection:'row',height:(8*windowHeight)/100,borderRadius:10,marginTop:(0*windowHeight)/100,justifyContent:'center',alignItems:'center'}}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize: 0.04*windowWidth}}>
              {coache.subscriptionCount} 
                </Text>
                <Text style={{fontSize: 0.03*windowWidth}}>
                Subscribers
                </Text>
              </View>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
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
          <View style={{width:'100%',flexDirection:'row',minHeight:(15*windowHeight)/100,backgroundColor:'black',justifyContent:'center',alignItems:'center',paddingHorizontal:'6%',borderRadius: 5,marginTop:(1*windowHeight)/100}}>
            <View style={{width:'50%'}}>
                <Text style={{color:'white',fontSize:0.06*windowWidth,marginBottom:(1*windowHeight)/100}}>
                {coache.category? coache.category.name : 'No category'}
                </Text>
            </View>
            <View style={{width:'50%'}}>
              <TouchableOpacity activeOpacity={.8}
                disabled={fdisabled} onPress={() => this.follow(isFollowing)}
                 style={{width:'100%',backgroundColor:'white',padding:5,borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize: 0.03*windowWidth,color:'black'}}>
                  {isFollowing == 1 ? 'UNFOLLOW':'FOLLOW'}
                  </Text>
                </TouchableOpacity>
                {
                    settings.global_subscription_by == 'author'?(
                      <TouchableOpacity activeOpacity={.8}
                      disabled={userHasSubscribed == 0? false: true}
                      onPress={() => this.subscribe()}
                      style ={{width:'100%',backgroundColor: userHasSubscribed == 0? '#ffa726':'#bdbdbd',padding:5,borderRadius:5,justifyContent:'center',alignItems:'center',marginTop:10}}>
                        <Text style={{fontSize: 0.03*windowWidth,color:'black'}}>
                          {userHasSubscribed == 0? 'SUBSCRIBE NOW': 'SUBSCRIBED'}
                        </Text>
                      </TouchableOpacity>
                    ): null
                  }
                {/* <TouchableOpacity
                 style={{width:'100%',backgroundColor:'#ffa726',padding:5,borderRadius:5,justifyContent:'center',alignItems:'center',marginTop:10}}>
                  <Text style={{fontSize: 0.03*windowWidth,color:'black'}}>
                    SUBSCRIBE
                  </Text>
                </TouchableOpacity> */}
            </View>
          </View>
          <View style={{width:'100%',flexDirection:'column',minHeight:(45*windowHeight)/100,paddingHorizontal:'3%',paddingTop:20,borderTopLeftRadius: 20,borderTopRightRadius: 20,marginTop:(1*windowHeight)/100}}>
             <View style={{}}>
                <Text style={{fontSize: 0.035*windowWidth}}>
                  {coache.about || 'No About'}
                </Text>
             </View>
             <View style={{marginTop:(2*windowHeight)/100,flexDirection:'row'}}>
                <TouchableOpacity
                onPress={this.openModal}
                 style={{width:'50%',backgroundColor:'black',padding:5,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize: 0.03*windowWidth,color:'white'}}>
                    Add Review
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>this.viewContent()}
                 style={{width:'50%',backgroundColor:'#ffa726',padding:5,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize: 0.03*windowWidth,color:'black'}}>
                    View Content
                  </Text>
                </TouchableOpacity>
             </View>
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
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
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

export default AuthorScreen;