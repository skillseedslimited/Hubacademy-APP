import React from 'react';
import { StyleSheet, Text, View, TextInput,StatusBar, ScrollView, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon,Divider,Button } from 'react-native-elements'
import Toast from "react-native-simple-toast";
import Modal from "react-native-modal";
import uuid from 'uuid/v1';
import moment from "moment";









class DiaryScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      note:[],
      diary:'',
      isModalVisible:false,
      height: 0,
      userId:'',
      title:'Add a note to your diary',
      edit: false,
      activeId: null
    }
    this.props.navigation.addListener(
          'didFocus',
          payload => {
            this.loadDiary()
          }
    );
  }

  openNewModal = () => {
    this.setState({ 
      isModalVisible: true,
      diary:'',
      title:'Add a note to your diary',
      edit: false
    });
  };

  closeModal = () => {
    this.setState({ 
      isModalVisible: false,
      diary:'',
    });
  };


  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     headerRight: () => (
  //       <View style={{ paddingHorizontal: 20 }}>
  //           <TouchableOpacity onPress={() => navigation.navigate('addDiary')}>
  //           <Icon name='add' size={25} color="black" />
  //         </TouchableOpacity>
  //       </View>
  //     ),
  //   };
  // };

  componentDidMount() {
    AsyncStorage.getItem("userData")
    .then(res => {
      if (res !== null) {
        this.setState({
          userId: JSON.parse(res).id,
        });
        this.loadDiary()
      }
    })
  }


  componentWillUnmount() {
    AsyncStorage.getItem("userData")
    .then(res => {
      if (res !== null) {
        this.setState({
          userId: JSON.parse(res).id,
        });
        this.loadDiary()
      }
    })
  }

  add = async() => {
    try {
      if(this.state.diary.trim() != ''){
        let new_diary =  {
          id: uuid(),
          note: this.state.diary,
          createdAt:  moment(Date.now()).format("DD/MM/YYYY")
        }
       
        let diarys = await AsyncStorage.getItem('diary'+this.state.userId);

        if (diarys !== null) {
            //update item to array
            diarys = JSON.parse(diarys);
            diarys.push(new_diary)
            await AsyncStorage.setItem('diary'+this.state.userId, JSON.stringify(diarys));
        } else {
            //add new item to array
            const new_diarys = [new_diary]
            await AsyncStorage.setItem('diary'+this.state.userId, JSON.stringify(new_diarys));
            diarys = new_diarys;
        }
        this.setState({
          note: diarys,
          diary:'',
          isModalVisible:false
        })
        console.log(this.state.note)
        Toast.show('Diary added successfully');
      }
    } catch (error) {
      console.log(err.message)
      Toast.show(error.message);
    }
  }



  loadDiary = async () => {
    try {
      const allItems = await AsyncStorage.getItem('diary'+this.state.userId);
      if (allItems){
          let filetred_notes = JSON.parse(allItems).filter(
              item=> {
                  return  item != null }
          )
          filetred_notes = filetred_notes.filter(
              item=> {
                  return  item != undefined }
          )
          this.setState({
            note: filetred_notes || []
          })
      }else{
        this.setState({
          note: []
        })
      }
      console.log(this.state.note)
    } catch (err) {
      console.log(err.message)
      return Toast.show(err.message);
    }
};


getDiary = (id,note) => {
  this.setState({
    isModalVisible:true,
    title: 'Edit your note',
    diary: note,
    edit: true,
    activeId: id
  })
};

delete = (id) => {
  Alert.alert(
    ' Delete Note! ',
    ' Do you want to delete this node?',
    [
      { text: 'Yes', onPress: () => this.delNote(id) },
      { text: 'No', onPress: () => console.log('NO Pressed') }
    ],
    { cancelable: false },
  );
};

delNote = async (id) => {
  try {
    const allItems = await AsyncStorage.getItem('diary'+this.state.userId);
    if (allItems){
          let filetred_notes = JSON.parse(allItems).filter(
              item=> {
                  return  item != null }
          )

          filetred_notes = filetred_notes.filter(
              item=> {
                  return  item.id != id }
          )

         
          await AsyncStorage.setItem('diary'+this.state.userId, JSON.stringify(filetred_notes));
          Toast.show("Note Deeleted")
          this.setState({
            note:filetred_notes || []
          })

      }
  } catch (err) {
    console.log(err.message)
    return Toast.show(err.message);
  }
};

save = async () => {
  if(this.state.diary.trim() != ''){
  try {
    const allItems = await AsyncStorage.getItem('diary'+this.state.userId);
    if (allItems){
          let filetred_notes = JSON.parse(allItems).filter(
              item=> {
                  return  item != null }
          )

          filetred_notes = filetred_notes.filter(
              item=> {
                  return  item != undefined }
          )

          filetred_notes = filetred_notes.filter(
              item=> {
                  return item.note !== undefined }
          )

          filetred_notes.map(
              item=> {
                  if(item.id === this.state.activeId){
                        item.note = this.state.diary
                        item.createdAt =moment(Date.now()).format("DD/MM/YYYY")
                  }
              }
          )
          await AsyncStorage.setItem('diary'+this.state.userId, JSON.stringify(filetred_notes));
          Toast.show("Note Updated")
          this.setState({
            isModalVisible:false,
            note:filetred_notes || []
          })

      }
  } catch (err) {
    console.log(err.message)
    return Toast.show(err.message);
  }
}
};




 
  render() {
    const{note,diary,title,edit} = this.state;
    if(note.length == 0){
      return(
        <View style={styles.loader}> 
          <Text style={{color:'gray'}}>
              No Note
          </Text>
          <TouchableOpacity 
         onPress={this.openNewModal}
            style={styles.fab}
          >
          <Icon name="ios-document" type='ionicon' size={30} color="white" />
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalVisible}
        backdropOpacity={0}
        useNativeDriver={true}
        animationInTiming={300}
        animationOutTiming={300}
        // onBackdropPress={() => this.setState({ isModalVisible: false })}
        style={{justifyContent:'flex-end',margin: 0}}>
          <View style={{ backgroundColor: 'white',height:'70%',borderTopLeftRadius:20,borderTopRightRadius:20,borderColor: 'rgba(0, 0, 0, 0.1)',}}>
            <View style={{flex:1}}>
              <View style={{flex:1,justifyContent:'space-between',flexDirection:'row',paddingHorizontal:30,paddingTop:10}}>
                  <Text style={{fontSize:18}}>{title}</Text>
                  <TouchableOpacity
                  onPress={this.closeModal}>
                      <Icon name="close" color="#ffa726" size={28} />
                  </TouchableOpacity>
              </View>
              <View style={{flex:8,paddingHorizontal:30,marginBottom:10}}>

                  <TextInput 
                  multiline={true}
                  placeholder="Your Note Here"
                  value={diary}
                  onChangeText={(val)=> this.setState({
                    diary: val
                  })}
                  style={{...styles.inputAndroid,height:150,borderBottomWidth:1,borderBottomColor:'#ffa726',justifyContent:'flex-start',alignItems:'flex-start'}}
                  />
                  {/* <TextInput
                    multiline={true}
                    onChangeText={(diary) => {
                        this.setState({ diary })
                    }}
                    onContentSizeChange={(event) => {
                        this.setState({ height: event.nativeEvent.contentSize.height })
                    }}
                    style={{...styles.inputAndroid,height:150,borderBottomWidth:1,borderBottomColor:'#ffa726',justifyContent:'flex-start',alignItems:'flex-start',height: Math.max(35, this.state.height)}}
                    value={this.state.text}
                  /> */}
              </View>
              <View style={{flex:1,flexDirection:'row',paddingHorizontal:30,paddingVertical:20}}>
                <View style={{flex:1}}>
                  <Button
                    onPress={this.closeModal}
                    title="Cancel"
                    type="outline"
                    buttonStyle={{borderColor:'#ffa726'}}
                    titleStyle={{color:'#ffa726'}}
                  />
                </View>
                <View style={{flex:1}}>
                  {edit ? (
                    <Button
                    onPress={this.save}
                    title="Save"
                    type="solid"
                    buttonStyle={{backgroundColor:'#ffa726'}}
                  />
                  ): (
                    <Button
                    onPress={this.add}
                    title="Add"
                    type="solid"
                    buttonStyle={{backgroundColor:'#ffa726'}}
                  />
                  )}
                </View>
              </View>
            </View>
          </View>
        </Modal>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <ScrollView style={{...styles.container,paddingHorizontal:10}}>
          <Text style={{padding:5,color:'#bf360c'}}>Long press to delete note.</Text>
        {note.map((item, i) => (
          <TouchableOpacity 
          onLongPress={() => this.delete(item.id)}
          onPress={() => this.getDiary(item.id,item.note)}
          key={item.id} style={{width:'100%',minHeight:50, backgroundColor:'#ffcc80',marginBottom:10,marginTop:5,borderRadius:10}}>
            <View style={{flex:1}}>
              <View style={{flex:2,marginHorizontal:10,marginVertical:10}}>
                  {item.note.lenght > 200 ?
                  (
                    <Text style={{fontSize:14,paddingHorizontal:15}}>
                    {item.note.slice(0,200)+ '...'}
                  </Text>
                  ):(
                    <Text style={{fontSize:14,paddingHorizontal:15}}>
                    {item.note}
                  </Text>
                  )}
              </View>
              <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',marginHorizontal:10,marginVertical:10}}>
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                  <Icon name='clock' type='evilicon'  size={25} color="#bf360c" />
                  <Text style={{color:'#bf360c'}}>
                    {item.createdAt}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )
        )}     
      </ScrollView>
        
        <TouchableOpacity 
         onPress={this.openNewModal}
            style={styles.fab}
          >
          <Icon name="ios-document" type='ionicon' size={30} color="white" />
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalVisible}
        backdropOpacity={0}
        useNativeDriver={true}
        animationInTiming={300}
        animationOutTiming={300}
        hideModalContentWhileAnimating
        // onBackdropPress={() => this.setState({ isModalVisible: false })}
        style={{justifyContent:'flex-end',margin: 0}}>
          <View style={{ backgroundColor: 'white',height:'70%',borderTopLeftRadius:20,borderTopRightRadius:20,borderColor: 'rgba(0, 0, 0, 0.1)',}}>
            <View style={{flex:1}}>
              <View style={{flex:1,justifyContent:'space-between',flexDirection:'row',paddingHorizontal:30,paddingTop:10}}>
                  <Text style={{fontSize:18}}>{title}</Text>
                  <TouchableOpacity
                  onPress={this.closeModal}>
                      <Icon name="close" color="#ffa726" size={28} />
                  </TouchableOpacity>
              </View>
              <View style={{flex:8,paddingHorizontal:30,marginBottom:10}}>

                  <TextInput 
                  multiline={true}
                  placeholder="Your Note Here"
                  value={diary}
                  onChangeText={(val)=> this.setState({
                    diary: val
                  })}
                  style={{...styles.inputAndroid,height:150,borderBottomWidth:1,borderBottomColor:'#ffa726',justifyContent:'flex-start',alignItems:'flex-start'}}
                  />
                  {/* <TextInput
                    multiline={true}
                    onChangeText={(diary) => {
                        this.setState({ diary })
                    }}
                    onContentSizeChange={(event) => {
                        this.setState({ height: event.nativeEvent.contentSize.height })
                    }}
                    style={{...styles.inputAndroid,height:150,borderBottomWidth:1,borderBottomColor:'#ffa726',justifyContent:'flex-start',alignItems:'flex-start',height: Math.max(35, this.state.height)}}
                    value={this.state.text}
                  /> */}
              </View>
              <View style={{flex:1,flexDirection:'row',paddingHorizontal:30,paddingVertical:20}}>
                <View style={{flex:1}}>
                  <Button
                    onPress={this.closeModal}
                    title="Cancel"
                    type="outline"
                    buttonStyle={{borderColor:'#ffa726'}}
                    titleStyle={{color:'#ffa726'}}
                  />
                </View>
                <View style={{flex:1}}>
                  {edit ? (
                    <Button
                    onPress={this.save}
                    title="Save"
                    type="solid"
                    buttonStyle={{backgroundColor:'#ffa726'}}
                  />
                  ): (
                    <Button
                    onPress={this.add}
                    title="Add"
                    type="solid"
                    buttonStyle={{backgroundColor:'#ffa726'}}
                  />
                  )}
                </View>
              </View>
            </View>
          </View>
        </Modal>
       
      </View>
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
});

export default DiaryScreen;