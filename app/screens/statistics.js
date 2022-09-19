/* eslint-disable prettier/prettier */
`use strict`;

import * as React from 'react';
import {View, StyleSheet, ImageBackground, Text, TouchableOpacity, Dimensions, ScrollView, Image} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import SyncStorage from 'sync-storage';

const {width, height} = Dimensions.get('window');

export default class Statistics extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            userData: [],
            symptomTypes: ["Aberrant motor behavior", "Agitation/aggression", "Anxiety",
                        "Apathy", "Appetite and eating change", "Delusions",
                        "Disinhibition", "Dysphoria/depression", "Euphoria",
                        "Hallucinations", "Irritability", "Sleep and night-time behavior change"],
        }
    }

    retrieveData(dataKeys) {
        let userData = [];
        for (let i in dataKeys) {
            let x = SyncStorage.get(dataKeys[i]);
            userData.push(x); // push variable and not storage return directly to avoid errors with undefined vals
        }
        return userData;
    }
s
    calcAvg(values) {
        let x = values;
        if (x === undefined || x.length === 0)
            return 0;
        let sum = x.reduce((partialSum, a) => partialSum + a, 0);
        let avg = sum/values.length;
        return avg;
    }

    render() {
        let months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        let dateNow = new Date();
        let currentMonth = "";
        let dataKey = "";
        let dataKeys = [];

        for (let i = 6; i >= 0; i--) { // convert last 7 dates to syncstorage key format
            let datePrevWeek = new Date(dateNow);
            datePrevWeek.setDate(datePrevWeek.getDate() - i);
            currentMonth = datePrevWeek.getMonth();
            dataKey = months[currentMonth] + "" + datePrevWeek.getDate();
            if (SyncStorage.getAllKeys().includes(dataKey)) { // only include days with existing data
                dataKeys.push(dataKey);
            }
        }

        let userData = this.retrieveData(dataKeys);
        let stressData = [];
        let symptomNumData = [];
        let symptomTextData = [];
        let symptomSeverityData = [];
        for (let i in userData) {
            let currentStressData = userData[i][1]; // index 1 corresponds to stress slider val
            stressData.push(currentStressData * 100);
            let currentSymptomNumData = userData[i][2]; // returns an array, length = num of symptom types
            symptomNumData.push(currentSymptomNumData.length);
            symptomTextData.push(currentSymptomNumData);
            let currentSymptomSeverityData = userData[i][3];
            symptomSeverityData.push(currentSymptomSeverityData);
        }
        symptomTextData.flat(); // flatten to single array containing all entries

        let severityDataFlat = symptomSeverityData.flat();

        for (let i in symptomSeverityData) { // currently is array containing arrays of numbers, convert array containing averages of numbers
            symptomSeverityData[i] = this.calcAvg(symptomSeverityData[i]);
        }

        if(dataKeys.length === 0) { // prevents error if no values defined
            dataKeys = [" ", " ", " "];
            stressData = [0,0,0];
            symptomNumData = [0,0,0];
            symptomSeverityData = [0,0,0];
            alert("No input in the last 7 days. Track some well-being data" +
                " in the calendar to see your data overview.");
        }

        return (
            <View style = {styles.main}>
                <View>
                    <Image style={{ height: height, width: width, position: 'absolute', top:0, left:0 }} source={require('../assets/sun.png')} />
                </View>

                <ScrollView style={{ flex: 1, backgroundColor:'rgba(212,200,131,0.5)' }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.header}>
                            <Text style={styles.statsText}>Carer Stress Levels (Past Week)</Text>
                        </View>
                        <LineChart
                            data={{
                                labels: dataKeys,
                                datasets: [{data: stressData}]
                            }}
                            width={width - width/dataKeys.length + 30} // chart width proportionate to number of points on chart. looks cleaner when number of points is lower
                            height={250}
                            yAxisSuffix="%"
                            yAxisInterval={1} // optional, defaults to 1
                            verticalLabelRotation={15}
                            fromZero={true}
                            segments={5}
                            chartConfig={{
                                backgroundColor: 'rgb(141,184,234)',
                                backgroundGradientFrom: 'rgb(141,184,234)',
                                backgroundGradientTo: 'rgb(206,227,245)',
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // color requires a function
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // labelColor requires a function
                                style: {
                                    alignSelf: 'center',
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: '4',
                                    strokeWidth: '2',
                                    stroke: 'rgba(0,0,0,1)',
                                },
                                propsForLabels: {
                                    fontSize: 13,
                                }
                            }}
                            bezier style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                    </View>

                    <View style={{flexDirection: 'row', height: 150, justifyContent: 'space-evenly'}}>
                        <View style={styles.statsArea}>
                            <Text style={styles.statsText}>{"Your Average Stress Level (Past Week): \n" + Math.round(this.calcAvg(stressData)) + "%"}</Text>
                        </View>
                        <View style={styles.statsArea}>
                            <Text style={styles.statsText}>{"Average Symptom Severity (1-3) (Whole Week): \n" + this.calcAvg(severityDataFlat)}</Text>
                        </View>
                    </View>

                    <View style={{alignItems: 'center'}}>
                        <View style={[styles.header, {backgroundColor: 'rgba(224,224,77,0.5)'}]}>
                            <Text style={styles.statsText}>Avg Symptom Severity (Past Week)</Text>
                        </View>
                        <LineChart
                            data={{
                                labels: dataKeys,
                                datasets: [{data: symptomSeverityData}]
                            }}
                            width={width - width/dataKeys.length + 30} // chart width proportionate to number of points on chart. looks cleaner when number of points is lower
                            height={250}
                            yAxisInterval={1} // optional, defaults to 1
                            verticalLabelRotation={15}
                            fromZero={true}
                            segments={3}
                            chartConfig={{
                                backgroundColor: 'rgb(253,249,58)',
                                backgroundGradientFrom: 'rgb(224,224,77)',
                                backgroundGradientTo: 'rgb(255,255,184)',
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // color requires a function
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // labelColor requires a function
                                style: {
                                    alignSelf: 'center',
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: '4',
                                    strokeWidth: '2',
                                    stroke: 'rgba(0,0,0,1)',
                                },
                                propsForLabels: {
                                    fontSize: 13,
                                }
                            }}
                            bezier style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                        />
                    </View>

                    <View style={{alignItems: 'center'}}>
                        <View style={styles.header}>
                            <Text style={styles.statsText}>No. of Symptom types (Past Week)</Text>
                        </View>
                        <LineChart
                            data={{
                                labels: dataKeys,
                                datasets: [{data: symptomNumData}]
                            }}
                            width={width - width/dataKeys.length + 30} // chart width proportionate to number of points on chart. looks cleaner when number of points is lower
                            height={250}
                            yAxisInterval={1} // optional, defaults to 1
                            verticalLabelRotation={15}
                            fromZero={true}
                            segments={3}
                            chartConfig={{
                                backgroundColor: 'rgb(141,184,234)',
                                backgroundGradientFrom: 'rgb(141,184,234)',
                                backgroundGradientTo: 'rgb(206,227,245)',
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // color requires a function
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // labelColor requires a function
                                style: {
                                    alignSelf: 'center',
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: '4',
                                    strokeWidth: '2',
                                    stroke: 'rgba(0,0,0,1)',
                                },
                                propsForLabels: {
                                    fontSize: 13,
                                }
                            }}
                            bezier style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                        />
                    </View>

                    <View style={{alignItems: 'center'}}>
                        <View style={[styles.header, {backgroundColor: 'rgba(224,224,77,0.5)'}]}>
                            <Text style={styles.statsText}>Positivity/Negativity Scale (Past Week)</Text>
                        </View>
                        <LineChart
                            data={{
                                labels: dataKeys,
                                datasets: [{data: [0,0,0]}]
                            }}
                            width={width - width/dataKeys.length + 30} // chart width proportionate to number of points on chart. looks cleaner when number of points is lower
                            height={250}
                            yAxisInterval={1} // optional, defaults to 1
                            verticalLabelRotation={15}
                            fromZero={true}
                            segments={3}
                            chartConfig={{
                                backgroundColor: 'rgb(253,249,58)',
                                backgroundGradientFrom: 'rgb(224,224,77)',
                                backgroundGradientTo: 'rgb(255,255,184)',
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // color requires a function
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // labelColor requires a function
                                style: {
                                    alignSelf: 'center',
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: '4',
                                    strokeWidth: '2',
                                    stroke: 'rgba(0,0,0,1)',
                                },
                                propsForLabels: {
                                    fontSize: 13,
                                }
                            }}
                            bezier style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                        />
                    </View>
                </ScrollView>

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
        backgroundColor: 'rgba(0,0,0,0.6)',
        height: '100%',
        width: '100%',
    },
    buttonArea: {
        justifyContent: 'center',
    },
    button: {
        alignSelf: 'center',
        backgroundColor: 'rgb(207,198,110)',
        height: '50%',
        width: '50%',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#4c471e',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 30,
        fontFamily: 'VanDijkICG-Bold',
        color: 'rgb(77,72,29)',
        alignSelf: 'center',
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
    header: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        width: '75%',
        height: 25,
        marginTop: '2%',
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: 'rgba(108,162,231,0.6)',
    },
    statsArea: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        width: width / 3,
        height: width / 3,
        margin: '1%',
        borderRadius: 100,
        borderWidth: 1,
        backgroundColor: 'rgba(108,162,231,0.6)',
    },
    statsText: {
        textAlign: 'center',
        width: '90%',
        fontSize: 17,
        color: 'black',
    },
});
