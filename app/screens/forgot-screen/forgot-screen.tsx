import * as React from "react"
import { observer } from "mobx-react-lite"
import { NavigationInjectedProps } from "react-navigation"
import { View } from "react-native"
import { Wallpaper, Screen, Text, UserDebug } from "../../components"
import { FULL, SCREEN_HEADER, SCREEN_HEADER_TEXT, SCREEN_CONTAINER } from "../../styles/common"

export interface ForgotScreenProps extends NavigationInjectedProps<{}> {}

export const ForgotScreen: React.FunctionComponent<ForgotScreenProps> = observer((props) => {

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={SCREEN_CONTAINER} preset="scroll">
        <View style={SCREEN_HEADER}>
          <Text style={SCREEN_HEADER_TEXT} tx={"forgotScreen.header"} />
        </View>
      </Screen>
      <UserDebug />
    </View>
  )
})
