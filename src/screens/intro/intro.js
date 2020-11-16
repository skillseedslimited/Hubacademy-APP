import React from 'react';
import {
 Image,StatusBar, Alert, BackHandler
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper'; // 0.4.0





class IntroScreen extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;
  
  constructor(props) {
    super(props);
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
    );
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
    );
  }


 

  onBackPress = () => {
 
    //Code to display alert message when use click on android device back button.
    Alert.alert(
      ' Exit From App ',
      ' Do you want to exit From App ?',
      [
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
        { text: 'No', onPress: () => console.log('NO Pressed') }
      ],
      { cancelable: false },
    );
 
    // Return true to enable back button over ride.
    return true;
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
  }



  static navigationOptions = { header: null }; 
  skip = () => {
    this.props.navigation.navigate('Home')
  }
  render() {
    StatusBar.setBackgroundColor("#032D66");
    return (
      <Onboarding
        imageContainerStyles={{paddingBottom:0}}
        titleStyles={{paddingTop:0}}
        onSkip={this.skip}
        onDone={this.skip}
        pages={[
          {
            backgroundColor: '#032D66',
            image: <Image  style={{width:'90%', height:200}} resizeMode='contain' source={require('../../asset/intro3.png')} />,
            title: '',
            subtitle: 'We provid a full range of business and corporate legal services.',
          },
          {
            backgroundColor: '#032D66',
            image: <Image  style={{width:'90%', height:200}} resizeMode='contain' source={require('../../asset/intro4.png')} />,
            title: '',
            subtitle: 'We invest in understanding your businesses and objectives and provide them with timely, efficient and practical advice',
          },
          {
            backgroundColor: '#032D66',
            image: <Image  style={{width:'90%', height:200}} resizeMode='contain' source={require('../../asset/intro6.png')} />,
            title: '',
            subtitle: "Our Clients are our foremost priority and their interests come first with us",
          },
        ]}
      />
    );
  }
}


export default IntroScreen;