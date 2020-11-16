import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions,StatusBar, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import moment from "moment";
import Modal from "react-native-modal";
import { Icon,Divider,Button } from 'react-native-elements';
import { WebView } from 'react-native-webview';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const chatUsers = [
  {
      id: 2,
      name: "React native tutorial - By Emibrown",
      avatar: "http://tiny.cc/women2",
      chatId: 11,
      isOnline : true,
  },
  {
      id: 1,
      name: "What is life all about - By Jaja",
      avatar: "http://tiny.cc/women4",
      chatId: 10,
      isOnline : true,
  },
  {
      id: 3,
      name: "What if the world was one - By Emibrown",
      avatar: "http://tiny.cc/men1",
      chatId: 12,
      isOnline : false,
  },
  {
      id: 4,
      name: "Last Days - By Aya",
      avatar: "http://tiny.cc/men3",
      chatId: 13,
      isOnline : true,
  },
]




class StoreEbooksScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      ebooks:[],
      loading: false,
      isModalVisible: false,
      ebook:'',
    }
  }

  componentDidMount() {
    this.getEbooks()
  }


  getEbooks = async () => {
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/store/list?type_id=4",{
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
                ebooks:res.data,
                loading:false
              })
            }else{
              this.setState({
                ebooks:[],
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
      ebook:item.content_type.media.url,
    });
  };

  closeModal = () => {
 
    this.setState({ 
      isModalVisible: false,
      ebook:'',
    });
    
  };



  
 

  

  componentWillUnmount() {
  
  }




 
  render() {
    const{ebooks,loading,ebook} = this.state
    if(loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#eceff1"/>
        </View>
    )}
    return (
      <ScrollView style={styles.container}>
          {
        ebooks.length == 0 ? (
          <View>
            <TouchableOpacity
            onPress={this.getCoaches}>
              <Text style={{fontSize: 0.035*windowWidth}}>
                No Ebook content in the store check back later. 
              </Text>
            </TouchableOpacity>
          </View>
        ): null
      }
             {ebooks.map((item, i) => (
            <TouchableOpacity 
            key={item.id} style={{width:'100%',borderBottomWidth:1,borderBottomColor:'#424242',paddingVertical:(2*windowHeight)/100,paddingHorizontal:(3*windowWidth)/100}}>
            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
              <View style={{justifyContent:'center'}}>
                <Image  style={{width:(9*windowWidth)/100, height:(9*windowHeight)/100}} resizeMode='contain'  source={require('../../asset/ebook.png')}/>
              </View>
              <View style={{justifyContent:'center',paddingLeft:(3*windowWidth)/100}}>
                <Text style={{fontSize:0.035*windowWidth}}>
                {item.title} - {item.owner.fullname}
                </Text>
                <Text style={{color:'#bf360c',fontSize:0.03*windowWidth}}>
                  Price: {item.currency}{item.price}    {moment(item.createdAt, "YYYYMMDD").fromNow()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )
        )}    
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eceff1',
    paddingHorizontal:(2*windowWidth)/100,
    paddingVertical:(1*windowWidth)/100
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
});

export default StoreEbooksScreen;