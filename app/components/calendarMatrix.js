/* eslint-disable prettier/prettier */
`use strict`;
import * as React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    Dimensions,
    ScrollView,
    Image,
} from 'react-native';
import SyncStorage from 'sync-storage';
import LinearGradient from "react-native-linear-gradient";
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';

const {width, height} = Dimensions.get('window');

const DateIcon = (props) => { // component rendering icons conditionally on current lens setting & stored user input
    let currentDay = props.currentDay;
    let currentMonth = props.currentMonth;
    let lens = props.lens; // reminders, symptoms or stress levels
    let key = currentMonth + "" + currentDay; // unique key to access syncstorage
    const iconDiameter = width/12; // ensures proportionality to screen size
    if (SyncStorage.getAllKeys().includes(key) && lens === "Reminders") {
        let reminders = SyncStorage.get(key)[4];
        if (reminders.length > 0) {
            return (
                <View style={{justifyContent: 'center', alignContent: 'center'}}>
                    <View style={[styles.dateIcon, {
                        backgroundColor: 'rgba(253,219,100,0.6)',
                        top: height / 24,
                        left: width / 72
                    }]}>
                        <Image source={require("../assets/reminders.png")}
                               style={{width: iconDiameter, height: iconDiameter}}/>
                    </View>
                </View>
            );
        } else { return null }
    } else if (SyncStorage.getAllKeys().includes(key) && lens === "Symptoms") {
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
    } else if (SyncStorage.getAllKeys().includes(key) && lens === "Stress") {
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

export default class CalendarMatrix extends React.Component {
    constructor(props) {
        super(props);
        const monthDict = {'January': 31, 'February': 28, 'March': 31, 'April': 30,
            'May': 31, 'June': 30, 'July': 31, 'August': 31, 'September': 30, 'October': 31,
            'November': 30, 'December': 31};
        const validCalendarDays = [];
        for (let i = 1; i <= 31; i++) {
            validCalendarDays.push(i);
        }
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        SyncStorage.set("temp", "");

        this.state = {
            monthDict: monthDict,
            days: days,
            validCalendarDays: validCalendarDays,
            currentDate: new Date(),
            modalDate: "",
            modalDataKey: "temp",
            modalDataValue: [],
            modalVisible: false,
            modalSymptomsVisible: false,
            journalText: "aaa",
            sliderValue: 0,
            dropdownActiveSymptoms: false,
            dropdownValueSymptoms: null,
            symptomButtonValues: [],
            symptomButtonSeverities: [],
            dropdownActiveSeverity: false,
            dropdownValueSeverity: null,
            symptomTypes: [{label: "Aberrant motor behavior", value: "Aberrant motor behavior"}, {label: "Agitation/aggression", value: "Agitation/aggression"},
                {label: "Anxiety", value: "Anxiety"}, {label: "Apathy", value: "Apathy"},
                {label: "Appetite and eating change", value: "Appetite and eating change"},
                {label: "Delusions", value: "Delusions"}, {label: "Disinhibition", value: "Disinhibition"},
                {label: "Dysphoria/depression", value: "Dysphoria/depression"},
                {label: "Euphoria", value: "Euphoria"}, {label: "Hallucinations", value: "Hallucinations"},
                {label: "Irritability", value: "Irritability"}, {label: "Sleep and night-time behavior change", value: "Sleep and night-time behavior change"}],
            severityTypes: [{label: "1 - Mild", value: 1}, {label: "2 - Moderate", value: 2}, {label: "3 - Severe", value: 3}],
            currentLens: " ",
        };
    }

    createCalendarMatrix = () => {
        let calendar = [];
        calendar[0] = this.state.days;

        let months = Object.keys(this.state.monthDict);
        let currentMonthVal = this.state.currentDate.getMonth(); // returns int from 0-11
        let currentMonthString = months[this.state.currentDate.getMonth()]; // convert to string based on array index

        let currentYear = this.state.currentDate.getFullYear();
        let monthStart = new Date(currentYear, currentMonthVal, 1).getDay() - 1; // gets day of the month's 1st to use as
        let totalDays = this.state.monthDict[currentMonthString];                      // initial place to insert calendar days from

        let dayCount = 1;
        for (let currentRow = 1; currentRow < 7; currentRow++) { // generates matrix & fills with dates in specific layout for current month
            calendar[currentRow] = [];
            for (let currentColumn = 0; currentColumn < 7; currentColumn++) {
                calendar[currentRow][currentColumn] = '';
                if (currentRow === 1 && currentColumn >= monthStart)
                    calendar[currentRow][currentColumn] = dayCount++;
                else if (currentRow > 1 && dayCount <= totalDays)
                    calendar[currentRow][currentColumn] = dayCount++;
            }
        }
        return calendar;
    };

    updateDate = (currentDay) => {
        this.setState(() => {
            if (!currentDay.match && currentDay != -1) {
                this.state.currentDate.setDate(currentDay);
                return this.state;
            }
        });
    };

    changeMonth = (x) => { // allows app to show calendar dates for months other than current
        this.setState(() => {
            this.state.currentDate.setMonth(
                this.state.currentDate.getMonth() + x
            );
            return this.state;
        });
    };

    // called by 'save' button on modal to store user input to sync storage.
    // necessary in order to remember each day's individual data for displaying & later use
    handleInput = () => {
        let reminders = [];
        if (SyncStorage.getAllKeys().includes(this.state.modalDataKey)) {
            let data = SyncStorage.get(this.state.modalDataKey); // must retrieve existing reminders so they are not overwritten.
            reminders = data[4]; // must get from var and not directly from storage in case it is not yet defined i.e no reminders set yet
        }
        SyncStorage.set(this.state.modalDataKey, [this.state.journalText, this.state.sliderValue,
            this.state.symptomButtonValues, this.state.symptomButtonSeverities, reminders]);
    }

    getWidth() { // fit slider's int value to screen width to display stress meter
        return this.state.sliderValue * (width * 0.7);
    }

    // set of methods required by & passed to dropdown component for symptom *type* selector
    toggleDropdownActiveSymptoms(isActive) {
        this.setState({dropdownActiveSymptoms: isActive})
    }

    setDropdownValueSymptoms(callback) {
        this.setState(state => ({dropdownValueSymptoms: callback(state.dropdownValueSymptoms)}));
    }

    setDropdownItemsSymptoms(callback) {
        this.setState(state => ({symptomTypes: callback(state.symptomTypes)}));
    }

    // set of methods required by & passed to dropdown component for symptom *severity* selector
    toggleDropdownActiveSeverity(isActive) {
        this.setState({dropdownActiveSeverity: isActive})
    }

    setDropdownValueSeverity(callback) {
        this.setState(state => ({dropdownValueSeverity: callback(state.dropdownValueSeverity)}));
    }

    setDropdownItemsSeverity(callback) {
        this.setState(state => ({severityTypes: callback(state.severityTypes)}));
    }

    removeFromSymptomArrays(index) { // used in symptom adder buttons to remove an added symptom by modifying array states. avoids splicing from state variable directly.
        let values = this.state.symptomButtonValues;
        let severities = this.state.symptomButtonSeverities;
        values.splice(index, 1); // (index, amount to remove)
        severities.splice(index, 1); // (index, amount to remove)
        this.setState({symptomButtonValues: values});
        this.setState({symptomButtonSeverities: severities});
    }

    render() {
        let calendar = this.createCalendarMatrix();
        let count = 0;
        let rows = [];

        rows = calendar.map((currentRow, rowIndex) => {
            let rowDays = currentRow.map((currentDay, columnIndex) => {
                return (
                    <View key = {count++}>
                        <Text
                            style={{ // applies to each calendar date button
                                flex: 1,
                                textAlign: 'center',
                                backgroundColor: rowIndex === 0 ? '#ddd' : 'rgba(106,157,208,0.3)',
                                borderColor: 'rgba(12,37,48,0.9)',
                                color: columnIndex === 0 ? '#a00' : '#000',
                                width: 45,
                                height: 63,
                                borderWidth: 1,
                                fontSize: 18,
                                marginBottom: -30,
                                borderRadius: 10,
                                padding: 1,
                                fontWeight: currentDay === this.state.currentDate.getDate() ? 'bold' : 'normal', // bolds current day
                            }}
                            onPress={() => { // applies to each calendar date button
                                if(this.state.validCalendarDays.includes(currentDay)) {
                                    let months = Object.keys(this.state.monthDict);
                                    this.updateDate(currentDay);
                                    this.setState({modalVisible: true});
                                    this.setState({modalDate: currentDay});
                                    let key = months[this.state.currentDate.getMonth()] + "" + currentDay;
                                    this.setState({modalDataKey: key}, () => {
                                        try {
                                            this.setState({journalText: SyncStorage.get(this.state.modalDataKey)[0]});
                                            this.setState({sliderValue: SyncStorage.get(this.state.modalDataKey)[1]});
                                            this.setState({symptomButtonValues: SyncStorage.get(this.state.modalDataKey)[2]})
                                            this.setState({symptomButtonSeverities: SyncStorage.get(this.state.modalDataKey)[3]})
                                        } catch(err) {
                                            console.log(err);
                                            console.log("Journal storage not yet initialised, proceeding with temporary values");
                                            this.setState({journalText: ""});
                                            this.setState({sliderValue: 0});
                                            this.setState({symptomButtonValues: []});
                                            this.setState({symptomButtonSeverities: []});
                                        }
                                    });
                                }
                            }}
                            key = {count++}>
                            {currentDay !== -1 ? currentDay : ''}
                            {"\n"}
                            <DateIcon currentDay={currentDay}
                                      currentMonth={Object.keys(this.state.monthDict)[this.state.currentDate.getMonth()]}
                                      lens={this.state.currentLens}/>
                        </Text>
                    </View>
                );
            });

            let currentKey = Object.keys(this.state.monthDict)[this.state.currentDate.getMonth()] + "" + this.state.currentDate.getDate();
            let reminderData = [];
            if (SyncStorage.getAllKeys().includes(currentKey)) {
                reminderData = SyncStorage.get(currentKey)[4];
            }

            return (
                <View key = {count++}>
                    <View style={styles.modalArea} key = {count++}>
                        <Modal animationType="fade"
                               visible={this.state.modalVisible}
                               transparent={true}
                               statusBarTranslucent={true}
                               onRequestClose={() => {
                                   this.setState({modalVisible: false});
                               }}>
                            <View style={styles.modal}>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalDate}>
                                        <Text style={styles.text}>
                                            {Object.keys(this.state.monthDict)[this.state.currentDate.getMonth()] + " \n"}
                                            {this.state.modalDate + " "}
                                        </Text>
                                    </View>

                                    <View style={styles.reminder}>
                                        <ScrollView>
                                            <Text style={styles.reminderText}>{reminderData}</Text>
                                        </ScrollView>
                                    </View>

                                    <TextInput style={styles.textInput}
                                               placeholder="How has your day been?"
                                               multiline={true}
                                               onChangeText={(newText) => {this.setState({journalText: newText})}}
                                               defaultValue={this.state.journalText}>
                                    </TextInput>

                                    <View style={{height: '5%',  width: '90%', position: 'absolute', bottom: '0%', left: '4%', borderRadius: 20, zIndex: -1,}}>
                                        <LinearGradient colors={['rgba(0, 255, 3, 0.5)', 'rgba(226, 255, 70, 1)', 'rgba(255, 0, 0, 0.75)']}
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 1, y: 0}}
                                                        style={{height:'100%', width: '100%', borderRadius: 20}}>
                                        </LinearGradient>
                                    </View>

                                    <View style={{height: '5%',  width: 288 - this.getWidth() - 10, position: 'absolute',
                                                bottom: '0.4%', right: '-3%', borderRadius: 20, zIndex: -1,}}>
                                        <Text style={{fontSize: 0}}>{this.getWidth().toString()}a</Text>
                                        <View style={{backgroundColor: 'rgb(169,206,250)', height:'100%', width: '90%', borderTopRightRadius: 20, borderBottomRightRadius: 20}}>
                                        </View>
                                    </View>

                                    <View style={styles.symptomsAdder}>
                                        <View style={{width: '45%'}}>
                                            <DropDownPicker
                                                style={{height: '100%'}}
                                                listMode="MODAL"
                                                placeholder={"Add a symptom"}
                                                labelProps={{numberOfLines: 2}}
                                                textStyle={{fontSize: 14}}
                                                open={this.state.dropdownActiveSymptoms}
                                                value={this.state.dropdownValueSymptoms}
                                                items={this.state.symptomTypes}
                                                setOpen={(x) => {this.toggleDropdownActiveSymptoms(x)}}
                                                setValue={(x) => {this.setDropdownValueSymptoms(x)}}
                                                setItems={(x) => {this.setDropdownItemsSymptoms(x)}}
                                            />
                                        </View>
                                        <View style={{width: '40%'}}>
                                            <DropDownPicker
                                                style={{height: '100%'}}
                                                listMode="MODAL"
                                                labelProps={{numberOfLines: 2}}
                                                textStyle={{fontSize: 14}}
                                                placeholder={"Severity"}
                                                open={this.state.dropdownActiveSeverity}
                                                value={this.state.dropdownValueSeverity}
                                                items={this.state.severityTypes}
                                                setOpen={(x) => {this.toggleDropdownActiveSeverity(x)}}
                                                setValue={(x) => {this.setDropdownValueSeverity(x)}}
                                                setItems={(x) => {this.setDropdownItemsSeverity(x)}}
                                            />
                                        </View>
                                        <View style={{width: '15%'}}>
                                            <TouchableOpacity style={{width: '100%', height: '100%', justifyContent: 'center'}}
                                                onPress={() => {
                                                    let values = this.state.symptomButtonValues;
                                                    let severities = this.state.symptomButtonSeverities;
                                                    if (this.state.dropdownValueSymptoms === null || this.state.dropdownValueSeverity === null) {
                                                        alert("Symptom type and severity cannot be blank, please enter a value for both.");
                                                    } else if (values.includes(this.state.dropdownValueSymptoms)) {
                                                        alert("Symptom type '" + this.state.dropdownValueSymptoms + "' already added, please select a different type or press the remove icon on the existing button.");
                                                    } else {
                                                        values.push(this.state.dropdownValueSymptoms);
                                                        severities.push(this.state.dropdownValueSeverity);
                                                        this.setState({symptomButtonValues: values});
                                                        this.setState({symptomButtonSeverities: severities});
                                                    }
                                                }}>
                                                <Text> Add</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.symptomsArea}>
                                        <ScrollView horizontal={true}>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(0);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={2}>{this.state.symptomButtonValues[0]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[0] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[0]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(1);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={2}>{this.state.symptomButtonValues[1]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[1] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[1]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(2);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={2}>{this.state.symptomButtonValues[2]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[2] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[2]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(3);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={2}>{this.state.symptomButtonValues[3]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[3] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[3]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(4);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={2}>{this.state.symptomButtonValues[4]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[4] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[4]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(5);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={2}>{this.state.symptomButtonValues[5]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[5] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[5]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(6);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={2}>{this.state.symptomButtonValues[6]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[6] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[6]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(7);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={6}>{this.state.symptomButtonValues[7]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[7] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[7]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(8);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={7}>{this.state.symptomButtonValues[8]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[8] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[8]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(9);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={2}>{this.state.symptomButtonValues[9]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[9] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[9]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(10);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={2}>{this.state.symptomButtonValues[10]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[10] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[10]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.symptomsButtonView}>
                                                <TouchableOpacity style={{height: '100%', width: '100%', justifyContent: 'center'}} onPress={() => {
                                                    this.removeFromSymptomArrays(11);
                                                }}>
                                                    <Text style={styles.symptomsButtonText} numberOfLines={2}>{this.state.symptomButtonValues[11]}</Text>
                                                    <Text style={styles.symptomsButtonText}>{this.state.symptomButtonValues[11] === undefined ? "" : "Severity:" + this.state.symptomButtonSeverities[11]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </ScrollView>
                                    </View>

                                    <Text style={styles.text2}>{"Caregiver Stress level:"}</Text>

                                    <View>
                                        <Slider
                                            style={{width:  "90%", height: 10, top: 12, alignSelf: 'center', position: 'absolute', zIndex: -1,}}
                                            minimumTrackTintColor="rgba(0,0,0,0.1)"
                                            maximumTrackTintColor="rgba(0,0,0,0.5)"
                                            thumbTintColor='rgba(0,0,0,0.5)'
                                            onValueChange={value => this.setState({sliderValue: value})}
                                        />
                                    </View>
                                </View>

                                <View style={styles.reminderIcon}>
                                    <Image style={{width: '90%', height: '90%', alignSelf: 'center'}} source={require("../assets/reminders.png")}/>
                                </View>

                                <TouchableOpacity style={styles.modalButton} onPress={() => {
                                    this.setState({modalVisible: false});
                                    this.handleInput();
                                }}>
                                    <Text style={styles.modalText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            padding: 15,
                            width: '100%',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}
                        key = {count++}>
                        {rowDays}
                    </View>
                </View>
            );
        });

        return (
            <View style={styles.calendarArea}>
                <Text style = {styles.headerText}>
                    {Object.keys(this.state.monthDict)[this.state.currentDate.getMonth()] + ' '}
                    {this.state.currentDate.getFullYear()}
                    {"\n"}
                    {rows}
                </Text>

                <View style={{marginTop: 28, flexDirection: 'row', alignSelf: 'center'}}>
                    <TouchableOpacity style = {{}} onPress={() => this.changeMonth(-1)}>
                        <Text style={[styles.text, {fontSize: 22, marginTop: '3%', lineHeight: 24}]}>{"Previous \n month "}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {{}} onPress={() => this.changeMonth(+1)}>
                        <Text style={[styles.text, {fontSize: 22, marginTop: '5%', lineHeight: 24}]}>{"Next \n month "} </Text>
                    </TouchableOpacity>
                </View>

                <View style={{width: "40%", height: "35%", marginTop: 4, flexDirection: 'row', alignSelf: 'center'}}>
                    <View style={[styles.lensButtonView, {backgroundColor: 'rgba(253,219,100,0.6)'}]}>
                        <TouchableOpacity style={{width: '100%', height: '100%', alignSelf: 'center', justifyContent: 'center'}}
                                          onPress={() => {
                                              this.setState({currentLens: "Reminders"});
                                          }}>
                            <Image style={{width: '90%', height: '90%', alignSelf: 'center'}} source={require("../assets/reminders.png")}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.lensButtonView, {backgroundColor: 'rgba(88,133,172, 0.6)'}]}>
                        <TouchableOpacity style={{width: '100%', height: '100%', alignSelf: 'center', justifyContent: 'center'}}
                                          onPress={() => {
                                              this.setState({currentLens: "Symptoms"});
                                          }}>
                            <Image style={{width: '80%', height: '80%', alignSelf: 'center'}} source={require("../assets/health.png")}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.lensButtonView, {backgroundColor: 'rgba(241,159,52, 0.6)'}]}>
                        <TouchableOpacity style={{width: '100%', height: '100%', alignSelf: 'center', justifyContent: 'center'}}
                                          onPress={() => {
                                              this.setState({currentLens: "Stress"});
                                          }}>
                            <Image style={{width: '80%', height: '80%', alignSelf: 'center'}} source={require("../assets/stress.png")}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    text: {
        color: 'black',
        fontSize: 26,
        fontFamily: 'VanDijkICG-Bold',
        textAlign: 'center',
    },
    text2: {
        zIndex: -1,
        color: 'black',
        fontSize: 18,
        top: 8,
        textAlign: 'center',
    },
    calendarArea: {
        height: '88%',
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: 'white',
    },
    dateIcon: {
        height: '50%',
        width: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 20,
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
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    modalContent: {
        alignSelf: 'center',
        justifyContent: 'center',
        height: '75%',
        width: '75%',
        marginTop: '20%',
        borderRadius: 50,
        backgroundColor: 'rgb(169,206,250)',
    },
    modalText: {
        fontSize: 25,
        textAlign: 'center',
        color: 'black',
    },
    modalButton: {
        zIndex: -1,
        alignSelf: 'center',
        justifyContent: 'center',
        height: '10%',
        width: '50%',
        margin: 5,
        borderRadius: 100,
        backgroundColor: 'rgb(248,231,85)',
    },
    modalDate: {
        backgroundColor: 'rgb(248,231,85)',
        height: 95,
        width: 147.5,
        top: '-10%',
        position: 'absolute',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#1d274d',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    headerText: {
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: '-2%',
        fontSize: 36,
        fontFamily: 'VanDijkICG-Bold',
        color: 'black',
    },
    textInput: {
        alignSelf: 'center',
        backgroundColor: 'white',
        width: '90%',
        height: '42.5%',
        marginTop: '4%',
        fontSize: 16,
        borderRadius: 10,
    },
    symptomsArea: {
        zIndex: -1,
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        flexDirection: 'row',
        height: '15%',
        width: '90%',
        marginTop: '1%',
        marginBottom: '0%',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    symptomsAdder: {
        //justifyContent: 'flex-start',
        alignSelf: 'center',
        flexDirection: 'row',
        height: '7.5%',
        width: '90%',
        marginTop: '4%',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    symptomsButtonView: {
        zIndex: -1,
        //justifyContent: 'center',
        width: 75,
        height: '85%',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        borderWidth: 1,
        backgroundColor: 'rgb(252,245,220)',
    },
    symptomsButtonText: {
        zIndex: -1,
        color: 'black',
        textAlign: 'center',
        //top: '10%',
        //borderWidth: 1,
        fontSize: 14,
    },
    symptomsButtonTextDisabled: {
        zIndex: -1,
        textAlign: 'center',
        //top: '10%',
        //borderWidth: 1,
        fontSize: 14,
        color: 'rgba(0,0,0,0.25)',
        borderColor: 'rgba(0,0,0,0.25)',
    },
    reminder: {
        height: '8%',
        width: '75%',
        flexDirection: 'row',
        marginTop: '8%',
        marginLeft: '20%',
        //alignSelf: 'center',
        borderRadius: 100,
        borderWidth: 1,
        backgroundColor: 'rgb(252,245,220)',
    },
    reminderText: {
        marginLeft: '5%',
        fontSize: 16,
        color: 'black',
    },
    reminderIcon: {
        position: 'absolute',
        width: 42,
        height: 42,
        top: 143,
        left: 70,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: 'rgb(248,231,85)',
    },
    lensButtonView: {
        width: '33%',
        height: '25%',
        borderRadius: 20,
        borderWidth: 2,
        //borderColor: 'white',
        margin: 4,
    },
    lensButton: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
});
