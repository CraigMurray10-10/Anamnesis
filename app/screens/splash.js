/* eslint-disable prettier/prettier */
`use strict`;

import * as React from 'react';
import {View, StyleSheet, ImageBackground, Text, TouchableOpacity} from 'react-native';
import CalendarMatrix from './app/components/calendarMatrix';

const Splash = ({navigation}) => {
    return (
        <ImageBackground style={styles.background} source={require('./app/assets/coffee.png')} resizeMode='cover' blurRadius={1}>
            <View style={styles.main}>
                <View style={styles.textArea}>
                    <Text style={styles.text}>Anamnesis</Text>
                    <Text style={styles.subtext}>Carers' Notebook and Support</Text>
                </View>
                <View style={styles.buttonArea}>
                    <View style={styles.textArea}>
                        <CalendarMatrix style={styles.subtext}/>
                    </View>
                    {/*<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.buttonText}>Start!</Text>
            </TouchableOpacity>*/}
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        height: '100%',
        width: '100%',
    },
    main: {
        //justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        height: '100%',
        width: '100%',
    },
    buttonArea: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        alignSelf: 'center',
        backgroundColor: 'rgb(207,198,110)',
        height: '25%',
        width: '50%',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#4c471e',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 35,
        fontFamily: 'VanDijkICG-Bold',
        color: 'rgb(77,72,29)',
        alignSelf: 'center',
    },
    textArea: {
        flex: 3,
        justifyContent: 'center',
        textAlign: 'center',
    },
    text: {
        fontSize: 66,
        fontFamily: 'VanDijkICG-Bold',
        textShadowColor: 'rgb(29,26,12)',
        textShadowOffset: {width: 5, height: 5},
        textShadowRadius: 1,
        color: 'rgb(253,249,58)',
        width: '100%',
        //backgroundColor: 'rgba(30, 215, 96, 0.5)',
        alignSelf: 'center',
        textAlign: 'center',
    },
    subtext: {
        fontSize: 26,
        fontFamily: 'VanDijkICG-Bold',
        //textShadowColor: 'rgb(102,95,36)',
        //textShadowOffset: {width: 6, height: 6},
        //textShadowRadius: 1,
        color: 'rgb(251,247,59)',
        width: '100%',
        //backgroundColor: 'rgba(30, 215, 96, 0.5)',
        alignSelf: 'center',
        textAlign: 'center',
    },
});

export default Splash;
