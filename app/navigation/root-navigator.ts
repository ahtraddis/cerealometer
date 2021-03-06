import { createSwitchNavigator } from "react-navigation"
import { PrimaryNavigator } from "./primary-navigator"
import { AuthNavigator } from "./auth-navigator"
import { OtherNavigator } from "./other-navigator"

import {
} from "../screens" // eslint-disable-line @typescript-eslint/no-unused-vars

export const RootNavigator = createSwitchNavigator(
  {
    authStack: { screen: AuthNavigator },
    primaryStack: { screen: PrimaryNavigator },
    otherStack: { screen: OtherNavigator },

  },
  {
    initialRouteName: 'authStack',
    //headerMode: "none",
  },
)
