import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  ListView,
  Dimensions,
  Image,
  StyleSheet
} from 'react-native'
import { Icon } from 'react-native-elements'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const DrawerItem = ({ navigation, icon, name, screenName }) =>
  <TouchableOpacity activeOpacity={.8}
    style={styles.menuItem}
    onPress={() => {
      navigation.closeDrawer()
      return navigation.navigate(`${screenName}`)
    } }
  >
    {/* <Icon name ={icon} type='font-awesome' size={25} color="black" style={{margin:5}} /> */}
    <Text style={styles.menuItemText}>{name}</Text>
  </TouchableOpacity>


const styles = StyleSheet.create({
  menuItem: {
    paddingHorizontal: 40
  },
  menuItemText: {
    fontSize:0.035*windowWidth,
    margin:14,
  }
})

export default DrawerItem
