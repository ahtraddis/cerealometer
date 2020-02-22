import * as React from "react"
import { NavigationInjectedProps } from "react-navigation"
import { View } from "react-native"
import { Wallpaper, Screen, SignupForm, UserDebug } from "../../components"
import { FULL, SCREEN_CONTAINER } from "../../styles/common"

export interface RegisterScreenProps extends NavigationInjectedProps<{}> {}

export const RegisterScreen: React.FunctionComponent<RegisterScreenProps> = (props) => {
  return (
    <View style={FULL} >
      <Wallpaper />
      <Screen style={SCREEN_CONTAINER} preset="scroll">
        <SignupForm />
        <UserDebug />
      </Screen>
    </View>

  )
}
