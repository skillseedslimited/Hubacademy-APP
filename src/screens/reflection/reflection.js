import React from 'react';
import { StyleSheet, Text, View, Dimensions,FlatList,StatusBar, SafeAreaView, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon,Divider } from 'react-native-elements'
import { onSignOut } from "../../auth";


const  month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



class ReflectionScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      reflections:[],
      loading:true
    }
   
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

  componentDidMount() {
    this.getReflections()
  }

  
 

  

  componentWillUnmount() {
  
  }

  getReflections = async () => {
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/reflection/list",{
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
                  reflections:res.data,
                  loading:false
                })
            }else{
              onSignOut().then(() => this.props.navigation.navigate('SignedOut'))
            }
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }

  fDate = (d1) =>{
    const d = new Date(d1);
    const month = month_names_short[d.getMonth()]
    const day = d.getDate()
    return(
     <View style={{alignItems:'center'}}>
        <Text style={{fontSize:0.02*windowHeight,color:'white'}}>
          {day}
        </Text>
        <Text style={{fontSize:0.02*windowHeight,color:'white'}}>
          {month}
        </Text>
     </View>
    )
  }





 
  render() {
    const{reflections,loading} = this.state
    if(loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#bf360c"/>
        </View>
    )}
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
        data={reflections}
        renderItem={({item}) => (
          <TouchableOpacity 
          onPress={()=> this.props.navigation.navigate('ReflectionD',{id:item.id})}
          key={item.id} style={{width:'100%',height:(10*windowHeight)/100,borderBottomWidth:1,borderBottomColor:'#bdbdbd',paddingHorizontal:(2*windowWidth)/100,paddingVertical:(1*windowHeight)/100}}>
          <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <View style={{flex:1}}>
                <ImageBackground
                  source={{uri:setup.baseUrl+'/images/'+item.image_link}}
                  style={{width: '100%', height:'100%', alignItems:'center'}}
                  imageStyle={{
                    resizeMode: 'cover',
                    alignSelf: 'auto'
                  }}>
                  <View
                style={{width: '100%', height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0, 0, 0, 0.7)'}}
                >
              {this.fDate(item.date)}
                </View>
                </ImageBackground>
            </View>
            <View style={{flex:2,justifyContent:'center',paddingHorizontal:(2*windowWidth)/100}}>
                  <Text numberOfLines={2} style={{fontSize:0.04*windowWidth}}>
                    {item.title}
                  </Text>
                  <Text style={{fontSize:0.03*windowWidth,marginTop:3,color:'#9e9e9e'}}>
                    {item.date}
                  </Text>
            </View>
          </View>
        </TouchableOpacity>
        )}
        />
      </SafeAreaView>
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

export default ReflectionScreen;