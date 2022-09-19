/* eslint-disable prettier/prettier */
`use strict`;

import * as React from 'react';
import {View, ScrollView, StyleSheet, ImageBackground, Text, TouchableOpacity, Dimensions, Image, TextInput} from 'react-native';
import SyncStorage from 'sync-storage';

const {width, height} = Dimensions.get('window');

export default class Home extends React.Component {
    constructor(props){
        super(props);

        this.initStorage();

        let monthDict = {'January': 31, 'February': 28, 'March': 31, 'April': 30,
                'May': 31, 'June': 30, 'July': 31, 'August': 31, 'September': 30, 'October': 31,
                'November': 30, 'December': 31};
        let currentDate = new Date();
        let currentKey = Object.keys(monthDict)[currentDate.getMonth()] + "" + currentDate.getDate();
        let reminderData = ["Your reminders set in the Calendar will appear here. Press the bell icon to refresh."];
        let journalText = "";
        if (SyncStorage.getAllKeys().includes(currentKey)) {
            reminderData = SyncStorage.get(currentKey)[4];
            journalText = SyncStorage.get(currentKey)[0];
        }

        this.state = {
            monthDict: monthDict,
            currentDate: currentDate,
            modalDataKey: currentKey,
            journalText: journalText,
            reminderData: reminderData,
            daySelected: currentDate.getDate(),
            hasData: SyncStorage.getAllKeys().length,
        }
        //SyncStorage.set("temp", "temp");
    }

    async initStorage(){
        const data = await SyncStorage.init();
        console.log('AsyncStorage is ready!', data);
    }

    handleInput() {
        let data = ["",[],[],[],[]];
        if (SyncStorage.getAllKeys().includes(this.state.modalDataKey)) {
            data = SyncStorage.get(this.state.modalDataKey);
        }
        data[0] = this.state.journalText;
        SyncStorage.set(this.state.modalDataKey, data);
    }

