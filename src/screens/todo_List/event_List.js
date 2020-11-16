import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button,StatusBar, ScrollView, BackHandler, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon,Divider } from 'react-native-elements';
import uuid from 'uuid/v1';
import Modal from "react-native-modal";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import Toast from "react-native-simple-toast";
import firebase from 'react-native-firebase';
import notification from "../../notification";
import type { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';




class EventListScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      isModalVisible: false,
      item_name:"",
      item_tasks:[],
      tasks:'',
      date: new Date(),
      time: new Date(),
      rdate:'',
      rtime:'',
      mode: 'date',
      show: false,
    }
  }

  

  setDate = (event, date) => {
    if(this.state.mode == 'date'){
      date = date || this.state.date;
      let rdate = moment(date.getTime()).format('ll');
      this.setState({
        show: Platform.OS === 'ios' ? true : false,
        date,
        rdate,
      });
    }else{
      date = date || this.state.time;
      let rtime = moment(date.getTime()).format('LT');
      this.setState({
        show: Platform.OS === 'ios' ? true : false,
        time: date,
        rtime,
      });
    }
  }

  show = mode => {
    this.setState({
      show: true,
      mode,
    });
  }

  showDatepicker = () => {
    this.show('date');
  }

  showTimepicker = () => {
    this.show('time');
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };


  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: () => (
        <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={navigation.state.params.openModel}>
            <Icon name='add' size={25} color="black" />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  componentDidMount() {
    this.loadTasks();
    this.props.navigation.setParams({
        openModel: this.toggleModal
    });
  }

  add = async() => {
    try {
      if(this.state.tasks.trim() != '' || this.state.rdate || this.state.rtime){
       
        // let array = [
        //   ...this.state.item_tasks,
        //   new_task
        // ]
      
        let todo_list = await AsyncStorage.getItem('todo_list');

            if (todo_list){
              let filtered_notes = JSON.parse(todo_list).filter(
                  item=> {
                      return  item != null }
              )

              filtered_notes = filtered_notes.filter(
                  item=> {
                      return  item != undefined }
              )

              let new_task =  {
                id: uuid(),
                status: 'pending',
                text: this.state.tasks,
                time: this.state.time,
                createdAt: Date.now()
              }

              filtered_notes.map(
                  item=> {
                      if(item.id=== this.props.navigation.state.params.id){
                          if (item.tasks) {
                              item.tasks.push(new_task);
                          }else{
                              item.tasks = [new_task]
                          }
                      }
                  }
              )

              await AsyncStorage.setItem('todo_list', JSON.stringify(filtered_notes));
              const current_task = filtered_notes.find(item=>item.id === this.props.navigation.state.params.id)
              this.setState({
                item_tasks: current_task.tasks
              })
              this.toggleModal()
              // console.log('date '+ this.state.time)
              // console.log('date 2 '+ new Date(this.state.time).getTime())
              const notifiy = notification.onMessage({
                id: new_task.id,
                title:'Reminder - '+this.state.item_name,
                body: new_task.text,
                type:'todo',
              })
          
              firebase
              .notifications()
              .scheduleNotification(notifiy, {
                  fireDate: new Date(this.state.time).getTime(),
                  repeatInterval: 'day',
                  exact: true
              })
              .catch(err => console.error('scheduleNotification'));
         

              return Toast.show('Task added successfully');

          }else{
              return Toast.show('Error Creating task');
          }
      }
    } catch (error) {
      return Toast.show(error.message);
      // setToast(true);
    }
  }


loadTasks = async () => {
  if(this.props.navigation.state.params !== undefined ){
    try {
        const allItems = await AsyncStorage.getItem('todo_list');

        if (allItems){
            let filtered_tasks = JSON.parse(allItems).filter(
                item=> {
                    return  item != null }
            )

            filtered_tasks = filtered_tasks.filter(
                item=> {
                    return  item != undefined }
            )

            const transformed_note = filtered_tasks.find(
                item=> item.id=== this.props.navigation.state.params.id
            )
            this.setState({
              item_name: transformed_note.name || "",
              item_tasks: transformed_note.tasks || [],
            })
         
        }
    } catch (err) {
      Alert.alert(error.message)
    }
}  
};

  componentWillUnmount() {
    this.loadTasks();
  }

  momentTine = (d1,d2) =>{
    const t1 = moment(d1).calendar();
    const t2 = moment(d2).format('lll'); 
    return(
      <Text style={{color: "#bf360c",fontSize:12}}>
          {t1} / {t2}
      </Text>
    )
  }




 
  render() {
    const {item_name, item_tasks,isModalVisible,show, date, rdate, rtime, mode} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar  backgroundColor="#eceff1" barStyle="dark-content" />
        <View style={{width:'100%',paddingTop:15,paddingBottom:15,paddingHorizontal:20}}>
          <View style={{flexDirection: "row",alignItems: "center"}}>
                <Icon name='alarm' size={25} color="#f57c00" />
                <Text style={{color: "#f57c00",fontSize:18,marginLeft:10}}>
                  {item_name}
                </Text>
            </View>
        </View>
        {isModalVisible ? 
          <ScrollView style={styles.scroll}>
                <Text style={{fontSize:15}}>Add Task to your To-do list</Text>
                <TextInput 
                      multiline={true}
                      placeholder=""
                      onChangeText={ TextInputValue =>
                        this.setState({tasks : TextInputValue }) }
                      style={{...styles.inputAndroid}}
                />
                <Text style={{fontSize:15}}>Tasks Date</Text>
                <TouchableOpacity 
                   onPress={this.showDatepicker}
                    style={{...styles.inputAndroid,height:30}}
                >
                    <Text style={{fontSize:16}}>{rdate}</Text>
                </TouchableOpacity>
                <Text style={{fontSize:15}}>Tasks Time</Text>

                <TouchableOpacity 
                   onPress={this.showTimepicker}
                    style={{...styles.inputAndroid,height:30}}
                >
                    <Text style={{fontSize:16}}>{rtime}</Text>
                </TouchableOpacity>
                { show && <DateTimePicker value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={this.setDate} />
                }
                 <TouchableOpacity 
                    onPress={this.add}
                    style={styles.fab}
                  >
                    <Icon name="ios-save" type='ionicon' size={20} color="white" />
                  </TouchableOpacity>
          </ScrollView>:
           <ScrollView style={styles.scroll}> 
           {item_tasks.map((task, i) => (
             <TouchableOpacity 
             // onPress={()=> this.props.navigation.navigate('todo_event', {id:todo.id})}
             key={i} style={{width:'100%',backgroundColor:'#ffcc80', padding:20,borderRadius:15,marginVertical:10}}>
                    <Text style={{fontSize:16}}>{task.text}</Text>
                   <Divider style={{ backgroundColor: '#bf360c',marginVertical:10 }} />
                   <View style={{flexDirection: "row",alignItems: "center"}}>
                       {this.momentTine(task.createdAt,task.time)}
                   </View>
             </TouchableOpacity>
           )
           )}
           </ScrollView>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eceff1',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  scroll: {
    flex: 1,
    paddingHorizontal: '5%',
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
    bottom: 5, 
    backgroundColor: '#ffa726', 
    borderRadius: 30, 
    elevation: 8 
  }, 
  fabIcon: { 
    fontSize: 40, 
    color: 'white' 
  }
});

export default EventListScreen;