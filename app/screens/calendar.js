/* eslint-disable prettier/prettier */
`use strict`;

import * as React from 'react';
import {View, StyleSheet, ImageBackground, Text, TouchableOpacity, Image, Modal, TextInput, Dimensions} from 'react-native';
import SyncStorage from 'sync-storage';
import DatePicker from 'react-native-date-picker';
import CalendarMatrix from '../components/calendarMatrix';

const {width, height} = Dimensions.get('window');

export default class Calendar extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            modalVisible: false,
            dateSelected: new Date(),
            reminderText: "",
        }
    }

    handleInput() {
        let months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']
        let dateSelectedFull = this.state.dateSelected;
        let monthSelected = months[dateSelectedFull.getMonth()];
        let timeSelected = dateSelectedFull.toTimeString().substring(0, 5);
        let key = monthSelected + "" + dateSelectedFull.getDate();

        if (SyncStorage.getAllKeys().includes(key)) { // interaction with syncstorage will depend on if some data for day already exists
            let data = SyncStorage.get(key);
            data[4].push([timeSelected + " ", this.state.reminderText + "\n"]) // string formatting important for displaying later
            SyncStorage.set(key, data);
        } else {
            let data = ["", 0, [], [], []] // no existing data, must initialise storage format
            data[4].push([timeSelected + " ", this.state.reminderText + "\n"]) // string formatting important for displaying later
            SyncStorage.set(key, data);
        }

    }

    render() {
        let dateNow = new Date();

        return (
            <View style={styles.main}>
                <View style={styles.calendarArea}>
                    <CalendarMatrix/>
                </View>
                <TouchableOpacity style = {[styles.buttonFloat, {left: 15, right: 0}]} onPress = {() => {this.setState({modalVisible: true})}}>
                    <Image source={require("../assets/reminders2.png")} style={{width: '100%', height: '100%'}}/>
                </TouchableOpacity>

                <View style={styles.modalArea}>
                    <Modal animationType="fade"
                           visible={this.state.modalVisible}
                           transparent={true}
                           statusBarTranslucent={true}
                           onRequestClose={() => {
                               this.setState({modalVisible: false});
                           }}>

                        <View style={styles.modal}>
                            <View style={styles.modalContent}>
                                <Text style={[styles.buttonText, {marginTop: '-5%', marginBottom: '4%'}]}>Set New Reminder </Text>

                                <TextInput style={styles.textInput}
                                           placeholder="Enter a message"
                                           multiline={true}
                                           onChangeText={(newText) => {this.setState({reminderText: newText})}}>
                                </TextInput>

                                <DatePicker
                                    style={styles.datePicker}
                                    date={this.state.dateSelected}
                                    onDateChange={(x) => this.setState({dateSelected: x})}
                                    fadeToColor={'rgb(217,203,98)'}
                                    minimumDate={dateNow}
                                    dividerHeight={5}
                                />

                                <View style={styles.modalButton}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({modalVisible: false});
                                        this.handleInput();
                                    }}>
                                        <Text style={[styles.buttonText, {color: 'black', fontSize: 26}]}>Save </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </Modal>
                </View>

                <TouchableOpacity style = {styles.buttonFloat} onPress = {() => {this.props.navigation.navigate('HomeScreen');}}>
                    <Text style = {styles.buttonText}>Home </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        height: '100%',
        width: '100%',
    },
    main: {
        //justifyContent: 'center',
        backgroundColor:'rgb(141,184,234)',
        height: '100%',
        width: '100%',
    },
    calendarArea: {
        alignSelf: 'center',
        height: '100%',
        width: '100%',
        marginTop: '10%',
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 30,
        fontFamily: 'VanDijkICG-Bold',
        color: 'rgb(77,72,29)',
    },
    buttonFloat: {
        backgroundColor: 'rgb(248,231,85)',
        height: 85,
        width: 85,
        bottom: 15,
        right: 15,
        position: 'absolute',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
    },
    datePicker: {
        width: (width/4)*3,
        height: height/5,
        borderRadius: 10,
        marginTop: '5%',
    },
    modalArea: {
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    modal: {
        justifyContent: 'center',
        height: height,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
        alignSelf: 'center',
        justifyContent: 'center',
        height: '54%',
        width: '75%',
        marginTop: '-10%',
        borderRadius: 50,
        backgroundColor: 'rgb(255,242,167)',
    },
    modalButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        height: '20%',
        width: '40%',
        marginTop: '5%',
        marginBottom: '-20%',
        borderRadius: 50,
        borderWidth: 2,
        backgroundColor:'rgb(141,184,234)',
    },
    textInput: {
        width: '90%',
        height: '25%',
        alignSelf: 'center',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgb(77,72,29)',
        backgroundColor: 'white',
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
        alignSelf: 'center',
        textAlign: 'center',
    },
    subtext: {
        fontSize: 26,
        fontFamily: 'VanDijkICG-Bold',
        color: 'rgb(251,247,59)',
        width: '100%',
        alignSelf: 'center',
        textAlign: 'center',
    },
});