    render() {
        let dateNow = new Date();
        let dateTomorrow = new Date(dateNow);
        dateTomorrow.setDate(dateTomorrow.getDate() + 1);
        let dateYesterday = new Date(dateNow);
        dateYesterday.setDate(dateYesterday.getDate() - 1);

        let currentKey = this.state.modalDataKey;
        let reminderData = ["Your reminders set in the Calendar will appear here. Press the bell icon to refresh."];
        let journalText = "";
        if (SyncStorage.getAllKeys().includes(currentKey)) {
            reminderData = SyncStorage.get(currentKey)[4];
            journalText = SyncStorage.get(currentKey)[0];
        }

        return (
            <View style = {styles.main}>
                <View>
                    <Image style={{ height: height, width: width, position: 'absolute', top:0, left:0 }} source={require('../assets/sky.png')} />
                </View>

                <ScrollView style={{ flex: 1, backgroundColor:'rgba(141,184,234,0.4)' }} contentContainerStyle={{ flexGrow: 1 }}>

                    <View style = {styles.calendarArea}>
                        <TouchableOpacity style = {[styles.buttonFloat2, {right: 0, bottom: 0, top: '5%', left: '12%', zIndex: 9,
                                                                            backgroundColor: dateYesterday.getDate() === this.state.daySelected ? 'rgb(238,206,34)' : 'lightgrey'}]}
                                          onPress = {() => {
                                              this.setState({daySelected: dateYesterday.getDate()});
                                              this.setState({modalDataKey: Object.keys(this.state.monthDict)[dateYesterday.getMonth()] + "" + dateYesterday.getDate()}) // forming syncstorage key format of month+date
                                              this.setState({journalText: this.state.journalText}); // used to force page update to display new state values
                                          }}>
                            <Text style = {[styles.buttonText, {fontSize: 25}]}>{dateYesterday.getDate()} </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style = {[styles.buttonFloat, {right: 0, bottom: 0, top: 0, left: '31%', zIndex: 9,
                                                                            backgroundColor: dateNow.getDate() === this.state.daySelected ? 'rgb(238,206,34)' : 'lightgrey'}]}
                                          onPress = {() => {
                                              this.setState({daySelected: dateNow.getDate()});
                                              this.setState({modalDataKey: Object.keys(this.state.monthDict)[dateNow.getMonth()] + "" + dateNow.getDate()}) // forming syncstorage key format of month+date
                        }}>
                            <Text style = {styles.buttonText}>{Object.keys(this.state.monthDict)[dateNow.getMonth()] + " \n" + dateNow.getDate() + " "} </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style = {[styles.buttonFloat2, {right: 0, bottom: 0, top: '5%', left: '77%', zIndex: 9,
                                                                            backgroundColor: dateTomorrow.getDate() === this.state.daySelected ? 'rgb(238,206,34)' : 'lightgrey'}]}
                                          onPress = {() => {
                                              this.setState({daySelected: dateTomorrow.getDate()});
                                              this.setState({modalDataKey: Object.keys(this.state.monthDict)[dateTomorrow.getMonth()] + "" + dateTomorrow.getDate()}) // forming syncstorage key format of month+date
                        }}>
                            <Text style = {[styles.buttonText, {fontSize: 25}]}>{dateTomorrow.getDate()} </Text>
                        </TouchableOpacity>

                        <View>
                            <View style={styles.journalContent} onPress = {() => {this.props.navigation.navigate('CalendarScreen');}}>
                                <View style={styles.reminder}>
                                    <ScrollView>
                                        <Text style={styles.reminderText}>{reminderData}</Text>
                                    </ScrollView>
                                </View>

                                <TouchableOpacity style={styles.reminderIcon} onPress={() => {
                                    this.setState({journalText: this.state.journalText})} // used to force page update to display new state values
                                }>
                                    <Image style={{width: '90%', height: '90%', alignSelf: 'center'}} source={require("../assets/reminders.png")}/>
                                </TouchableOpacity>

                                <TextInput style={styles.textInput}
                                           placeholder="How has your day been so far? Tap to view and edit today's journal entry"
                                           multiline={true}
                                           onPressIn={() => {
                                               this.setState({journalText: this.state.journalText})} // used to force page update to display new state values
                                           }
                                           onChangeText={(newText) => {this.setState({journalText: newText})}}
                                           defaultValue={journalText}>
                                </TextInput>

                                <View>
                                    <TouchableOpacity style={styles.journalButton} onPress={() => {this.handleInput()}}>
                                        <Text style = {styles.buttonText}> Save </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/*<View style={[styles.calendarButton, {height: '12%', width: '60%', marginTop: '12%', borderColor: 'black'}]}>*/}
                            {/*</View>*/}

                            <TouchableOpacity style={[styles.calendarButton, {height: '20%', padding:10, borderLeftWidth: 4, borderRightWidth: 4}]} onPress = {() => {this.props.navigation.navigate('CalendarScreen');}}>
                                <Text style = {styles.buttonText}>Full Calendar </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style = {styles.outcomesArea}>
                        <TouchableOpacity style = {styles.button} onPress = {() => {this.props.navigation.navigate('OutcomeMeasureScreen');}}>
                            <Text style = {styles.buttonText}> Well-being & Info </Text>
                        </TouchableOpacity>
                    </View>

                    <View style = {styles.dataArea}>
                        <TouchableOpacity style = {styles.button} onPress = {() => {this.props.navigation.navigate('StatisticsScreen');}}>
                            <Text style = {styles.buttonText}> Data </Text>
                        </TouchableOpacity>
                    </View>

                    {/*<View style = {styles.dataArea}>*/}
                    {/*    <TouchableOpacity style = {styles.button}>*/}
                    {/*        <Text style = {styles.buttonText}> Help &Advice </Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}

                </ScrollView>
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
        flex: 1,
        backgroundColor: 'transparent'
    },
    calendarArea: {
        alignSelf: 'center',
        justifyContent: 'center',
        height: 525,
        width: '90%',
        marginBottom: '10%',
        padding: 10,
        top: 20,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#1d274d',
        backgroundColor: 'rgba(248,235,124,0.7)',
    },
    calendarButton: {
        alignSelf: 'center',
        backgroundColor: 'rgb(141,184,234)',
        height: '60%',
        width: '90%',
        marginTop: '5%',
        borderRadius: 60,
        borderWidth: 0,
        borderColor: '#1d274d',
        justifyContent: 'center',
    },
    outcomesArea: {
        //flex: 1,
        height: 125,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 10,
        marginTop: 30,
    },
    dataArea: {
        //flex: 1,
        height: 125,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center',
        bottom: 5,
        padding: 10,
    },
    button: {
        alignSelf: 'center',
        backgroundColor: 'rgba(248,235,124,0.7)',
        height: '90%',
        width: '90%',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#1d274d',
        justifyContent: 'center',
    },
    buttonFloat: {
        backgroundColor: 'rgb(238,206,34)',
        height: 95,
        width: 147.5,
        position: 'absolute',
        borderRadius: 100,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderColor: '#1d274d',
        justifyContent: 'center',
    },
    buttonFloat2: {
        backgroundColor: 'rgb(238,206,34)',
        height: 45,
        width: 55,
        position: 'absolute',
        borderRadius: 100,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderColor: '#1d274d',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 30,
        fontFamily: 'VanDijkICG-Bold',
        alignSelf: 'center',
        textAlign: 'center',
        color: 'rgb(29,39,77)',
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
    journalContent: {
        justifyContent: 'center',
        alignSelf: 'center',
        height: '68%',
        width: '90%',
        marginTop: '16%',
        marginBottom: '10%',
        borderRadius: 20,
        borderWidth: 3,
        padding:10,
        borderColor: '#1d274d',
        backgroundColor: 'rgb(141,184,234)',
    },
    journalButton: {
        justifyContent: 'center',
        alignSelf: 'center',
        height: '40%',
        width: '60%',
        marginTop: '5%',
        marginBottom: '5%',
        borderRadius: 50,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderColor: '#1d274d',
        backgroundColor: 'rgb(238,206,34)',
    },
    textInput: {
        alignSelf: 'center',
        backgroundColor: 'white',
        width: '90%',
        height: '57%',
        marginTop: '4%',
        fontSize: 16,
        borderRadius: 10,
    },
    reminder: {
        height: '15%',
        width: '75%',
        flexDirection: 'row',
        marginTop: '65%',
        marginLeft: '20%',
        //alignSelf: 'center',
        borderRadius: 100,
        borderWidth: 1,
        backgroundColor: 'rgb(252,245,220)',
    },
    reminderText: {
        alignSelf: 'center',
        width: '90%',
        marginLeft: '5%',
        fontSize: 13,
        color: 'black',
    },
    reminderIcon: {
        position: 'absolute',
        width: 46,
        height: 46,
        top: '19%',
        left: '7.5%',
        borderRadius: 30,
        borderWidth: 1,
        backgroundColor: 'rgb(238,206,34)',
    },
});
