import * as React from "react"
import { useStores } from "../models/root-store"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import * as env from "../environment-variables"
import { NavigationScreenProps } from "react-navigation"
import { View } from "react-native"
import { Wallpaper, Meter, Ports, Text } from "../components"
import { FULL, SCREEN_HEADER, SCREEN_HEADER_TEXT } from "../styles/common"


export interface ItemsWrapperProps {
  listType?: string
  emptyMessage?: string
  vertical?: boolean
}

const ItemsWrapper: React.FunctionComponent<ItemsWrapperProps> = observer((props) => {
  const { userStore, itemStore, portStore } = useStores()
  const { listType, emptyMessage, ...rest } = props
  useEffect(() => {}, [])
  // [eschwartz-TODO] Hacks to force rerender. This needs to visibly display something in userStore to make it render observable changes.
  return (
      <Ports
        {...props}
        dummyUserProp={(userStore.user && userStore.user.metrics) ? userStore.user.metrics.overallPercentage : 0}
        dummyItemProp={(itemStore.items && itemStore.items.length) ? itemStore.items[0] : {}}
        dummyPortProp={(portStore.ports && portStore.ports.length) ? portStore.ports[0] : {}}
      />
  )
});

export interface ItemScreenProps extends NavigationScreenProps<{}> {}

export const ItemScreen: React.FunctionComponent<ItemScreenProps> = observer((props) => {
  const { deviceStore, portStore, itemDefinitionStore, itemStore, userStore } = useStores()

  useEffect(() => {
    // [eschwartz-TODO] Hardcoded user id
    deviceStore.getDevices(env.HARDCODED_TEST_USER_ID)
    //itemStore.getItems(env.HARDCODED_TEST_USER_ID)
    userStore.getUser(env.HARDCODED_TEST_USER_ID)
    // [eschwartz-TODO] Get only item defs for user
    //itemDefinitionStore.getItemDefinitions(env.HARDCODED_TEST_USER_ID);
    //portStore.getPorts(env.HARDCODED_TEST_USER_ID)
  }, [])

  return (
    <View style={FULL}>
      <Wallpaper />
      <View style={SCREEN_HEADER}>
        <Text style={SCREEN_HEADER_TEXT} tx={"itemScreen.header"} />
      </View>
      <Meter />
      <ItemsWrapper
        vertical={false}
        listType={"active"}
        emptyMessage={"Waiting for device to connect..."}
      />
    </View>
  )
})
