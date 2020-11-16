import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Dimensions, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { Avatar } from 'react-native-elements';

// Standard Avatar
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const ProfileComponent = ({ setup,photo,navigation,fullname, email }) =>
  <View style={{flexDirection:'row', paddingLeft:40, }}>
  	<View style ={{justifyContent:'center', alignItems:'center', margin:10, paddingTop:20}}>
		  {
			  photo?(
				<Avatar
					title={fullname[0]}
					rounded
					size="small"
					xlarge
					source={{
						uri: setup.baseUrl+'/images/'+photo,
					}}
				/>
			  ):(
				<Avatar
					title={fullname[0]}
					rounded
					size="small"
					xlarge
				/>
			  )
		  }
	
		<Text style={{fontWeight:'900', fontSize:0.045*windowWidth, color:'black'}}>{fullname}</Text>
		<Text style={{fontWeight:'900', fontSize:0.035*windowWidth, color:'black'}}>{email}</Text>
		<TouchableOpacity
		 onPress={() => {
			navigation.closeDrawer()
			return navigation.navigate(`Profile`)
		  } } 
		  activeOpacity={.7} style={{backgroundColor:'#ffa726', marginTop:15, paddingVertical:2, paddingHorizontal:20, borderRadius:10 }}>
			<Text style={{fontWeight:'900', fontSize:0.035*windowWidth, color:'black'}}>EDIT</Text>
		</TouchableOpacity>
    	{/* <Text style={{fontWeight:'200', color:'white'}}>{email}</Text> */}
  	</View>
  </View>


export default ProfileComponent
