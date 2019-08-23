import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, KeyboardAvoidingView, Alert, Dimensions } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Button from '../UI/components/Button/Button';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import { Header } from 'react-navigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export class Postpone extends Component {

  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params,
      this.state = {
        TimeFrom: moment(this.params.SelectTimeFrom).format('HH:mm'),
        TimeTo: moment(this.params.SelectTimeTo).format('HH:mm'),
        date: this.params.SelectDate,
        Description: this.params.SelectedDescription

      }

  }

  static navigationOptions = {
    // header:null,
    tabBarVisible: true,
    title: 'Postpone',
    headerStyle: {
      backgroundColor: '#A9CCE3',
    }
  }

  onButtonPress() {
    fetch('http://192.168.2.23:100/integration/activity/saveActivity', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ID: this.params.SelectId,
        Date: this.state.date,
        TimeFrom: this.state.TimeFrom,
        TimeTo: this.state.TimeTo,
        Description: this.state.Description
      })
    }).then(response => response.json())
      .then((responseJson) => {
        if (responseJson.message != null) {
          Alert.alert(
            'Message',
            'Activity Changed',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: true },
          );
        }
        else {
          Alert.alert(
            'Message',
            'System Error!!!',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: true },
          );
        }
      })

  }

  renderButton() {
    return (
      <Button
        onPress={this.onButtonPress.bind(this)}>Save</Button>
    );
  }

  render() {
    var Token = this.params.TokenTimeSheetInternal

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.fullView}>
        <KeyboardAvoidingView style={styles.boardView} behavior="height">
          <View style={styles.descriptionView}>
            <Text style={styles.subTopic}>Description :</Text>
            <TextInput borderBottomWidth={1} style={styles.textStyle}>{this.params.SelectedDescription}</TextInput>
          </View>

          <View style={styles.time}>
            <View style={styles.timeDescription}>
              <Text style={styles.subTopic}>Time from :</Text>
              <TextInput borderBottomWidth={1} onChangeText={(TimeFrom) => this.setState({ TimeFrom })}>{this.state.TimeFrom}</TextInput>
            </View>

            <View style={styles.timeDescription}>
              <Text style={styles.subTopic}>Time to :</Text>
              <TextInput style={styles.textStyle} borderBottomWidth={1} onChangeText={(TimeTo) => this.setState({ TimeTo })}>{this.state.TimeTo}</TextInput>
            </View>
          </View>

          <View style={styles.descriptionView}>
            <Text style={styles.subTopicForDate}>Select other date :</Text>
            <DatePicker
              style={styles.textStyle}
              style={{ width: 200 }}
              date={this.state.date}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              // minDate="2016-05-01"
              // maxDate="2016-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => { this.setState({ date: date }) }}
            />
          </View>

          <View style={styles.buttonContainer}>
            {this.renderButton()}
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
export default Postpone;

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
    width: SCREEN_WIDTH - 30,
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
  },
  subTopicForDate: {
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 6
  }
});