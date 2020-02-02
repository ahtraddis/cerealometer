import * as React from "react"
import { useStores } from "../models/root-store"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { NavigationInjectedProps } from "react-navigation"
import { View, Dimensions } from "react-native"
import { Wallpaper, Meter, Ports, Text, Screen, LoginRequired, UserDebug } from "../components"
import { FULL, SCREEN_CONTAINER, SCREEN_HEADER, SCREEN_HEADER_TEXT } from "../styles/common"

import auth from '@react-native-firebase/auth';

interface ItemsWrapperProps {
  listType?: string
  emptyMessage?: string
  vertical?: boolean
}

const ItemsWrapper: React.FunctionComponent<ItemsWrapperProps> = observer((props) => {
  const { listType, emptyMessage, ...rest } = props
  return (
    <Ports {...props} />
  )
});

export interface ItemScreenProps extends NavigationInjectedProps<{}> {}

export const ItemScreen: React.FunctionComponent<ItemScreenProps> = observer((props) => {
  const { deviceStore, portStore, itemDefinitionStore, itemStore, userStore } = useStores()
  const { width } = Dimensions.get("window")
  let isLoggedIn = userStore.user.isLoggedIn

  // Handle user state changes
  function onAuthStateChanged(user) {
    userStore.updateAuthState(user)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    if (isLoggedIn) {
      let uid = userStore.user.uid
      //itemDefinitionStore.getItemDefinitions(uid);
      //deviceStore.getDevices(uid)
      //itemStore.getItems(uid)
      //userStore.getUser(uid)
      //portStore.getPorts(uid)
    }
    return subscriber
  }, [])

  if (!isLoggedIn) {
    return (
      <LoginRequired />
    )
  }

  return (
    <View style={FULL} >
      <Wallpaper />
      <Screen style={SCREEN_CONTAINER} preset="scroll">
        <View style={SCREEN_HEADER}>
          <Text style={SCREEN_HEADER_TEXT} tx={"itemScreen.header"} />
        </View>
        <Meter size={width - 140} />
        <ItemsWrapper
          vertical={false}
          listType={"active"}
          emptyMessage={"Waiting for device to connect..."}
        />
      </Screen>
      <UserDebug />
    </View>
  )
})
