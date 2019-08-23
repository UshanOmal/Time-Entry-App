import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, ScrollView, AppRegistry, TouchableOpacity, Dimensions, CheckBox, Alert } from 'react-native';
import Button from '../UI/components/Button/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-simple-modal";
import moment from 'moment';
import styles2 from './WeekView.styles';
import CalendarStrip from 'react-native-slideable-calendar-strip';

const width = Dimensions.get('window').width;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('screen');
const TIME_LABELS_COUNT = 48;

export default class TimeSheet extends Component {
  state = {
    open: false,
    scrollEnabled: true,
  };

  modalDidOpen = () => console.log("Modal did open.");

  modalDidClose = () => {
    this.setState({ open: false });
  };

  openModal = (rowItem) => this.setState({
    open: true,
    selectedDescription: rowItem.description,
    employeeID: rowItem.assigneeID,
    activityType: rowItem.activityType,
    selectCode: rowItem.code,
    selectTimeFrom: rowItem.timeFrom,
    selectTimeTo: rowItem.timeTo,
    selectId: rowItem.id,
    selectIsDone: rowItem.isDone,
    selectDate: rowItem.date,
  });

  openTimeSheet = (rowItem) => {

    var ActivityCategory = '';
    if (rowItem.activityType == 1) {
      ActivityCategory = 'Metting';
    }
    else if (rowItem.activityType == 2) {
      ActivityCategory = 'Call';
    }
    else if (rowItem.activityType == 3) {
      ActivityCategory = 'Email';
    }
    else if (rowItem.activityType == 4) {
      ActivityCategory = 'Networking';
    }
    else if (rowItem.activityType == 5) {
      ActivityCategory = 'Other';
    }

    Alert.alert(
      'Time Entry Details',
      'Activity Type : ' + ActivityCategory + '\n' + '\n' + 'Time : ' + moment(rowItem.timeFrom).format('HH:mm') + ' To ' + moment(rowItem.timeTo).format('HH:mm') + '\n' + '\n' + 'Description : ' + rowItem.description,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: true },
    );

  };

  closeModal = () => this.setState({ open: false });

  static navigationOptions = {
    // // header:null,
    tabBarVisible: true,
    title: 'Time Entry Sheet',
    headerStyle: {
      backgroundColor: '#A9CCE3',
    },
  }

  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.state = {
      selectedDate: new Date(),
      AllActivities: [],
      toDayActivity: [],
      delayedActivities: [],
      i: '',
      selectedDescription: '',
      employeeID: '',
      activityType: '',
      selectCode: '',
      selectTimeFrom: '',
      selectTimeTo: '',
      selectId: '',
      selectIsDone: '',
      selectedDescription: '',
      selectDate: '',
      checked: false,
      selectedDateFromCalandar: '',
      todayDate: '',
      Duration: ''
    };
    this.calendar = null;
  }

  // scrollViewRef = (ref) => {
  //   this.calendar = ref;
  // }

  // prepareDates = (currentMoment, numberOfDays) => {
  //   const dates = [];
  //   for (let i = -2; i < 3; i += 1) {
  //     const date = moment(currentMoment).add(numberOfDays * i, 'd');
  //     dates.push(date);
  //   }
  //   return dates;
  // };

  // generateTimes = () => {
  //   const times = [];
  //   for (let i = 0; i < TIME_LABELS_COUNT; i += 1) {
  //     const minutes = i % 2 === 0 ? '00' : '15';
  //     const hour = Math.floor(i / 2);
  //     const time = `${hour}:${minutes}`;
  //     times.push(time);
  //   }
  //   return times;
  // };

  // scrollEnded = (event) => {
  //   const { nativeEvent: { contentOffset, contentSize } } = event;
  //   const { x: position } = contentOffset;
  //   const { width: innerWidth } = contentSize;
  //   const newPage = (position / innerWidth) * 5;
  //   const { onSwipePrev, onSwipeNext, numberOfDays } = this.props;
  //   const { currentMoment } = this.state;
  //   requestAnimationFrame(() => {
  //     const newMoment = moment(currentMoment)
  //       .add((newPage - 2) * numberOfDays, 'd')
  //       .toDate();

  //     this.setState({ currentMoment: newMoment });

  //     if (newPage < 2) {
  //       onSwipePrev && onSwipePrev(newMoment);
  //     } else if (newPage > 2) {
  //       onSwipeNext && onSwipeNext(newMoment);
  //     }
  //   });
  // };

  getActivtiesByDate = (date) => {
    if (date != null) {
      var Caldate = date.getDate()
      var CalMonth = date.getMonth() + 1
      var CalYear = date.getFullYear()
      var CalFullDate = CalYear + '-' + CalMonth + '-' + Caldate

      var API = 'http://192.168.2.23:100/integration/activity/getActivities?date='

      fetch(API + CalFullDate, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.params.TokenTimeSheet,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          let ToTestarray = [];

          if (responseJson.message != null) {
            ToTestarray.push(responseJson.message)
            this.setState({ AllActivities: ToTestarray })
          }

          for (i = 0; i < responseJson.activityList.length; i = i + 1) {
            ToTestarray.push(responseJson.activityList[i]);
          }
          this.setState({ AllActivities: ToTestarray })
        })
    }
  }

  getTimeSheetByDate = (date) => {
    if (date != null) {
      var Caldate = date.getDate()
      var CalMonth = date.getMonth() + 1
      var CalYear = date.getFullYear()
      var CalFullDate = CalYear + '-' + CalMonth + '-' + Caldate
    }

    var API = 'http://192.168.2.23:100/integration/timeEntry/getActivitiesForTimeSheet?date='

    fetch(API + CalFullDate, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.params.TokenTimeSheet,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {

        let timeSheetarray = [];
        let duration = 0;
        let hours = 0;
        let minutes = 0;
        if (responseJson.message != null) {
          timeSheetarray.push(responseJson.message)
          this.setState({ TimeSheetarray: timeSheetarray })
        }
        for (i = 0; i < responseJson.timeSheetList.length; i = i + 1) {
          timeSheetarray.push(responseJson.timeSheetList[i]);

          var end = responseJson.timeSheetList[i].timeTo;
          var start = responseJson.timeSheetList[i].timeFrom;

          duration = moment(end, "YYYY-MM-DD HH:mm:ss").diff(moment(start, "YYYY-MM-DD HH:mm:ss"));
          var d = moment.duration(duration);
          var s = Math.floor(d.asHours()) + moment.utc(duration).format(":mm:ss");
          hours = d.asHours() + hours;
          minutes = (d.asMinutes() + minutes) % 60;

        }
        var workTime = hours + ':' + minutes

        this.setState({ Duration: workTime })
        this.setState({ TimeSheetarray: timeSheetarray })
      })

  }
  componentWillMount() {
    this.fetchData();
    this.getTimeSheetByDate(new Date());

    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.fetchData();
        this.getTimeSheetByDate(new Date());
        this.closeModal();
      }
    );
  }
  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }
  fetchData = async () => {

    var API = 'http://192.168.2.23:100/integration/activity/getActivities?date='
    var day = new Date().getDate()
    var month = new Date().getMonth() + 1
    var year = new Date().getFullYear()
    var today = year + '-' + month + '-' + day

    this.setState({ todayDate: today })

    fetch(API + today, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.params.TokenTimeSheet,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {

        let ToTestarray = [];
        if (responseJson.message != null) {
          ToTestarray.push(responseJson.message)
          this.setState({ AllActivities: ToTestarray })
        }
        for (i = 0; i < responseJson.activityList.length; i = i + 1) {
          ToTestarray.push(responseJson.activityList[i]);
        }
        this.setState({ AllActivities: ToTestarray })
      })
  }
  render() {
    const {
      numberOfDays,
      headerStyle,
      formatDateHeader,
      onEventPress,
      events,
    } = this.props;
    var SelectedDescription = this.state.selectedDescription
    var SelectCode = this.state.selectCode
    var EmployeeID = this.state.employeeID
    var ActivityType = this.state.activityType
    var SelectTimeFrom = this.state.selectTimeFrom
    var SelectTimeTo = this.state.selectTimeTo
    var SelectId = this.state.selectId
    var SelectIsDone = this.state.selectIsDone
    var SelectDate = this.state.selectDate
    var TokenTimeSheetInternal = this.params.TokenTimeSheet

    // how to view token import from previous page
    const { navigate } = this.props.navigation;

    const { currentMoment } = this.state;
    // const dates = this.prepareDates(currentMoment, numberOfDays);
    return (
      <View style={styles.fullView}>

        <ScrollView>
          <View style={styles.container1}>
            <CalendarStrip
              selectedDate={this.state.selectedDate}
              onPressDate={(date) => {
                this.setState({ selectedDate: date });
                this.getActivtiesByDate(date);
                this.getTimeSheetByDate(date);
              }}
              onPressGoToday={(today) => {
                this.setState({ selectedDate: today });
                this.getActivtiesByDate(today);
                this.getTimeSheetByDate(today);
              }}
              onSwipeDown={() => {
                alert('onSwipeDown');
              }}
              showWeekNumber

              markedDate={[this.state.todayDate]}
            />
          </View>
          <View style={styles.blank}></View>
          <Text style={styles.header}>Tasks</Text>
          <View style={styles.blank}></View>
          <View style={styles.taskStyle}>
            <View style={styles.container2}>
              <View style={styles.item}
                scrollEnabled={this.state.scrollEnabled}>
                <FlatList
                  style={styles.listTask}
                  scrollEnabled={this.state.scrollEnabled}
                  data={this.state.AllActivities}
                  renderItem={({ item }) =>
                    <TouchableOpacity onPress={() => this.openModal(item)}>
                      <View style={{ flexDirection: 'row' }}

                        value={this.state.checked}
                        onValueChange={() => this.setState({ checked: !this.state.checked })}>
                        {item == 'No Activies found' ? <Text style={styles.text3} onPress={() => this.closeModal()}>No Activties Found</Text> : null}
                        {item.isDelayed == true && item != 'No Activies found' ? <Text style={styles.text2}>{item.description} : {moment(item.date).format('YYYY-MM-DD')} / {moment(item.timeFrom).format('HH:mm')}</Text> : null}
                        {item.isDelayed == false && item != 'No Activies found' ? <Text style={styles.text} >{item.description} : {moment(item.date).format('YYYY-MM-DD')} / {moment(item.timeFrom).format('HH:mm')}</Text> : null}
                        <View style={styles.separator} />
                      </View>
                    </TouchableOpacity>
                  }
                  keyExtractor={({ id }, index) => id}
                  scrollEnabled={true}>
                </FlatList>
              </View>
            </View>
            <Modal
              style={styles.modelStyle}
              offset={this.state.offset}
              open={this.state.open}
              modalDidOpen={this.modalDidOpen}
              modalDidClose={this.modalDidClose}>
              <View style={styles.popupStyle}>
                <Button style={{ margin: 5 }} onPress={() => navigate('Done', { SelectedDescription, SelectCode, SelectDate, SelectTimeFrom, SelectTimeTo, SelectId, SelectIsDone, EmployeeID, ActivityType, TokenTimeSheetInternal })}>
                  <Text> Done </Text>
                </Button>
              </View>

              <View style={styles.popupStyle}>
                <Button style={{ margin: 5 }} onPress={() => navigate('Postpone', { SelectCode, SelectTimeFrom, SelectTimeTo, SelectedDescription, SelectId, SelectDate, TokenTimeSheetInternal })}>
                  <Text> Postpone </Text>
                </Button>
              </View>

              <View style={styles.popupStyle}>
                <Button style={{ margin: 5 }} onPress={() => navigate('EditTask')}>
                  <Text> Edit </Text>
                </Button>
              </View>

              <View style={styles.popupStyle}>
                <Button style={{ margin: 5 }} onPress={this.closeModal}>
                  <Text> Cancel </Text>
                </Button>
              </View>
            </Modal>
          </View>

          <View style={styles.blank}></View>
          <Text style={styles.header}>Time Entry
      <Text style={styles.empty}>__________ </Text>
            <Text style={styles.TimeEntryheader}>No. Of Work Hour: {this.state.Duration}</Text>
          </Text>

          <View style={styles.blank}></View>

          <View style={styles.TimeSheetContainer}>
            <View style={styles.timeSheetStyle}>
              <View style={styles2.scrollViewContent}>
                <View >
                  <FlatList
                    style={styles.listTask}
                    scrollEnabled={this.state.scrollEnabled}
                    data={this.state.TimeSheetarray}
                    renderItem={({ item }) =>
                      <TouchableOpacity onPress={() => this.openTimeSheet(item)}>
                        <View closeModal
                          value={this.state.checked}
                          onValueChange={() => this.setState({ checked: !this.state.checked })}>
                          {/* <Text >{item.activityType}{'\n'}</Text> */}
                          {item == "No Time Sheet found" ? <Text style={styles.timeSheetStyle2} onPress={() => this.closeModal()}>Time Sheet Not Available</Text> : null}
                          {item != "No Time Sheet found" ? <Text style={styles.timeSheetTextStyle}>{moment(item.timeFrom).format('HH:mm')} {item.TimeFromType}: {moment(item.timeTo).format('HH:mm')}{'\n'}</Text> : null}
                          {item != "No Time Sheet found" ? <Text style={styles.timeSheetTextStyle}>{item.description} </Text> : null}
                          <View style={styles2.separator} />
                        </View>
                      </TouchableOpacity>
                    }
                    keyExtractor={({ id }, index) => id}
                    scrollEnabled={true}>
                  </FlatList>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container1: {
    // flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  container2:
  {
    // flex: 1,
    width: SCREEN_WIDTH - 2
  },
  item: {
    borderWidth: 1,
    borderRadius: 5,
    width: SCREEN_WIDTH - 5,
    height: 200
  },
  separator:
  {
    height: 2,
    backgroundColor: 'black',
    width: '100%'
  },
  text:
  {
    fontSize: 15,
    color: 'black',
    padding: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    width: '100%'
  },
  text2:
  {
    fontSize: 15,
    color: 'black',
    padding: 5,
    backgroundColor: '#E74C3C',
    // borderColor: 'black',
    width: SCREEN_WIDTH - 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5
  },
  text3:
  {
    fontSize: 15,
    color: 'black',
    padding: 5,
    width: SCREEN_WIDTH - 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#F39C12',
    color: 'black',
  },
  TextStyle: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 20
  },
  iconStyle: {
    alignSelf: 'flex-end',
    paddingRight: 10
  },
  popupStyle: {
    alignItems: 'center'
  },
  modelStyle: {
    backgroundColor: 'black'
  },
  fullView: {
    // backgroundColor: '#dcdcdc'
  },
  timeSheetStyle: {
    // borderWidth: 1,
    // borderColor: 'black',
    backgroundColor: '#B2EBF2',
    // borderRadius:4,
    // height: SCREEN_HEIGHT/4
  },
  timeSheetStyle2: {
    // borderWidth: 0.5,
    paddingBottom: 7,
    // borderColor: '#F39C12',
    backgroundColor: '#F39C12',
    // borderRadius: 5,
    height: 28,
    fontSize: 15,
    color: 'black',
  },
  timeSheetTextStyle: {
    fontSize: 15,
    color: 'black',
    paddingLeft: 5,
    paddingTop: 2,
    paddingBottom: 2
  },
  blank: {
    height: 15
  },
  taskStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  TimeSheetContainer: {
    // alignSelf: 'flex-start',
    position: 'relative',
    // bottom: 0,
    // left:0,
    // right:0
  },
  header: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A9CCE3',
    color: 'black',
    fontSize: 20,
    paddingLeft: 10,
  },
  TimeEntryheader: {
    height: 30,
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#A9CCE3',
    color: '#2471A3',
    fontSize: 12,
    paddingLeft: 20
  },
  empty: {
    color: '#A9CCE3'
  }
});

AppRegistry.registerComponent('TimeSheet', () => TimeSheet);