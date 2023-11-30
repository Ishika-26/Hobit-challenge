import * as React from 'react';
import {Text, View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import listofBeverages from './src/listofBeverages/index';
import bookedBeverages from './src/bookedBeverages/index';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          labelPosition: 'below-icon',
        }}>
        <Tab.Screen
          name="List Of Beverages"
          component={listofBeverages}
          options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text
                style={{
                  color: focused ? 'blue' : 'black',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                List
              </Text>
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('./src/images/softdrink.png')
                    : require('./src/images/softdrink.png')
                }
                style={{width: 28, height: 28}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Booked Beverage"
          component={bookedBeverages}
          options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: focused ? 'bold' : 'normal',
                  color: focused ? 'blue' : 'black',
                }}>
                Book
              </Text>
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('./src/images/bookmark.png')
                    : require('./src/images/bookmark.png')
                }
                style={{width: 22, height: 22}}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
