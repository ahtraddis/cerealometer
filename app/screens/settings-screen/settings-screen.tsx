import * as React from "react"
import { useStores } from "../../models/root-store"
import { NavigationInjectedProps } from "react-navigation"
import { View } from "react-native"
import { Wallpaper, Screen, Text, LoginRequired, UserDebug } from "../../components"
import { FULL, SCREEN_CONTAINER, SCREEN_HEADER, SCREEN_HEADER_TEXT } from "../../styles/common"

export interface SettingsScreenProps extends NavigationInjectedProps<{}> {}

export const SettingsScreen: React.FunctionComponent<SettingsScreenProps> = (props) => {
  
  const { userStore } = useStores();

  let isLoggedIn = userStore.user.isLoggedIn

  if (!isLoggedIn) {
    return (
      <LoginRequired />
    )
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={SCREEN_CONTAINER} preset={"scroll"}>
        <View style={SCREEN_HEADER}>
          <Text style={SCREEN_HEADER_TEXT} tx={"settingsScreen.header"} />
        </View>
      </Screen>
      <UserDebug />
    </View>
  )
}
