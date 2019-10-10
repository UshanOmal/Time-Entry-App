import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ImageBackground, Dimensions, AsyncStorage, } from 'react-native';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: "dataDB", createFromLocation: "~data.db" },
    this.openSuccess, this.openError);

class LoadingPage extends Component {


    static navigationOptions = {
        header: null,
        tabBarVisible: false
    }

    constructor(props) {
        super(props);
        this.navigate = this.props.navigation.navigate;
        this.state = {
            token: '',
            UserName: '',
            Password: '',
            userData: {}
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

    saveUser() {

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM users', [], (tx, results) => {
                var len = results.rows.length;
                if (len == 0) {

                    // tx.executeSql(
                    //     'INSERT INTO users (username, password) VALUES (?,?)', [userName, passWord],
                    //     (tx, results) => {
                    //         if (results.rowsAffected > 0) {
                    //             console.log('username not used');
                    //         }

                    //     }
                    // )
                    this.navigate('Auth');

                }
                else {
                    //this.navigate('DashBoard');
                    this.fetchData(results.rows.item(0).username, results.rows.item(0).password);

                }
            })
        })
    }


    fetchData(username, password) {
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
            .then((responseJson) => {
                if (responseJson.status != "Success") {
                    Alert.alert(
                        'Authentication Failed',
                        'Invalid User Name or Password / In Active User Account',
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: true },
                    );
                    this.navigate('Auth');
                }

                var UserName = username;
                this.setState({ token: responseJson });

                if (this.state.token.status === "Success") {
                    var Token = this.state.token.token
                    this.props.navigation.navigate('DashBoard', { TokenDashBoard: Token, UserName });
                }
            });
        //  Alert.alert('Please enter valid Username and Password')
    }

    render() {
        return (

            <View tyle={styles.container}>
                <Image
                    style={styles.ImageStyle}
                    source={require('../UI/components/Image/logo.png')}
                />
                {/* <Text style={styles.ImageStyle}>Loading...</Text> */}
            </View>
        );
    }
}

export default LoadingPage;

const styles = StyleSheet.create({
    ImageStyle: {
        position: 'absolute',
        top: 120,
        left: 50,
        bottom: 50,
        right: 50,
        backgroundColor: '#F5FCFF',


    },
    container1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        position: 'relative'

    },

})