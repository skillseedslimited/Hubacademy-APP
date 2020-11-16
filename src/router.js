import React from "react";

import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {createSwitchNavigator} from "react-navigation";
import { TouchableOpacity,View, Text,StyleSheet} from 'react-native';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';
import { Icon } from 'react-native-elements'
import Modal from "react-native-modal";


// import Octicons from 'react-native-vector-icons/Octicons';

import HomeScreen from './screens/home/home';
import LoginScreen from './screens/login/login';
import SignupScreen from './screens/signup/signup';
import forgotpassword from './screens/forgotpassword/forgotpassword';
import CatScreen from './screens/cat/cat';
import CoachScreen from './screens/coach/coach';
import CatAuthorScreen from './screens/cat/catAuthorScreen';
import AuthorScreen from './screens/author/authorScreen';
import CoachDetailScreen from './screens/coach/coachDetailScreen';
import ReflectionScreen from './screens/reflection/reflection';
import ReflectionDetailsScreen from './screens/reflection/reflectionDetails';
import SubscriptionScreen from './screens/subscription/subscription';
import MessageScreen from './screens/messages/message';



import ChatScreen from './screens/chats/chat';
import VoiceCall from './screens/chats/voice';
import VideoCall from './screens/chats/video';




import DiaryScreen from './screens/diary/diary';
import AddDiaryScreen from './screens/diary/addDiary';
import Todo_ListScreen from './screens/todo_List/todo_List';
import Event_ListScreen from './screens/todo_List/event_List';
import SettingsScreen from './screens/settings/settings';
import WalletScreen from './screens/wallet/wallet';

import ProfileScreen from './screens/profile/profile';




import TextsScreen from './screens/contents/texts';
import EbooksScreen from './screens/contents/ebooks';
import AudiosScreen from './screens/contents/audios';
import VideosScreen from './screens/contents/videos';


import MyEbooksScreen from './screens/myStore/ebooks';
import MyAudiosScreen from './screens/myStore/audios';
import MyVideosScreen from './screens/myStore/videos';

import StoreEbooksScreen from './screens/store/ebooks';
import StoreAudiosScreen from './screens/store/audios';
import StoreVideosScreen from './screens/store/videos';



import DrawerMenu from "./screens/drawer/DrawerMenu";
import DropDown from "./components/DropDown";



const HomeView = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({navigation}) => ({
        title: "Overview",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                 <Icon name="menu" size={30} color="black" />
            </TouchableOpacity>
          </View>
        )
      }),
    }
  },
);


const MyVideosView = createStackNavigator(
  {
    MyVideos: {
      screen: MyVideosScreen,
      navigationOptions: ({navigation}) => ({
        title: "My Videos",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity>
              <Icon name='search'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
      }),
    }
  },
);

const MyAudiosView = createStackNavigator(
  {
    MyAudios: {
      screen: MyAudiosScreen,
      navigationOptions: ({navigation}) => ({
        title: "My Audios",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity>
              <Icon name='search'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
      }),
    }
  },
);

const MyEbooksView = createStackNavigator(
  {
    MyEbooks: {
      screen: MyEbooksScreen,
      navigationOptions: ({navigation}) => ({
        title: "My Ebooks",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
             <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity>
              <Icon name='search'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
      }),
    }
  },
);

const StoreVideosView = createStackNavigator(
  {
    StoreVideos: {
      screen: StoreVideosScreen,
      navigationOptions: ({navigation}) => ({
        title: "Store",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity>
              <Icon name='search'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
      }),
    }
  },
);

const StoreAudiosView = createStackNavigator(
  {
    StoreAudios: {
      screen: StoreAudiosScreen,
      navigationOptions: ({navigation}) => ({
        title: "Store",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity>
              <Icon name='search'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
      }),
    }
  },
);

const StoreEbooksView = createStackNavigator(
  {
    StoreEbooks: {
      screen: StoreEbooksScreen,
      navigationOptions: ({navigation}) => ({
        title: "Store",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
             <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity>
              <Icon name='search'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        ),
      }),
    }
  },
);

