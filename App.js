import React, { useEffect, useState, useRef } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, FlatList, Alert } from 'react-native';
import Task, { generateRandomId } from './components/Task';
import Liste from './components/Liste'
import AnaSayfa from './components/AnaSayfa'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { openDatabase } from 'react-native-sqlite-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
var db = openDatabase({ name: 'UserDatabase.db' });
import ThemeContext from './components/Context';

const Stack = createStackNavigator();
export default function App() {
  const [nightMode, setNightMode] = useState(false)
  var color = '#dbf6e9'


  return (
    <ThemeContext.Provider value={{ color, nightMode, setNightMode }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={AnaSayfa}
            options={{
              title: 'Alışveriş Listesi',
              headerStyle: {
                backgroundColor: nightMode ? '#2b2e4a' : '#55BCF6',
                height: 40,

              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                alignContent: 'center'
              },
              headerTitleAlign: 'center',
              headerRight: () => <Icon name="theme-light-dark" size={27} style={{ marginRight: 15 }} color="white" onPress={() => setNightMode(!nightMode)} />,
              headerLeft: () => <Icon2 name="shopping-cart" size={27} style={{ marginLeft: 15 }} color="white" />

            }}
          />
          <Stack.Screen
            name="Liste"
            component={Liste}
            options={{
              title: 'Listeler',
              headerStyle: {
                backgroundColor: nightMode ? '#2b2e4a' : '#55BCF6',
                height: 40,

              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                alignContent: 'center'
              },
              headerTitleAlign: 'center',
              headerRight: () => <Icon name="theme-light-dark" size={27} style={{ marginRight: 15 }} color="white" onPress={() => setNightMode(!nightMode)}/>
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  )

}