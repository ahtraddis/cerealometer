import * as React from "react"
import { useStores } from "../models/root-store"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import * as env from "../environment-variables"
import { NavigationScreenProps } from "react-navigation"
import { View, Text } from "react-native"
import { Wallpaper } from "../components"
import { ItemsWrapper } from "../screens/item-screen"
import { FULL, SCREEN_HEADER, SCREEN_HEADER_TEXT } from "../styles/common"

export const ScreenHeader = (props) => {
  const { text } = props
  return (
    <View style={SCREEN_HEADER}>
      <Text style={SCREEN_HEADER_TEXT}>{text}</Text>
    </View>
  )
}

export interface OverstockScreenProps extends NavigationScreenProps<{}> {}

export const OverstockScreen: React.FunctionComponent = observer((props) => {
  const { deviceStore, itemDefinitionStore, itemStore, userStore } = useStores()

  useEffect(() => {
    // [eschwartz-TODO] Hardcoded user ID
    deviceStore.getDevices(env.HARDCODED_TEST_USER_ID);
    // [eschwartz-TODO] Hardcoded user ID
    itemStore.getItems(env.HARDCODED_TEST_USER_ID);
    // [eschwartz-TODO] Get only item defs for user
    itemDefinitionStore.getItemDefinitions();
    // [eschwartz-TODO] Hardcoded user ID
    userStore.getUser(env.HARDCODED_TEST_USER_ID);
    //console.log("overstock-screen: itemDefinitionStore.item_definitions:", JSON.stringify(itemDefinitionStore.itemDefinitions, null, 2))
    // console.log("overstock-screen: userStore.user:", JSON.stringify(userStore.user, null, 2))
    // console.log("overstock-screen: itemStore.items:", JSON.stringify(itemStore.items, null, 2))
    // console.log("overstock-screen: deviceStore.devices:", JSON.stringify(deviceStore.devices, null, 2))
  })

  return (
    <View style={FULL}>
      <Wallpaper />
      <ScreenHeader text={"Overstock"} />
      <ItemsWrapper
        //vertical={true}
        listType={"inactive"}
        emptyMessage={"Go to Scan to add more items!"}
      />
    </View>
  )
})
