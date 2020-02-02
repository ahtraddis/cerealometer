import { createStackNavigator } from "react-navigation-stack"
import {
  DeviceScreen,
  SettingsScreen,
} from "../screens"

export const OtherNavigator = createStackNavigator(
  {
    device: {
      screen: DeviceScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Devices",
        headerTitleAlign: 'center',
      }),
    },
    settings: {
      screen: SettingsScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Settings",
        headerTitleAlign: 'center',
      }),
    },
  },
  {
    headerMode: "none",
    initialRouteName: "device",
  },
)

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 */
export const exitRoutes: string[] = ["device"]
