import * as React from "react"
import { NavigationInjectedProps } from "react-navigation"
import { View } from "react-native"
import { Wallpaper, Screen, Text, UserDebug } from "../../components"
import { FULL, SCREEN_CONTAINER, SCREEN_HEADER, SCREEN_HEADER_TEXT } from "../../styles/common"

export interface RegisterScreenProps extends NavigationInjectedProps<{}> {}

export const RegisterScreen: React.FunctionComponent<RegisterScreenProps> = (props) => {
  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={SCREEN_CONTAINER} preset="scroll">
        <View style={SCREEN_HEADER}>
          <Text style={SCREEN_HEADER_TEXT} tx={"registerScreen.header"} />
        </View>
      </Screen>
      <UserDebug />
    </View>
  )
}
