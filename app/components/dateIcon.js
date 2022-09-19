/* eslint-disable prettier/prettier */
`use strict`;

import * as React from 'react';
import {View, StyleSheet, ImageBackground, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import SyncStorage from 'sync-storage';

const {width, height} = Dimensions.get('window');

export default class DateIcon extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDay: props.currentDay,
            currentMonth: props.currentMonth,
            lens: props.lens,
        };
    }

    render() {
        //console.log("vars", this.currentMonth, this.currentDay, this.lens)
        let key = this.state.currentMonth + "" + this.state.currentDay; // unique key to access syncstorage
        const dateToday = new Date();
        const iconDiameter = width/12; // ensures proportionality to screen size
        if (SyncStorage.getAllKeys().includes(key) && this.state.lens === "Reminders") {
            return (
                <View style={{justifyContent: 'center', alignContent: 'center'}}>
                    <View style={[styles.dateIcon, {backgroundColor: 'rgba(253,219,100,0.6)', top: height/24, left: width/72}]}>
                        <Image source={require("../assets/reminders.png")} style={{width: iconDiameter, height: iconDiameter}}/>
                    </View>
                </View>
            );
        } else if (SyncStorage.getAllKeys().includes(key) && this.state.lens === "Symptoms") {
            let symptoms = SyncStorage.get(key)[2];
            let symptomNum = symptoms.length;
            if (symptomNum > 0) {
                return (
                    <View>
                        <View style={[styles.dateIcon, {backgroundColor: 'rgba(88,133,172, 0.6)', width: iconDiameter, height: iconDiameter, top: height / 24, left: width / 72}]}>
                            <Text style={{alignSelf: 'center', fontSize: 20, fontWeight: 'bold'}}>{symptomNum}</Text>
                        </View>
                    </View>
                );
            } else { return null }
        } else if (SyncStorage.getAllKeys().includes(key) && this.state.lens === "Stress") {
            let stressLevel = SyncStorage.get(key)[1];
            if (stressLevel > 0) {
                let stressLevelRound = Math.round(stressLevel * 100);
                return (
                    <View>
                        <View style={[styles.dateIcon, {backgroundColor: 'rgba(241,159,52, 0.6)', width: iconDiameter, height: iconDiameter, top: height / 24, left: width / 72}]}>
                            <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: 'bold'}}>{stressLevelRound}%</Text>
                        </View>
                    </View>
                );
            } else { return null }
        } else { return null }
    }
}
