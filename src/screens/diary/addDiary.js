import React from 'react';
import { StyleSheet, Text, View, Alert,TextInput, FlatList,StatusBar, ScrollView, BackHandler, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import setup from  '../../setup';
import { Icon } from 'react-native-elements'
import Toast from "react-native-simple-toast";
import uuid from 'uuid/v1';





class DiaryScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      note:"",
      title:'Add a note to your diary'
    }
  }

  componentDidMount() {
      this.EnterScreen();
  }

  
 

  

  componentWillUnmount() {
  
  }

  addNote = async()  =>{
    if(this.state.title === "Add a note to your diary") {
        try {
            if(this.state.note.trim() === '' || this.state.note.length < 5){
              return Toast.show('Note to short');
            }
            const id = uuid();
            const journal_entry = {
                [id]: {
                    id,
                    text: this.state.note,
                    createdAt: Date.now()
                }
            }

            let diary = await AsyncStorage.getItem('huba_diary');
            if (diary !== null) {
                diary = JSON.parse(diary);
                diary.push(journal_entry)
            } else {
                diary = [journal_entry];
            }
            await AsyncStorage.setItem('huba_diary', JSON.stringify(diary));
            Toast.show('Journal Saved');
            // this.setState({
            //   note:""
            // })
        } catch (error) {
          Toast.show(error.message);
        }
    }else{

            try {
                const allItems = await AsyncStorage.getItem('huba_diary');

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
                            let current_obj = Object.keys(item)
                            return item[current_obj].text !== undefined }
                    )

                    filetred_notes.map(
                        item=> {
                            let current_obj = Object.keys(item)
                            if(current_obj[0] === this.props.navigation.state.params.id){
                                let current_obj = Object.keys(item)
                                  item[current_obj].text = note
                                  item[current_obj].createdAt = Date.now()
                            }
                        }
                    )


                    await AsyncStorage.setItem('huba_diary', JSON.stringify(filetred_notes));
                    Toast.show("Note Updated")

                }else{
                  // this.setState({
                  //   note:""
                  // })
                }

            } catch (err) {
              return Toast.show(err.message);
            }
        }
}

EnterScreen = async()=>{
        if(this.props.navigation.state.params !== undefined ){
            this.setState({
              title:'Edit your note'
            })
            try {
                const allItems = await AsyncStorage.getItem('huba_diary');

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
                            let current_obj = Object.keys(item)
                            return item[current_obj].text !== undefined }
                    )

                    const transformed_note = filetred_notes.map(
                        item=> {
                            let current_obj = Object.keys(item)
                             if(current_obj[0] === this.props.navigation.state.params.id){
                                 let current_obj = Object.keys(item)
                                 return {
                                     id:current_obj[0],
                                     text: item[current_obj].text ,
                                     createdAt: item[current_obj].createdAt
                                 }
                             }
                        }
                    )

                    this.setState({
                     note: transformed_note[0].text || ""
                    })


                }else{
                  this.setState({
                    note: ""
                   })
                }

            } catch (err) {
              return Toast.show(err.message);
            }
        }
  
}




 
  render() {
    const{note,title} = this.state;
    return (
      <ScrollView style={{flex:1,backgroundColor:'#eceff1'}}>
      <View style={styles.container}>
        <StatusBar  backgroundColor="#fff3e0" barStyle="dark-content" />
            <Text style={{fontSize:20}}>{title}</Text>
        <TextInput 
              multiline={true}
              placeholder="Your Note Here"
              value={note}
              onChangeText={(val)=> this.setState({
                note: val
              })}
              style={{...styles.inputAndroid,height:200}}
         />
        
        
      </View>
      <TouchableOpacity 
      onPress={()=>this.addNote()}
            style={styles.fab}
          >
            <Icon name="ios-save" type='ionicon' size={30} color="white" />
          </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height:"100%",
    backgroundColor: '#eceff1',
    paddingHorizontal: '5%',
    paddingTop: '6%'
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    marginTop: 8,
    marginBottom: 15,
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
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
    bottom: 0, 
    backgroundColor: '#ffa726', 
    borderRadius: 30, 
    elevation: 8 
  }, 
  fabIcon: { 
    fontSize: 40, 
    color: 'white' 
  }
});

export default DiaryScreen;