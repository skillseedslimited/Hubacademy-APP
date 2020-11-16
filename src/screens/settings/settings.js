import React, { Component } from 'react'
import { Text, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon,Divider,Button } from 'react-native-elements'
import InfoText from '../../components/InfoText'

import { EvilIcons } from 'react-native-vector-icons/EvilIcons';
import { MaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import VideoRoute from './videos'
import AudioRoute from './audios'
import EbookRoute from './ebooks'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const initialLayout = { width: Dimensions.get('window').width };



class SettingsScreen extends React.Component {

    constructor(props) {
      super(props);
      this.state={
        index: 0,
        routes: [
            { key: 'video', title: 'Videos' },
            { key: 'audio', title: 'Audios' },
            { key: 'ebooks', title: 'Ebooks' },
          ]
      }
    }

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params;
        return {
            headerRight: () => (
            <View style={{ paddingHorizontal: 20 }}>
                <TouchableOpacity
                    style={{backgroundColor:'#ff9800',paddingVertical:(0.5*windowHeight)/100,paddingHorizontal:(5*windowWidth)/100}}
                // onPress={ () => params.open() }
                >
                    <Text style={{fontSize:0.03*windowWidth}}>
                        Category
                    </Text>
                </TouchableOpacity>
            </View>
            ),
        };
    };

    renderScene = SceneMap({
        video: VideoRoute,
        audio: AudioRoute,
        ebooks: EbookRoute,
    });

    render() {
        return (
            <TabView
              renderTabBar={props =>
              <TabBar
                {...props}
                activeColor={'black'}
                inactiveColor={'grey'}
                style={{backgroundColor:'#eceff1'}}
                indicatorStyle={{backgroundColor:'#ff9800'}}
              />}
              navigationState={{ index: this.state.index, routes: this.state.routes }}
              renderScene={this.renderScene}
              onIndexChange={index => this.setState({index})}
              initialLayout={initialLayout}
            />
          );
    }
}

export default SettingsScreen;


  
  const styles = StyleSheet.create({
    scene: {
      flex: 1,
    },
  });



