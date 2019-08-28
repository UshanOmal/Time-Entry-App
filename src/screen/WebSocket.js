import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ImageBackground, Dimensions, AsyncStorage, } from 'react-native';
import moment from 'moment';
import Button from '../UI/components/Button/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

class WebSocket extends Component {

    constructor() {
        var ws = new WebSocket('ws://localhost:8088');

        ws.onopen = () => {
            // connection opened
            ws.send('something'); // send a message
        };

        ws.onmessage = (e) => {
            // a message was received
            console.log(e.data);
        };

        ws.onerror = (e) => {
            // an error occurred
            console.log(e.message);
        };

        ws.onclose = (e) => {
            // connection closed
            console.log(e.code, e.reason);
        };
    }

    render() {
        return (
            <View>

            </View>
        );
    }


}

export default WebSocket;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
        // height: 200
        // backgroundColor: "#e6e6fa"
    },
    container2: {
        // flex: 1,
        backgroundColor: "#e6e6fa",
        borderRadius: 2,
        width: SCREEN_WIDTH - 20,
        height: 200,
        // alignItems: 'flex-start',
        textAlignVertical: 'top'

    }
})