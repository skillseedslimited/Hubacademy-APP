import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, FlatList,StatusBar, ScrollView, BackHandler, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon,Divider } from 'react-native-elements';
import uuid from 'uuid/v1';






class Todo_ListScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      item:"",
      list:[]
    }
   
  }

  componentDidMount() {
    this.loadTasks();
  }

  add = async() => {
    try {
      if(this.state.item.trim() != ''){
        let new_todo =  {
          id: uuid(),
          name:this.state.item,
          tasks: null,
        }
        let array = [
          ...this.state.list,
          new_todo
        ]
      
        let todo_list = await AsyncStorage.getItem('todo_list');

        if (todo_list !== null) {
            //update item to array
            todo_list = JSON.parse(todo_list);
            todo_list.push(new_todo)
            await AsyncStorage.setItem('todo_list', JSON.stringify(todo_list));
        } else {
            //add new item to array
            const new_todo_list = [new_todo]
            await AsyncStorage.setItem('todo_list',JSON.stringify(new_todo_list));
            todo_list = new_todo_list;
        }
        this.setState({
          list: todo_list
        })
        this.setState({
          item: ''
        })
      }
    } catch (error) {
      Alert.alert(error.message)
      // setToast(true);
    }
  }


  loadTasks = async () => {

    try {
        const allItems = await AsyncStorage.getItem('todo_list');
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
              list: filetred_notes || []
            })
        }else{
          this.setState({
            list: []
          })
        }

    } catch (err) {
        Alert.alert(err.message)
        // setToast(true);
    }
};

  componentWillUnmount() {
    this.loadTasks();
  }




 
  render() {
    const {item, list} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar  backgroundColor="#eceff1" barStyle="dark-content" />
        <View style={{width:'100%',paddingTop:10,paddingBottom:2,paddingHorizontal:20}}>
          <TextInput 
                placeholder="Add Category"
                value={item}
                onChangeText={ TextInputValue =>
                  this.setState({item : TextInputValue }) }
                style={{...styles.inputAndroid}}
          />
           <TouchableOpacity 
            onPress={this.add}
            style={styles.fab}
          >
            <Icon name="ios-save" type='ionicon' size={20} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scroll}> 
        {list.map((todo, i) => (
          <TouchableOpacity 
          onPress={()=> this.props.navigation.navigate('todo_event', {id:todo.id})}
          key={i} style={{width:'100%',backgroundColor:'#ffcc80', padding:20,borderRadius:15,marginVertical:10}}>
              <Text style={{fontSize:14}}>{todo.name}</Text>
          </TouchableOpacity>
        )
        )}
              
        </ScrollView>
        
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
    marginBottom: 10,
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
    width: 36, 
    height: 36, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 20, 
    bottom: 15, 
    backgroundColor: '#ffa726', 
    borderRadius: 30, 
    elevation: 8 
  }, 
  fabIcon: { 
    fontSize: 40, 
    color: 'white' 
  }
});

export default Todo_ListScreen;