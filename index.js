/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import bgMessaging from './bgMessaging'; // <-- Import the file you created in (2)
// import jobServices from  './jobServices';
// jobServices.jobServices()


AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); // <-- Add this line