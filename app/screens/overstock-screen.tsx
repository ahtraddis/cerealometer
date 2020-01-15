import * as React from "react"
import { observer } from "mobx-react-lite"
import { NavigationScreenProps } from "react-navigation"
import { ViewStyle } from "react-native"
import { Screen, Text } from "../components"
// import { useStores } from "../models/root-store"

import { TEXT, BOLD, BLACK, WHITE, BUTTON, BUTTON_TEXT, ROOT, FULL, HEADER, HEADER_CONTENT, HEADER_TITLE, FOOTER, FOOTER_CONTENT } from "../styles/common"

export interface OverstockScreenProps extends NavigationScreenProps<{}> {}

export const OverstockScreen: React.FunctionComponent<OverstockScreenProps> = observer((props) => {
  // const { someStore } = useStores()
  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset="header" tx="overstockScreen.header" />
    </Screen>
  )
})
