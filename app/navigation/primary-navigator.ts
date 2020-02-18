import { createBottomTabNavigator } from 'react-navigation-tabs';
import {
  ItemScreen,
  OverstockScreen,
  ScanScreen,
  AlarmScreen,
  MeterScreen,
} from "../screens"

export const PrimaryNavigator = createBottomTabNavigator(
  {
    meter: {
      screen: MeterScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Meter",
        headerTitleAlign: 'center',
      }),
    },
    item: {
      screen: ItemScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Shelf",
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
  },
  {
    initialRouteName: "item",
    tabBarOptions: {
      style: {
        height: 36,
        backgroundColor: '#555',
      },
      tabStyle: {
        //backgroundColor: 'purple',
        //padding: 7,
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
export const exitRoutes: string[] = ["item", "overstock", "scan", "alarm", "meter"]
