import * as React from "react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { color } from "../theme"
import { NavigationScreenProps } from "react-navigation"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

export interface AlarmScreenProps extends NavigationScreenProps<{}> {
}

export const AlarmScreen: React.FunctionComponent<AlarmScreenProps> = (props) => {
  
  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset="header" tx="alarmScreen.header" />
    </Screen>
  )
}