const DiaryView = createStackNavigator(
  {
    diary: {
      screen: DiaryScreen,
      navigationOptions: ({navigation}) => ({
        title: "Diary",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                 <Icon name="menu" size={30} color="black" />
            </TouchableOpacity>
          </View>
        )
      }),
    },
    addDiary: {
      screen: AddDiaryScreen,
      navigationOptions: ({navigation}) => ({
        title: "Add diary",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#fff3e0',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'#ff9800'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        )
      }),
    }
  },
  {
    transitionConfig: getSlideFromRightTransition
  },
);

const SettingsView = createStackNavigator(
  {
    settings: {
      screen: SettingsScreen,
      navigationOptions: ({navigation}) => ({
        title: "Freebies",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                 <Icon name="menu" size={30} color="black" />
            </TouchableOpacity>
          </View>
        )
      }),
    }
  },
);

const CatAuthorView = createStackNavigator(
  {
    CatAuthor: {
      screen: CatAuthorScreen,
      navigationOptions: {
        header: null
      },
    }
  },
);

const AuthorView = createStackNavigator(
  {
    Author: {
      screen: AuthorScreen,
      navigationOptions: {
        header: null
      },
    }
  },
);


const CoachDetailView = createStackNavigator(
  {
    CatAuthor: {
      screen: CoachDetailScreen,
      navigationOptions: {
        header: null
      },
    }
  },
);

const TextsView = createStackNavigator(
  {
    Texts: {
      screen: TextsScreen,
      navigationOptions: {
        header: null
      },
    }
  },
);

const EbooksView = createStackNavigator(
  {
    Ebooks: {
      screen: EbooksScreen,
      navigationOptions: {
        header: null
      },
    }
  },
);

const AudiosView = createStackNavigator(
  {
    Audios: {
      screen: AudiosScreen,
      navigationOptions: {
        header: null
      },
    }
  },
);

const VideosView = createStackNavigator(
  {
    Videos: {
      screen: VideosScreen,
      navigationOptions: {
        header: null
      },
    }
  },
);

const Todo_ListView = createStackNavigator(
  {
    todo_List: {
      screen: Todo_ListScreen,
      navigationOptions: ({navigation}) => ({
        title: "Todo List",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                 <Icon name="menu" size={30} color="black" />
            </TouchableOpacity>
          </View>
        )
      }),
    },
    todo_event: {
      screen: Event_ListScreen,
      navigationOptions: ({navigation}) => ({
        title: "Todo List",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        )
      }),
    }
  },
  {
    transitionConfig: getSlideFromRightTransition
  },
);

const CatView = createStackNavigator(
  {
    Cat: {
      screen: CatScreen,
      navigationOptions: ({navigation}) => ({
        title: "Categories",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        )
      }),
    },
  //  CatAuthor: {
  //     screen: CatAuthorScreen,
  //     navigationOptions: {
  //       header: null
  //     }, 
  //   }
  },
  {
    transitionConfig: getSlideFromRightTransition
  },
);

const CoachView = createStackNavigator(
  {
    Coach: {
      screen: CoachScreen,
      navigationOptions: ({navigation}) => ({
        title: " All Coaches",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        )
      }),
    },
    CoachDetails: {
      screen: CoachDetailView,
      navigationOptions: {
        header: null
      }, 
    }
  },
  {
    transitionConfig: getSlideFromRightTransition
  },
);


const ReflectionDetailsView = createStackNavigator(
  {
    ReflectionDetails: {
      screen: ReflectionDetailsScreen,
      navigationOptions: {
        header: null
      },
    }
  },
);

const SubscriptionView = createStackNavigator(
  {
    Subscription: {
      screen: SubscriptionScreen,
      navigationOptions: ({navigation}) => ({
        title: "Subscriptions",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        )
      }),
    }
  },
);





const HomeTab = createMaterialTopTabNavigator({
  home:{
    screen:HomeView,
    navigationOptions: {
      tabBarLabel:"Home",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" type="antDesign" color={tintColor} size={25}/>
      ),
    },
  },
  Diary:{
    screen:DiaryView,
    navigationOptions: {
      tabBarLabel:"Diary",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-journal" type="ionicon" color={tintColor} size={25}/>
      )
    },
  },
  Todo_List:{
    screen:Todo_ListView,
    navigationOptions: {
      tabBarLabel:"Todo List",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="tasklist" type="octicon" color={tintColor} size={25}/>
      )
    },
  },
  Settings: {
    screen:SettingsView,
    navigationOptions: {
      tabBarLabel:"Settings",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-gift" type="ionicon" color={tintColor} size={25}/>
      ),
    },
  },
},
{
  initialRouteName: 'home',
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: '#ff9800',
    inactiveTintColor: 'gray',
    style: {
      backgroundColor: '#fff',
    },
    showIcon: true,
    showLabel: false
  },
},
);


