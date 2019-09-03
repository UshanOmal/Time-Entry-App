import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, Button, Alert, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TimeSheet from './TimeSheet';

var SQLite = require('react-native-sqlite-storage')

export default class DashBoard extends Component {



  static navigationOptions = {
    tabBarVisible: true,
    title: 'DashBoard',
    headerStyle: {
      backgroundColor: '#A9CCE3'
    },
  }

  componentDidMount() {
  }

  signOut = () => {
    console.log(this.params.UserName);
    var db = SQLite.openDatabase({ name: "dataDB", createFromLocation: "~data.db" },
      this.openSuccess, this.openError);

    db.transaction((tx) => {
      tx.executeSql('DELETE FROM users WHERE username=?', [this.params.UserName], (tx, results) => {
        //tx.executeSql('DELETE FROM users WHERE username=?',['lakshitha'],(tx,results) =>{
        // tx.executeSql('SELECT * FROM users',[],(tx,results) =>{
        //   for(var i=0;i<results.rows.length;i++){
        //     console.log(results.rows.item(i).username);
        //   }

      })
    })
    this.navigate('Auth');

  };

  openSuccess() {
    console.log("Database is opened");
  }

  openError(err) {
    console.log("error: ", err);
  }

  constructor(props) {

    super(props);
    this.navigate = this.props.navigation.navigate;
    this.params = this.props.navigation.state.params,

      this.state = {
        // Token: this.props.navigation.state.params.token,
        user: []
      };

  }

  componentWillMount() {
    this.fetchData();
  }


  fetchData = async () => {

    fetch('https://onejit.jithpl.com/integration/login/getLoginUser', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.params.TokenDashBoard,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          user: responseJson
        })
      })

  }

  render() {
    const { navigate } = this.props.navigation;
    var TokenTimeSheet = this.params.TokenDashBoard;
    return (

      <View style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={() => this.signOut()}>
            <Text style={{ color: 'red', fontWeight: 'bold', paddingLeft: 20, }}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.textStyle}>
            Hi {this.state.user.firstName}...
            </Text>
        </View>
        <View style={styles.pageView}>
          <View style={styles.rowView}>
            <View style={styles.imageView}>
              <TouchableOpacity onPress={() => navigate('TimeSheet', { TokenTimeSheet })}>
                <Image
                  style={styles.ImageStyle}
                  source={require('../UI/components/Image/timeEntry.png')}
                />
                <Text style={styles.ImageTextStyle}>
                  Time Entry
                    </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageView}>
              <TouchableOpacity onPress={() => navigate('WebSocket', { TokenTimeSheet })}>
                <Image
                  style={styles.ImageStyle}
                  source={require('../UI/components/Image/pettyCash.png')}
                />
                <Text style={styles.ImageTextStyle}>
                  Petty Cash
                    </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowView}>
            <View style={styles.imageView}>
              <TouchableOpacity>
                <Image
                  style={styles.ImageStyle}
                  source={require('../UI/components/Image/medicalClaim.png')}
                />
                <Text style={styles.ImageTextStyle}>
                  Medical Claim
                    </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageView}>
              <TouchableOpacity>
                <Image
                  style={styles.ImageStyle}
                  source={require('../UI/components/Image/salseManager.png')}
                />
                <Text style={styles.ImageTextStyle}>
                  Sales Manager
                    </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

    );
  }
}
//export default DashBoard;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#dcdcdc'
  },
  textStyle: {
    paddingTop: 10,
    alignSelf: 'flex-end',
    paddingRight: 20,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  pageView: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 50,
    borderRadius: 6
  },
  rowView: {
    flexDirection: 'row',
  },
  ImageStyle: {
  },
  imageView: {
    flex: 3,
    borderWidth: 2,
    borderColor: '#808B96',
    // height: '70 %' ,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
    // backgroundColor: '#ffffff',
    borderRadius: 6
  },
  ImageTextStyle: {
    // borderWidth: 1,
    // borderColor: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black'
  },
  signOut: {
    fontWeight: 'bold',
    paddingLeft: 5,
    color: 'black'

  }
})
