import { createStackNavigator } from "react-navigation"
import { PrimaryNavigator } from "./primary-navigator"
import {
  DeviceScreen,
  ScanScreen,
} from "../screens" // eslint-disable-line @typescript-eslint/no-unused-vars

export const RootNavigator = createStackNavigator(
  {
    scanScreen: { screen: ScanScreen },
    deviceScreen: { screen: DeviceScreen },
    primaryStack: { screen: PrimaryNavigator },
  },
  {
    headerMode: "none",
    navigationOptions: { gesturesEnabled: false },
  },
)