const MyContent = createMaterialTopTabNavigator({
  video:{
    screen:MyVideosView,
    navigationOptions: {
      tabBarLabel:"Videos",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" type="antDesign" color={tintColor} size={25}/>
      ),
    },
  },
  audio:{
    screen:MyAudiosView,
    navigationOptions: {
      tabBarLabel:"Audios",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-journal" type="ionicon" color={tintColor} size={25}/>
      )
    },
  },
  ebook:{
    screen:MyEbooksView,
    navigationOptions: {
      tabBarLabel:"Ebooks",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="tasklist" type="octicon" color={tintColor} size={25}/>
      )
    },
  },
},
{
  initialRouteName: 'video',
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: '#ff9800',
    inactiveTintColor: 'gray',
    style: {
      backgroundColor: '#fff',
    },
    showIcon: false,
    showLabel: true
  },
},
);

const StoreContent = createMaterialTopTabNavigator({
  video:{
    screen:StoreVideosView,
    navigationOptions: {
      tabBarLabel:"Videos",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" type="antDesign" color={tintColor} size={25}/>
      ),
    },
  },
  audio:{
    screen:StoreAudiosView,
    navigationOptions: {
      tabBarLabel:"Audios",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-journal" type="ionicon" color={tintColor} size={25}/>
      )
    },
  },
  ebook:{
    screen:StoreEbooksView,
    navigationOptions: {
      tabBarLabel:"Ebooks",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="tasklist" type="octicon" color={tintColor} size={25}/>
      )
    },
  },
},
{
  initialRouteName: 'video',
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: '#ff9800',
    inactiveTintColor: 'gray',
    style: {
      backgroundColor: '#fff',
    },
    showIcon: false,
    showLabel: true
  },
},
);


const ReflectionDetailsTab = createMaterialTopTabNavigator({
  Reflection:{
    screen:ReflectionDetailsScreen,
    navigationOptions: {
      tabBarLabel:"Reflection",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="sun" type="feather" color={tintColor} size={25}/>
      ),
    },
  },
  Diary:{
    screen:DiaryScreen,
    navigationOptions: {
      tabBarLabel:"Diary",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-journal" type="ionicon" color={tintColor} size={25}/>
      )
    },
  },
  Todo:{
    screen:Todo_ListScreen,
    navigationOptions: {
      tabBarLabel:"Todo List",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="tasklist" type="octicon" color={tintColor} size={25}/>
      )
    },
  },
},
{
  initialRouteName: 'Reflection',
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: '#ff9800',
    inactiveTintColor: 'gray',
    style: {
      backgroundColor: '#fff',
    },
    showIcon: true,
    showLabel: false
  },
},
);

ReflectionDetailsTab.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];;
  const headerTitle = routeName;
  return {
    headerTitle,
  };
};


const ContentTab = createMaterialTopTabNavigator({
  Video:{
    screen:VideosScreen,
    navigationOptions: {
      tabBarLabel:"Videos",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" type="antDesign" color={tintColor} size={25}/>
      ),
    },
  },
  Audio:{
    screen:AudiosScreen,
    navigationOptions: {
      tabBarLabel:"Audios",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-journal" type="ionicon" color={tintColor} size={25}/>
      )
    },
  },
  Ebook:{
    screen:EbooksScreen,
    navigationOptions: {
      tabBarLabel:"Ebooks",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="tasklist" type="octicon" color={tintColor} size={25}/>
      )
    },
  },
  Text: {
    screen:TextsScreen,
    navigationOptions: {
      tabBarLabel:"Texts",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-options" type="ionicon" color={tintColor} size={25}/>
      ),
    },
  },
},
{
  initialRouteName: 'Video',
  tabBarPosition: 'top',
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: '#bf360c',
    inactiveTintColor: 'gray',
    style: {
      backgroundColor: '#eceff1',
      borderBottomWidth: 1,
      borderBottomColor:'black'
    },
    showIcon: false,
    showLabel: true
  },
},
);

