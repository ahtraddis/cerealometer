import createNativeStackNavigator from "react-native-screens/createNativeStackNavigator"
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {
  DeviceScreen,
  ScanScreen,
  OverstockScreen,
  AlarmScreen,
  ItemScreen,
} from "../screens"

export const PrimaryNavigator = createBottomTabNavigator(
  {
    item: {
      screen: ItemScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Items",
        headerTitleAlign: 'center',
      }),
    },
    overstock: {
      screen: OverstockScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Overstock",
        headerTitleAlign: 'center',
      }),
    },
    scan: {
      screen: ScanScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Scan",
        headerTitleAlign: 'center',
      }),
    },
    alarm: {
      screen: AlarmScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Alarms",
        headerTitleAlign: 'center',
      }),
    },
    device: {
      screen: DeviceScreen,
      navigationOptions: ({ navigation }) => ({
        title: "Devices",
        headerTitleAlign: 'center', // nope
        //headerBackTitle: 'backtitle', // nope
        //headerBackTitleVisible: true, // nope?
        headerStyle: {
          //backgroundColor: '#ccc',
        },
        headerTitleStyle: {
          //fontFamily:
          //fontSize: 30,
        },
        headerBackTitleStyle: {
          fontFamily: 'Arial',
          fontSize: 5,
        },
        //headerTintColor: 'black', // this is just color (what's tint?)
      }),
    },
  },
  {
    headerMode: "screen",
    //initialRouteName: "devices",
    tabBarOptions: {
      style: {
        height: 36,
        backgroundColor: '#555',
      },
      tabStyle: {
        //backgroundColor: 'purple',
        //padding: 7,
        borderRight: 1,
        //borderColor: '#000',
        marginRight: 1,
        marginLeft: 0,
      },
      labelPosition: 'below-icon',
      labelStyle: {
        //backgroundColor: 'green'
        fontSize: 13,
      },
      activeBackgroundColor: '#1e0033',
      inactiveBackgroundColor: '#ccc',
      activeTintColor: '#ccc',
      inactiveTintColor: '#333',
    }
  },
)

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 */
export const exitRoutes: string[] = ["item", "overstock", "scan", "alarm", "device"]
