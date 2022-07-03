import * as React from "react"
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {
  ItemScreen,
  OverstockScreen,
  ScanScreen,
  AlarmScreen,
  MeterScreen,
  SettingsScreen,
  DeviceScreen,
} from "../screens"
import { Icon } from 'react-native-elements'

export const PrimaryNavigator = createBottomTabNavigator(
  {
    meter: {
      screen: MeterScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Metrics",
        tabBarIcon: ({ tintColor }) =>
          <Icon
            size={18}
            type="simple-line-icon"
            name="chart"
            color={tintColor}
          />,
        headerTitleAlign: 'center',        
      }),
    },
    item: {
      screen: ItemScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Shelf",
        tabBarIcon: ({ tintColor }) =>
          <Icon
            size={24}
            type="material-community"
            name="bowl"
            color={tintColor}
          />,
        headerTitleAlign: 'center',
      }),
    },
    overstock: {
      screen: OverstockScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Items",
        tabBarIcon: ({ tintColor }) =>
          <Icon
            size={24}
            type="material-community"
            name="silverware-spoon"
            color={tintColor}
          />,
        headerTitleAlign: 'center',
      }),
    },
    scan: {
      screen: ScanScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Scan",
        tabBarIcon: ({ tintColor }) =>
          <Icon
            size={24}
            type="material-community"
            name="barcode-scan"
            color={tintColor}
          />,
        headerTitleAlign: 'center',
      }),
    },
    alarm: {
      screen: AlarmScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Alarms",
        tabBarIcon: ({ tintColor }) =>
          <Icon
            size={22}
            type="material-community"
            name="alarm-light-outline"
            color={tintColor}
          />,
        headerTitleAlign: 'center',
      }),
    },

    settings: {
      screen: SettingsScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Settings",
        tabBarIcon: ({ tintColor }) =>
          <Icon
            size={22}
            type="material-community"
            name="settings-outline"
            color={tintColor}
          />,
        headerTitleAlign: 'center',
      }),
    },
    device: {
      screen: DeviceScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Device",
        tabBarIcon: ({ tintColor }) =>
          <Icon
            size={22}
            type="material-community"
            name="settings-outline"
            color={tintColor}
          />,
        headerTitleAlign: 'center',
      }),
    },

  },
  {
    initialRouteName: "item",
    tabBarOptions: {
      style: {
        height: 45,
        backgroundColor: 'transparent',
      },
      tabStyle: {
        marginRight: 1,
        marginLeft: 0,
      },
      labelPosition: 'below-icon',
      labelStyle: {
        fontSize: 12,
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
export const exitRoutes: string[] = ["item", "overstock", "scan", "alarm", "meter", "settings", "device"]
