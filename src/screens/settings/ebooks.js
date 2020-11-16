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



class EbooksScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      ebooks:[],
      loading: true,
      isModalVisible: false,
      ebook:'',
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
        fetch(setup.endPoint+"/content/list?type_id=4&free=yes",{
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
      ebook:item.content_media.url,
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
          <ActivityIndicator size="large" color="#ff9800"/>
        </View>
    )}
    if(ebooks.length == 0){
      return(
        <View style={styles.loader}> 
          <Text style={{color:'gray'}}>
              No ebook content
          </Text>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
             {ebooks.map((item, i) => (
            <TouchableOpacity 
            onPress={() => this.openNewModal(item)}
            key={item.id} style={{width:'100%',borderBottomWidth:1,borderBottomColor:'#bdbdbd',paddingHorizontal:10}}>
            <View style={{flex:1,flexDirection:'row'}}>
              <View style={{flex:1,justifyContent:'center'}}>
                  <Image  style={{width:40,height:80}} resizeMode='contain'  source={require('../../asset/ebook.png')}/>
              </View>
              <View style={{flex:4,justifyContent:'center',paddingHorizontal:5}}>
                    <Text style={{fontSize:0.03*windowWidth}}>
                        {item.title}
                    </Text>
                    <Text style={{color:'#bf360c',fontSize:0.03*windowWidth}}>
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
        // onBackdropPress={() => this.setState({ isModalVisible: false })}
        style={{justifyContent:'flex-end',margin: 0}}>
          <View style={{ backgroundColor: '#fff3e0',height:'100%',borderColor: 'rgba(0, 0, 0, 0.1)',}}>
            <View style={{flex:1}}>
              <View style={{position:'absolute',zIndex:99,justifyContent:'space-between',flexDirection:'row',paddingHorizontal:30,paddingTop:10}}>
                  <TouchableOpacity
                  onPress={this.closeModal}>
                      <Icon name="close" color="#ffa726" size={28} />
                  </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
              <WebView source={{ uri: setup.baseUrl+'/ebook/'+ebook }} />
              </View>
            </View>
          </View>
        </Modal>
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
});

export default EbooksScreen;