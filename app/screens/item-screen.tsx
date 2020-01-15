import * as React from "react"
import { useStores } from "../models/root-store"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import * as env from "../environment-variables"
import { NavigationScreenProps } from "react-navigation"
import { View } from "react-native"
import { Wallpaper, Items } from "../components"
import { FULL } from "../styles/common"

export interface ItemScreenProps extends NavigationScreenProps<{}> {}

export const ItemScreen: React.FunctionComponent<ItemScreenProps> = observer((props) => {
  const { deviceStore, itemDefinitionStore, itemStore, userStore } = useStores()

  useEffect(() => {
    // [eschwartz-TODO] Hardcoded user ID
    deviceStore.getDevices(env.HARDCODED_TEST_USER_ID);
    // [eschwartz-TODO] Hardcoded user ID
    itemStore.getItems(env.HARDCODED_TEST_USER_ID);
    //itemStore.clearItems()
    // [eschwartz-TODO] Get only item defs for user
    itemDefinitionStore.getItemDefinitions();
    // [eschwartz-TODO] Hardcoded user ID
    userStore.getUser(env.HARDCODED_TEST_USER_ID);
    //console.log("item-screen: itemDefinitionStore:", JSON.stringify(itemDefinitionStore, null, 2))
    console.log("item-screen: userStore:", JSON.stringify(userStore));
    console.log("item-screen: itemStore:", JSON.stringify(itemStore));
    console.log("item-screen: deviceStore:", JSON.stringify(deviceStore));
  })

  return (
    <View style={FULL}>
      <Wallpaper />
      <Items />
    </View>
  )
})
