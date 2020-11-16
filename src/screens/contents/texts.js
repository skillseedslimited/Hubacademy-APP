import React from 'react';
import { StyleSheet, Text, View, Alert, FlatList,StatusBar, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon,Divider } from 'react-native-elements'
import moment from "moment";






class TextsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      texts:[],
      loading: true
    }
  }

  componentDidMount() {
    this.getVideos()
    console.log(this.props.navigation.state.params.id)
  }


  getVideos = async () => {
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/content/list?owner_id="+this.props.navigation.state.params.id+"&type_id=7",{
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
                texts:res.data,
                loading:false
              })
            }else{
              this.setState({
                texts:[],
                loading:false
              })
            }
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }

  
 

  

  componentWillUnmount() {
  
  }




 
  render() {
    const{texts,loading} = this.state
    if(loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#bf360c"/>
        </View>
    )}
    if(texts.length == 0){
      return(
        <View style={styles.loader}> 
          <Text style={{color:'gray'}}>
              No text content
          </Text>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        {texts.map((item, i) => (
          <View key={item.id} style={{width:'100%',minHeight:100, backgroundColor:'#eceff1',marginTop:10,borderRadius:10}}>
            <View style={{flex:1}}>
              <View style={{flex:1}}>
                  <Text style={{fontSize:16,padding:10}}>
                    {item.title}
                  </Text>
              </View>
              <View style={{flex:3}}>
                  <Text style={{fontSize:14,paddingHorizontal:15}}>
                    {item.description} 
                  </Text>
              </View>
              <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',marginHorizontal:10,marginVertical:10}}>
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                  <Icon name='clock' type='evilicon'  size={25} color="#bf360c" />
                  <Text style={{color:'#bf360c'}}>
                    {moment(item.createdAt, "YYYYMMDD").fromNow()}
                  </Text>
                </View>
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                  <Icon name='like' type='evilicon'  size={25} color="#bf360c" />
                  <Text style={{color:'#bf360c'}}>
                    {item.like_count}
                  </Text>
                </View>
              </View>
            </View>
          </View>
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
    paddingHorizontal:10,
    paddingVertical:10
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

export default TextsScreen;