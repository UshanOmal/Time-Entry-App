import React, {Component} from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import LoadingPage from './src/screen/LodingPage';
import Auth from './src/screen/Auth';
import DashBoard from './src/screen/DashBoard';
import Done from './src/screen/Done';
import Postpone from './src/screen/Postpone';
import TimeSheet from './src/screen/TimeSheet';
// import EditTask from './src/screen/EditTask';
// import PushNotification from './src/screen/PushNotification';

const MainNavigator = createStackNavigator({
  LoadingPage:{screen: LoadingPage},
  Auth: {screen: Auth},
  DashBoard: {screen: DashBoard},
  TimeSheet: {screen: TimeSheet},
  Done: {screen: Done},
  Postpone: {screen: Postpone},
  // EditTask: {screen: EditTask},
  // PushNotification: { screen: PushNotification }

});




const App = createAppContainer(MainNavigator);

export default App;