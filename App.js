import * as React from 'react';
import {Text, View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import userDetails from './src/userDetails';
import favouriteUsers from './src/favouriteUsers';



const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          labelPosition: 'below-icon',
        }}>
        <Tab.Screen
          name="User Detail"
          component={userDetails}
          options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text
                style={{
                  color: focused ? 'blue' : 'black',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                User Detail
              </Text>
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('./src/images/group.png')
                    : require('./src/images/group.png')
                }
                style={{width: 28, height: 28}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Favourite User"
          component={favouriteUsers}
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
