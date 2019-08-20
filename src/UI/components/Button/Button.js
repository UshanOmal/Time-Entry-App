import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({onPress, children}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.buttonStyle}>
            <Text style={styles.textStyle}>
                {children}
            </Text>
        </TouchableOpacity>
    )
}


const styles = {
    textStyle: {
        alignSelf: 'center',
        color: '#ffff',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },
    buttonStyle: {
        backgroundColor: '#00ced1',
        borderRadius: 5,
        width: 250,
        borderColor: '#00ffff',
        borderWidth: 1
    }
}

export default Button;