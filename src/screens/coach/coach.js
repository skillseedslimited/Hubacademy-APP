import React from 'react';
import { StyleSheet, Text,ActivityIndicator, View, ScrollView, ImageBackground, Dimensions ,StatusBar, Animated, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon,Divider,Button } from 'react-native-elements'
import Modal from "react-native-modal";
import Select2 from "react-native-select-two"


const mockData = [
  { id: '', name: "Can be offline" },
  { id: 0, name: "Offline" },
  { id: 1, name: "Online" }
]

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;





class CoachScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      coaches:[],
      loading:true,
      isModalVisible:false,
      cat:[],
      cat_request:'',
      status_request:'',
    }
   
  }

  componentDidMount() {
    this.getCoaches();
    this.props.navigation.setParams({
      open: this.openModal
    });
    AsyncStorage.getItem("hubCat")
    .then(res => {
      if(res != null){
        this.setState({
          cat:JSON.parse(res)
        })
      }
    });
  }

  getCoaches = async () => {
    this.setState({
      loading:true
    })
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/account/user/list?role=100",{
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Authorization': 'Bearer '+token
            },
        })
        .then(response => response.json())
        .then((res)=> {
            this.setState({
              coaches:res.data,
              loading:false
            })
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }


  componentWillUnmount() {
  
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
      headerRight: () => (
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
          onPress={ () => params.open() }>
            <Icon name='search'  size={23} color="black" />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  

  openModal = () =>{
    this.setState({ isModalVisible: true });
  }

  search = async () => {
    this.setState({
      loading:true
    })
    let token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        token  = JSON.parse(token);
        fetch(setup.endPoint+"/account/user/list?category_id="+this.state.cat_request+"&online="+this.state.status_request+"&role=100",{
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Authorization': 'Bearer '+token
            },
        })
        .then(response => response.json())
        .then((res)=> {
            this.setState({
              coaches:res.data,
              loading:false
            })
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      }
  }

  render() {
    const{coaches,loading,isModalVisible,cat,cat_request,status_request} = this.state;
    if(loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#ffa726"/>
        </View>
    )}
    return (
      <ScrollView style={{flex:1,backgroundColor:'#eceff1', paddingVertical:'2%', paddingHorizontal:(4*windowWidth)/100}}>
      {
        coaches.length == 0 ? (
          <View>
            <TouchableOpacity
            onPress={this.getCoaches}>
              <Text style={{fontSize: 0.03*windowWidth}}>
                No coach matches your request. 
                  <Text style={{color:'#ffa726',fontSize: 0.03*windowWidth}}>
                    See all avaliable coaches
                  </Text>
              </Text>
            </TouchableOpacity>
          </View>
        ): null
      }
      {coaches.map((item, i) => (
        <TouchableOpacity key={item.id}
        onPress={() =>this.props.navigation.navigate(`CoachDetails`, {id:item.id} )}
        style={{width:'100%',height:(15*windowHeight)/100, borderBottomWidth:1,borderBottomColor:'#bdbdbd'}}>
          <View style={{flex:1,flexDirection:'row', alignItems:'center'}}>
          <View style={{flex:1}}>
            <ImageBackground
            source={{uri:setup.baseUrl+'/images/'+item.photo || ''}}
            imageStyle={{
            resizeMode: 'cover',
            alignSelf: 'auto',
            borderRadius:10,
            backgroundColor:'gray'
            }}
           style={{width:(12*windowWidth)/100,aspectRatio: 1}}>
           </ImageBackground>
           </View>
           <View style={{flex:3}}>
              <Text style={{fontSize: 0.04*windowWidth,marginBottom:'2%'}}>
              {item.firstname}  {item.lastname}
              </Text>
              <Text style={{color:'#616161',fontSize:0.03*windowWidth}}>
              {item.category? item.category.name : 'No category'}
              </Text>
          </View>
          <View style={{flex:1,}}>
            {
              item.online == 1 ? (
                <View style={{backgroundColor:'black',justifyContent:'center',alignItems:'center',borderRadius:5,padding:0.02*windowWidth}}>
                  <Text style={{color:'white',fontSize:0.03*windowWidth}}>
                    ONLINE
                  </Text>
                </View> 
              ) : (
                <View style={{backgroundColor:'#e0e0e0',justifyContent:'center',alignItems:'center',borderRadius:5,padding:0.02*windowWidth}}>
                  <Text style={{color:'#757575',fontSize:0.03*windowWidth}}>
                    OFFLINE
                  </Text>
                </View>
              )
            }
          </View>
          </View>
        </TouchableOpacity>
      )
      )}      
      <StatusBar  backgroundColor="#eceff1" barStyle="dark-content" />
      <Modal isVisible={isModalVisible}
       backdropOpacity={0}
       useNativeDriver={true}
       animationInTiming={300}
       animationOutTiming={300}
       hideModalContentWhileAnimating ={true}
        onBackdropPress={() => this.setState({ isModalVisible: false })}
        style={{justifyContent:'flex-end',margin: 0}}>
          <Animated.View style={{ backgroundColor: 'black',height:(40*windowHeight)/100,borderTopLeftRadius:20,borderTopRightRadius:20,borderColor: 'rgba(0, 0, 0, 0.1)',}}>
            <View style={{flex:1}}>
              <View style={{flex:1,justifyContent:'space-between',flexDirection:'row',paddingHorizontal:'5%',paddingTop:10}}>
                  <Text style={{fontSize:0.04*windowWidth,color:'white'}}>Specify Request</Text>
              </View>
              <View style={{flex:2,flexDirection:'row',justifyContent:'space-between',marginHorizontal:'7%'}}>
                  <View  style={{width:'48%',justifyContent:'center',backgroundColor:'#ffa726',borderRadius:10,alignItems:'center'}}>
                      <Text style={{fontSize: 0.04*windowWidth}}>
                        Category
                      </Text>
                      <Select2
                        isSelectSingle
                        style={{ borderRadius: 5,flexDirection:'column',justifyContent:'center',alignItems:'center',borderWidth:0 }}
                        colorTheme="#ffa726"
                        searchPlaceHolderText='Search here'
                        cancelButtonText= 'Cancel'
                        selectButtonText= 'Done'
                        listEmptyTitle= 'Category not found'
                        popupTitle="Select Category"
                        title="Select Category"
                        data={cat}
                        selectedTitleStyle={{color:'black',fontSize: 0.03*windowWidth}}
                        onSelect={cat_request => {
                          this.setState({ cat_request })
                        }}
                        onRemoveItem={cat_request => {
                          this.setState({ cat_request })
                        }}
                      />
                  </View>
                  <View  style={{width:'48%',justifyContent:'center',backgroundColor:'#ffa726',borderRadius:10,alignItems:'center'}}>
                      <Text style={{fontSize: 0.04*windowWidth}}>
                        Status
                      </Text>
                      <Select2
                        isSelectSingle
                        style={{ borderRadius: 5,flexDirection:'column',justifyContent:'center',alignItems:'center',borderWidth:0 }}
                        colorTheme="#ffa726"
                        searchPlaceHolderText='Search here'
                        cancelButtonText= 'Cancel'
                        selectButtonText= 'Done'
                        listEmptyTitle= 'Status not found'
                        popupTitle="Select status"
                        title="Select status"
                        data={mockData}
                        selectedTitleStyle={{color:'black',fontSize: 0.03*windowWidth}}
                        onSelect={status_request => {
                          this.setState({ status_request })
                        }}
                        onRemoveItem={status_request => {
                          this.setState({ status_request })
                        }}
                      />
                  </View>
              </View>
              <View style={{flex:1,flexDirection:'row',paddingHorizontal:30,paddingVertical:20}}>
                <Button
                  title="REQUEST A COACH"
                  type='solid'
                  titleStyle={{color:'black',fontSize: 0.04*windowWidth}}
                  buttonStyle={{backgroundColor:'#ffa726',borderRadius:10}}
                  containerStyle={{width:'100%',}}
                  onPress ={this.search}
                />
              </View>
            </View>
          </Animated.View>
        </Modal>
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

export default CoachScreen;