import React, { Component,useState, useEffect} from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  ListView,
  Image,
  StyleSheet
} from 'react-native'
import { Icon } from 'react-native-elements'
import Modal from "react-native-modal";

const DropDown = ({ navigation, icon, name, screenName }) => {

  const [modalVisible,setModalVisible] = useState(false)

  const onOption = () => {
    setModalVisible(!modalVisible)
  }

  return(
    <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity
           onPress={onOption}
           style={{padding:20}}
       >
          <Icon name='ellipsis-v' type="font-awesome"  size={23} color="black" />
        </TouchableOpacity>
        <Modal
        onBackdropPress={() => setModalVisible(false)}
          transparent={true}
          visible={modalVisible}>
          <View style={styles.modalContainer}>
           <View style={styles.sideModalContainer}>
             <TouchableOpacity style={styles.optionContainer}>
               <Text style={styles.optionText}>View Profile</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.optionContainer}>
               <Text style={styles.optionText}>Subscribe</Text>
             </TouchableOpacity>
            </View> 
          </View>
        </Modal>
      </View>

  )

}
  


const styles = StyleSheet.create({
modalContainer : {
  backgroundColor : '#00000000', //transparent color
  alignItems : 'flex-end',
  paddingTop : 8,
  paddingRight:6,
  position:'absolute',
  top: 10,
  right:10

},
sideModalContainer : {
  paddingVertical : 4,
  paddingLeft : 10,
  paddingRight : 50,
  backgroundColor : 'white',
  borderRadius : 4,
  borderRadius : 4,
  elevation : 2,
},
optionContainer : {
 padding : 10
},
})

export default DropDown
