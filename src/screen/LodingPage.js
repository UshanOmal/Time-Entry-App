import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ImageBackground, Dimensions, AsyncStorage, } from 'react-native';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: "dataDB", createFromLocation: "~data.db" },
this.openSuccess, this.openError);

class LoadingPage extends Component {
  

    static navigationOptions={ 
        header:null,
        tabBarVisible:false 
    }

    constructor(props) {
        super(props);
        this.navigate=this.props.navigation.navigate;
        this.state = {
            token: '',
            UserName: '',
            Password: '',
            userData: { }
        }    
    }

    componentDidMount() {
        // this.getToken();
        db = SQLite.openDatabase({ name: "dataDB", createFromLocation: "~data.db" },
            this.openSuccess, this.openError);
        this.saveUser();
        //this.delete();

    }


    openSuccess() {
        console.log("Database is opened");
    }

    openError(err) {
        console.log("error: ", err);
    }
    // delete(){
    //     db.transaction((tx)=>{
    //         //tx.executeSql('DELETE FROM users WHERE username=?',[this.params.UserName],(tx,results) =>{
    //         tx.executeSql('DELETE FROM users WHERE username=?',['viet'],(tx,results) =>{
    //           // tx.executeSql('SELECT * FROM users',[],(tx,results) =>{
    //           //   for(var i=0;i<results.rows.length;i++){
    //           //     console.log(results.rows.item(i).username);
    //           //   }
                
    //         })
    //     })
    // }

    saveUser(){

        db.transaction((tx)=>{
            tx.executeSql('SELECT * FROM users',[],(tx,results) =>{
                var len = results.rows.length;
                if(len==0){

                    // tx.executeSql(
                    //     'INSERT INTO users (username, password) VALUES (?,?)', [userName, passWord], 
                    //     (tx, results) => {
                    //         if (results.rowsAffected > 0) {
                    //             console.log('username not used');
                    //         }
                            
                    //     }
                    // )
                    console.log('This username is not used ' +len);
                    this.navigate('Auth');

                }
                else{
                    console.log('This username is used '+len);
                    //this.navigate('DashBoard');
                    this.fetchData(results.rows.item(0).username,results.rows.item(0).password);

                }
            })
        })
    }


    fetchData (username,password) {
        const { navigate } = this.props.navigation;
            fetch('https://onejit.jithpl.com/integration/login/getToken', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserName: username,
                    Password: password
                })
            })
            .then(response => response.json())
            .then(( responseJson ) => {
                var UserName = username;
                this.setState ({token: responseJson});
    
                if (this.state.token.status === "Success" ) {
                    var Token =  this.state.token.token
                    this.props.navigation.navigate('DashBoard', { TokenDashBoard:Token,UserName});
                }   
            });
            //  Alert.alert('Please enter valid Username and Password') 
    }

render () {
  return(
    <View>
        {/* <ImageBackground source = {require('../UI/components/Image/background.png')} style={styles.backgroundImage}> */}
    
        {/* <Image 
                        style={styles.ImageStyle}
                        source={require('../UI/components/Image/timeEntry.png')}
                    /> */}
    </View>
  );
}



  }

  export default LoadingPage;