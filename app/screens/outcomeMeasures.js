/* eslint-disable prettier/prettier */
`use strict`;

import * as React from 'react';
import {View, StyleSheet, ImageBackground, Text, TouchableOpacity, Image, ScrollView, Dimensions, Linking } from 'react-native';

const {width, height} = Dimensions.get('window');

export default class OutcomeMeasures extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style = {styles.main}>
                <View>
                    <Image style={{ height: height, width: width, position: 'absolute', top:0, left:0 }} source={require('../assets/sun.png')} />
                </View>

                <ScrollView style={{ flex: 1, backgroundColor:'rgba(212,200,131,0.5)' }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.header}>
                        <Text style={styles.mainText}>Outcome Measures & Assessments:</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>A series of symptom categories will be presented, each with a screening question. If your answer to the screening question is 'Yes', proceed with the instructions given.
                                                        If the answer is 'No', move on to the next category.</Text>
                        <Text style={styles.paraText}>The aim of these questions is to gain a meaningful understanding of the well-being of the person with dementia being cared for. You may wish to discuss with your clinician
                                                        the recommended regularity of such assessments. You can also show them the results of these assessments to help them understand your dependent's well-being. All forms referenced can be found at:</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={[styles.paraText, {color: 'blue'}]}
                              onPress={() => Linking.openURL('https://docs.google.com/document/d/1mR2gBDTzCDDF9zRGpfvJLcqlPr132-sgnPzN2mDRrXk/edit?usp=sharing')}>
                            https://docs.google.com/document/d/1mR2gBDTzCDDF9zRGpfvJLcqlPr132-sgnPzN2mDRrXk/edit?usp=sharing
                        </Text>
                    </View>

                    <View style={styles.textArea}>
                        <Text style={styles.mainText}>1: Delusions</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Does the patient have beliefs that you know are not true (for example, insisting that people
                            are trying to harm him/her or steal from him/her)? Has he/she said that family members are not who
                            they say they are or that the house is not their home? I’m not asking about mere suspiciousness; I am
                            interested if the patient is convinced that these things are happening to him/her."</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 1 of the linked form. If No, proceed to category 2.</Text>
                    </View>

                    <View style={styles.textArea}>
                        <Text style={styles.mainText}>2: Hallucinations</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Does the patient have hallucinations such as seeing false visions or hearing imaginary voices?
                            Does he/she seem to see, hear or experience things that are not present? By this question we do not
                            mean just mistaken beliefs such as stating that someone who has died is still alive; rather we are
                            asking if the patient actually has abnormal experiences of sounds or visions."</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 2 of the linked form. If No, proceed to category 3.</Text>
                    </View>

                    <View style={[styles.textArea, {height: height/5}]}>
                        <Text style={styles.mainText}>3: Agitation/Aggression</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Does the patient have periods when he/she refuses to cooperate or won’t let people help
                            him/her? Is he/she hard to handle?"</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 3 of the linked form. If No, proceed to category 4.</Text>
                    </View>

                    <View style={[styles.textArea, {height: height/5}]}>
                        <Text style={styles.mainText}>4: Depression/Dysphoria</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Does the patient seem sad or depressed? Does he/she say that he/she feels sad or depressed?"</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 4 of the linked form. If No, proceed to category 5.</Text>
                    </View>

                    <View style={[styles.textArea, {height: height/5 + 15}]}>
                        <Text style={styles.mainText}>5: Anxiety</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Is the patient very nervous, worried, or frightened for no apparent reason? Does he/she seem
                            very tense or fidgety? Is the patient afraid to be apart from you?"</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 5 of the linked form. If No, proceed to category 6.</Text>
                    </View>

                    <View style={[styles.textArea,{height: height/3 - 40}]}>
                        <Text style={styles.mainText}>6: Elation/Euphoria</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Does the patient seem too cheerful or too happy for no reason? I don’t mean the normal
                            happiness that comes from seeing friends, receiving presents, or spending time with family members.
                            I am asking if the patient has a persistent and abnormally good mood or finds humor where others do
                            not."</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 6 of the linked form. If No, proceed to category 7.</Text>
                    </View>

                    <View style={[styles.textArea,{height: height/3 - 40}]}>
                        <Text style={styles.mainText}>7: Apathy/Indifference</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Has the patient lost interest in the world around him/her? Has he/she lost interest in doing
                            things or does he/she lack motivation for starting new activities? Is he/she more difficult to engage
                            in conversation or in doing chores? Is the patient apathetic or indifferent?"</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 7 of the linked form. If No, proceed to category 8.</Text>
                    </View>

                    <View style={[styles.textArea,{height: height/4}]}>
                        <Text style={styles.mainText}>8: Disinhibition</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Does the patient seem to act impulsively without thinking? Does he/she do or say things that
                            are not usually done or said in public? Does he/she do things that are embarrassing to you or others?"</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 8 of the linked form. If No, proceed to category 9.</Text>
                    </View>

                    <View style={[styles.textArea,{height: height/3 - 25}]}>
                        <Text style={styles.mainText}>9: Irritability/Lability</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Does the patient get irritated and easily disturbed? Are his/her moods very changeable? Is
                            he/she abnormally impatient? We do not mean frustration over memory loss or inability to perform
                            usual tasks; we are interested to know if the patient has abnormal irritability, impatience, or rapid
                            emotional changes different from his/her usual self."</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 9 of the linked form. If No, proceed to category 10.</Text>
                    </View>

                    <View style={[styles.textArea,{height: height/5}]}>
                        <Text style={styles.mainText}>10: Aberrant Motor Behavior</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Does the patient pace, do things over and over such as opening closets or drawers, or
                            repeatedly pick at things or wind string or threads?"</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 10 of the linked form. If No, proceed to category 11.</Text>
                    </View>

                    <View style={[styles.textArea,{height: height/4 + 10}]}>
                        <Text style={styles.mainText}>11: Sleep</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Does the patient have difficulty sleeping (do not count as present if the patient simply gets up
                            once or twice per night only to go to the bathroom and falls back asleep immediately)? Is he/she up
                            at night? Does he/she wander at night, get dressed, or disturb your sleep?"</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 11 of the linked form. If No, proceed to category 12.</Text>
                    </View>

                    <View style={[styles.textArea,{height: height/4}]}>
                        <Text style={styles.mainText}>12: Appetite and eating disorders</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Screening Q: "Has he/she had any change in appetite, weight, or eating habits (count as NA if the patient is
                            incapacitated and has to be fed)? Has there been any change in type of food he/she prefers?"</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>If Yes, go to page 12 of the linked form.</Text>
                    </View>

                    <View style={[styles.textArea,{height: height/3 + 40, marginBottom: '5%'}]}>
                        <Text style={styles.mainText}>Dementia Quality of Life measure</Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={styles.paraText}>Finally, for patients with mild symptoms, it can be very beneficial for the person with dementia themselves to rate
                            their own standards of well-being. This can be a hugely insightful activity for understanding their state of mind and may apply if you find
                            yourself answering 'No' to many of the screening questions. The form below details the instructions for carrying out the assessment as well as
                            advice on asking questions gently, with patience and care. It can be found at: </Text>
                        <Text style={[styles.paraText, {lineHeight: 10}]}> </Text>
                        <Text style={[styles.paraText, {color: 'blue'}]}
                              onPress={() => Linking.openURL('https://www.bsms.ac.uk/_pdf/cds/demqol-questionnaire.pdf')}>
                            https://www.bsms.ac.uk/_pdf/cds/demqol-questionnaire.pdf
                        </Text>
                    </View>

                    <View style={{width: '100%', height: height/8}}>
                        <Text>{/* allows scrolling down to uncover home button from paragraph text */}</Text>
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
    header: {
        width: '90%',
        height: height/2,
        alignSelf: 'center',
        borderRadius: 30,
        marginTop: '5%',
        backgroundColor: 'rgba(141,184,234,0.8)',
    },
    textArea: {
        width: '90%',
        height: height/3 - 10,
        alignSelf: 'center',
        borderRadius: 30,
        marginTop: '5%',
        backgroundColor: 'rgba(141,184,234,0.8)',
    },
    mainText: {
        textAlign: 'left',
        marginLeft: '3%',
        fontSize: 26,
        fontFamily: 'VanDijkICG-Bold',
        color: 'black',
    },
    paraText: {
        textAlign: 'left',
        marginLeft: '4%',
        fontStyle: 'italic',
        fontSize: 15,
        lineHeight: 15,
        color: 'black',
    },
});
