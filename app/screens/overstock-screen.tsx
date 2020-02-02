import * as React from "react"
import { useStores } from "../models/root-store"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { NavigationInjectedProps } from "react-navigation"
import { View, ScrollView, Text } from "react-native"
import { Wallpaper, Screen, Items, LoginRequired, UserDebug } from "../components"
import { FULL, SCREEN_HEADER, SCREEN_HEADER_TEXT } from "../styles/common"

interface ItemsWrapperProps {
  listType?: string
  emptyMessage?: string
  vertical?: boolean
}

export interface OverstockScreenProps extends NavigationInjectedProps<{}> {}

export const ScreenHeader = (props) => {
  const { text } = props
  return (
    <View style={SCREEN_HEADER}>
      <Text style={SCREEN_HEADER_TEXT}>{text}</Text>
    </View>
  )
}

const ItemsWrapper: React.FunctionComponent<ItemsWrapperProps> = observer((props) => {
  const { listType, emptyMessage, vertical, ...rest } = props
  useEffect(() => {}, [])
  return (
    <Items
      {...props}
    />
  )
});

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
      <Screen>
        <ScreenHeader text={"Overstock"} />
          <ItemsWrapper
            listType={"inactive"}
            emptyMessage={"Go to Scan to add items!"}
          />
      </Screen>
      <UserDebug />
    </View>
  )
})
