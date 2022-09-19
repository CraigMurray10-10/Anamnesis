import 'react-native-gesture-handler';
/* eslint-disable prettier/prettier */
`use strict`;

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SyncStorage from 'sync-storage';

import Home from './app/screens/home';
import Calendar from './app/screens/calendar';
import OutcomeMeasures from './app/screens/outcomeMeasures';
import Statistics from './app/screens/statistics';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="HomeScreen" component={Home} options={{ cardStyleInterpolator: forFade }}/>
                <Stack.Screen name="CalendarScreen" component={Calendar} options={{ cardStyleInterpolator: forFade }}/>
                <Stack.Screen name="OutcomeMeasureScreen" component={OutcomeMeasures} options={{ cardStyleInterpolator: forFade }}/>
                <Stack.Screen name="StatisticsScreen" component={Statistics} options={{ cardStyleInterpolator: forFade }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const forFade = ({ current }) => ({
    cardStyle: {
        opacity: current.progress,
    },
});

export default App;