ContentTab.navigationOptions = ({ navigation }) => {
  const routeName = navigation.state.params.name;
  const headerTitle = 'Content';
 
  return {
    headerTitle,
  };
};



const ReflectionView = createStackNavigator(
  {
    Reflection: {
      screen: ReflectionScreen,
      navigationOptions: ({navigation}) => ({
        title: "Reflections",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity onPress={() => navigation.popToTop()}>
            <Icon name='arrow-back'  size={23} color="black" />
          </TouchableOpacity>
        </View>
        )
      }),
    },
    ReflectionD: {
      screen: ReflectionDetailsTab,
      navigationOptions: ({navigation}) => ({
        // header: null
        // title: "Content",
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#eceff1',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor:'black'
        },
        headerLeft: (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Icon name='arrow-back'  size={23} color="black" />
            </TouchableOpacity>
          </View>
        )
      }),
    }
  },
  {
    transitionConfig: getSlideFromRightTransition
  },
);



// const FirstScreen = createStackNavigator(
//   {
//     first: { 
//       screen: HomeTab,
//       navigationOptions: {
//           header: null,
//       }
//     },
//     others: { 
//       screen: OtherScreen,
//       navigationOptions: {
//           header: null,
//       }
//     }
//   },
//   {
//     transitionConfig: getSlideFromRightTransition
//   },
// );




const FirstScreen = createDrawerNavigator({
  Home: HomeTab 
},{
  contentComponent: DrawerMenu,
  drawerType: 'back'
});

FirstScreen.navigationOptions = {
  // Hide the header from AppNavigator stack
  header: null,
};


const SignedIn = createStackNavigator({
  Home: { screen: FirstScreen,
    navigationOptions: {
      header: null
    }, },
  CatDetails: { screen: CatAuthorScreen,
    navigationOptions: {
      header: null
    }, },
  Cats: { screen: CatView,
    navigationOptions: {
      header: null
    }, },
  Coaches: { screen: CoachView,
    navigationOptions: {
      header: null
    }, },
  Author: { screen: AuthorScreen,
    navigationOptions: {
      header: null
    }, },
  Reflections: { screen: ReflectionView,
    navigationOptions: {
      header: null
    }, },
  Wallet: { screen: WalletScreen,
      navigationOptions: {
        header: null
      }, },
  Profile: { screen: ProfileScreen,
    navigationOptions: {
      header: null
    }, },
  ReflectionDetails: { screen: ReflectionDetailsTab,
    navigationOptions: ({navigation}) => ({
      // header: null
      // title: "Content",
      headerTintColor: 'black',
      headerStyle: {
        backgroundColor: '#eceff1',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor:'black'
      },
      headerLeft: (
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity onPress={() => navigation.popToTop()}>
            <Icon name='arrow-back'  size={23} color="black" />
          </TouchableOpacity>
        </View>
      )
    }), },
  Subscriptions: { 
    screen: SubscriptionScreen,
    navigationOptions: {
      header: null
    },
   },
   Messages: { 
    screen: MessageScreen,
    navigationOptions: {
      header: null
    },
   },
   Chat: { 
    screen: ChatScreen,
    navigationOptions: {
      header: null
    },
   },
   VoiceCall: { 
    screen: VoiceCall,
    navigationOptions: {
      header: null
    },
   },
   VideoCall: { 
    screen: VideoCall,
    navigationOptions: {
      header: null
    },
   },
  Content: { screen: ContentTab,
    navigationOptions: {
      // header: null
      // title: "Content",
      headerTintColor: 'black',
      headerStyle: {
        backgroundColor: '#eceff1',
        elevation: 0,
        shadowOpacity: 0,
      },
    }, },
    myContent: { screen: MyContent,
      navigationOptions: {
        header: null
      }, },
      storeContent: { screen: StoreContent,
        navigationOptions: {
          header: null
        }, },
}, {
  transitionConfig: getSlideFromRightTransition
});





const SignedOut = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
       header: null
      },
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: {
       header: null
      },
    },
    forgotpassword: {
      screen: forgotpassword,
      navigationOptions: {
       header: null
      },
    },
  },
  {
    transitionConfig: getSlideFromRightTransition
  },
  {
    initialRouteName: 'Login'
  }
);




export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      SignedOut: {
        screen: SignedOut
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut",
    }
  );
};
