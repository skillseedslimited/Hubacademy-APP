import React from 'react';
import { StyleSheet, Dimensions,ActivityIndicator, View, ScrollView, Alert, FlatList,StatusBar, Button, BackHandler, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon } from 'react-native-elements'
import CatComponent from '../../components/CatComponent'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;




class CatScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      cat:[],
      loading:true
    }
   
  }

  componentDidMount() {
    AsyncStorage.getItem("hubCat")
    .then(res => {
      if(res != null){
        this.setState({
          loading:false,
          cat:JSON.parse(res)
        })
      }
    });
  }

  
 

  

  componentWillUnmount() {
  
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: () => (
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity>
            <Icon name='search'  size={23} color="black" />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  render() {
    const{cat,loading} = this.state;
    if(loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#fff3e0"/>
        </View>
    )}
    return (
      <ScrollView>
      <View style={{flex:1,flexWrap:"wrap", backgroundColor:'#eceff1',flexDirection:"row", paddingVertical:(1*windowHeight)/100, paddingHorizontal:(2.5*windowWidth)/100, justifyContent:"space-between"}}>
      {cat.map((item, i) => (
        <CatComponent key={item.id} navigation={this.props.navigation} screenName="CatDetails" id={item.id} name={item.name} image={setup.baseUrl+'/images/'+item.image_url} size={{height:(30*windowWidth)/100,width:(30*windowWidth)/100}}/>
      )
      )}      
        <StatusBar  backgroundColor="#eceff1" barStyle="dark-content" />
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    backgroundColor:'#eceff1',
    flexWrap:'wrap',
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

export default CatScreen;