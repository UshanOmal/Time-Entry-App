// import React, { Component } from 'react';
// import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ImageBackground, Dimensions, AsyncStorage, } from 'react-native';
// import moment from 'moment';
// import Button from '../UI/components/Button/Button';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// class EditTask extends Component {
  

//     static navigationOptions={ 
//         // header:null,
//         tabBarVisible:true ,
//         title: 'Edit',
//         headerStyle: {
//           backgroundColor: '#A9CCE3',
//         }
//     }
// render () {
//   return(
//     <View>
//       <TouchableOpacity onPress={this.saveData} >
//         <Text>Click me to save data</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={this.displayData}>
//         <Text>Click me to display data</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// saveData(){
//   var obj = {
//     name: 'john doe',
//     email: 'test@gmail.com',
//     city: 'melborne'
//   }
 
//   AsyncStorage.setItem('user', JSON.stringify(obj));
// }
// displayData = async () => {
//   try {
//     var user = await AsyncStorage.getItem('user');
//     var parsed = JSON.parse(user);
//     alert(parsed.email);
//   }
//   catch(error){
//     alert(error);
//   }
// }
//   }
    
// export default EditTask;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: "center",
//         paddingTop:10,
//         paddingBottom:10,
//         // height: 200
//         // backgroundColor: "#e6e6fa"
//       },
//       container2: {
//         // flex: 1,
//         backgroundColor: "#e6e6fa",
//         borderRadius: 2,
//         width: SCREEN_WIDTH-20,
//         height: 200,
//         // alignItems: 'flex-start',
//         textAlignVertical: 'top'

//     }
// })