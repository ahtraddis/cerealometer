import * as React from "react"
import { useStores } from "../../models/root-store"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { NavigationInjectedProps } from "react-navigation"
import { View } from "react-native"
import { Wallpaper, Screen, Items, LoginRequired, UserDebug, Text } from "../../components"
import { FULL, SCREEN_CONTAINER, SCREEN_HEADER, SCREEN_HEADER_TEXT } from "../../styles/common"

export interface OverstockScreenProps extends NavigationInjectedProps<{}> {}

export const OverstockScreen: React.FunctionComponent = observer((props) => {
  const { deviceStore, itemDefinitionStore, itemStore, userStore } = useStores()

  let isLoggedIn = userStore.user.isLoggedIn

  useEffect(() => {
    if (userStore.user.isLoggedIn) {
      let uid = userStore.user.uid
      //itemDefinitionStore.getItemDefinitions(uid);
      //deviceStore.getDevices(uid);
      //itemStore.getItems(uid);      
      //userStore.getUser(uid);
    }
  }, [])

  if (!isLoggedIn) {
    return (
      <LoginRequired />
    )
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={SCREEN_CONTAINER}>
        <View style={SCREEN_HEADER}>
          <Text style={SCREEN_HEADER_TEXT} tx={"overstockScreen.header"} />
        </View>
        <Items
          vertical={true}
          listType={"inactive"}
          emptyMessage={"Go to Scan to add items!"}
        />
      </Screen>
      <UserDebug />
    </View>
  )
})
