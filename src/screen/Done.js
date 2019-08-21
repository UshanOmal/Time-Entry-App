import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Alert, KeyboardAvoidingView, Dimensions} from 'react-native';
import Button from '../UI/components/Button/Button';
import moment from 'moment';
import { Header } from 'react-navigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export class Done extends Component {
static navigationOptions={ 
  tabBarVisible:true ,
  title: 'Done',
  headerStyle: {
    backgroundColor: '#A9CCE3',
  },
}
constructor(props) {
  super(props);
  this.params = this.props.navigation.state.params,
  this.state = {
    userItems: '',
    note: '',
    time: '',
    scrollEnabled: true,
    Description : this.params.SelectedDescription,
    Code : this.params.SelectCode,
    TimeFrom : moment(this.params.SelectTimeFrom).format('HH:mm'),
    TimeTo : moment(this.params.SelectTimeTo).format('HH:mm'),
    Id : this.params.SelectId
  };
  this.calendar = null;
}

onCancel() {
  this.TimePicker.close();
}

onConfirm(hour, minute) {
  this.setState({ time: `${hour}:${minute}` });
  this.TimePicker.close();
}

onButtonPress (){
  fetch('https://onejit.jithpl.com/integration/timeEntry/saveTimeEntry', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ActivityID: this.params.SelectId,
          EmployeeID: this.params.EmployeeID,
          Date : this.params.SelectDate,
          timeFrom: this.params.SelectTimeFrom,
          timeTo: this.params.SelectTimeTo,
          ActivityType: this.params.ActivityType,
          Description: this.params.SelectedDescription,
          Note: this.state.note,
        })
    })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState ({
          userItems:responseJson
        })
      Alert.alert(this.params.SelectedDescription +' Added to Time Sheet');
    }).catch((error) => {
        Alert.alert(error);
    });
}
renderButton() {
  return (
      <Button 
      onPress={this.onButtonPress.bind(this)}>
      Add To Time Sheet
    </Button>
  );
}
render() {
  
  var Token = this.params.TokenTimeSheetInternal
  const { navigate } = this.props.navigation;
  return (
    <View style = {styles.fullView}>
      <KeyboardAvoidingView style = {styles.boardView} behavior="height">
        <View style = {styles.descriptionView}>
          <Text style = {styles.subTopic}>Code :</Text>
          <Text style = {styles.textStyle}>{this.params.SelectCode}</Text>
        </View>

        <View style = {styles.descriptionView}>
          <Text style = {styles.subTopic}>Description :</Text>
          <Text style = {styles.textStyle}>{this.params.SelectedDescription}</Text>
        </View>

        <View style = {styles.time}>
          <View style = {styles.timeDescription}>
            <Text style = {styles.subTopic}>Time from :</Text>
            <TextInput borderBottomWidth = {1} onChangeText={(TimeFrom) => this.setState({TimeFrom})}>{this.state.TimeFrom}</TextInput>
          </View>

          <View style = {styles.timeDescription}>
            <Text style = {styles.subTopic}>Time to :</Text>
            <TextInput style = {styles.textStyle} borderBottomWidth = {1} onChangeText={(TimeTo) => this.setState({TimeTo})}>{this.state.TimeTo}</TextInput>
          </View>
        </View>

        <View style = {styles.descriptionView}>
          <Text style = {styles.subTopic}>Note :</Text>
          <TextInput 
            borderBottomWidth = {1}
            multiline={true}
            scrollEnabled={this.state.scrollEnabled}
            textAlignVertical= 'top'
            height= {100}></TextInput>
        </View>

        <View style= {styles.buttonContainer}>
          {this.renderButton()}
        </View>
      </KeyboardAvoidingView>
    </View>
    );
  }
}
export default Done;

const styles = StyleSheet.create({
  fullView: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#dcdcdc',
    paddingTop: 15,
    paddingBottom: 15
  },
  boardView: {
    width: SCREEN_WIDTH-30,
    height: '100%',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10
  },
  descriptionView: {
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  subTopic: {
    color: '#000000',
    fontWeight: 'bold'
  },
  time: {
    flexDirection: 'row'
  },
  timeDescription: {
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
    width: '50%',
  },
  buttonContainer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 30
  },
  textStyle: {
    marginBottom: 6
  }
});