import * as React from "react"
import { useStores } from "../models/root-store"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import * as env from "../environment-variables"
import { NavigationScreenProps } from "react-navigation"
import { View, Text } from "react-native"
import { Wallpaper, Items } from "../components"
import { FULL, SCREEN_HEADER, SCREEN_HEADER_TEXT } from "../styles/common"

export const ScreenHeader = (props) => {
  const { text } = props
  return (
    <View style={SCREEN_HEADER}>
      <Text style={SCREEN_HEADER_TEXT}>{text}</Text>
    </View>
  )
}

export interface ItemsWrapperProps {
  listType?: string
  emptyMessage?: string
  vertical?: boolean
}

const ItemsWrapper: React.FunctionComponent<ItemsWrapperProps> = observer((props) => {
  const { userStore, itemStore, portStore } = useStores()
  //const [count, setCount] = useState(0);
  const { listType, emptyMessage, vertical, ...rest } = props
  useEffect(() => {}, [])
  // [eschwartz-TODO] Hacks to force render. This needs to visibly display something in userStore to make it render observable changes.
  return (
      <Items
        {...props}
        dummyUserProp={(userStore.user && userStore.user.metrics) ? userStore.user.metrics.overallPercentage : 0}
        dummyItemProp={(itemStore.items && itemStore.items.length) ? itemStore.items[0] : {}}
        dummyPortProp={(portStore.ports && portStore.ports.length) ? portStore.ports[0] : {}}
      />
  )
});

export interface OverstockScreenProps extends NavigationScreenProps<{}> {}

export const OverstockScreen: React.FunctionComponent = observer((props) => {
  const { deviceStore, itemDefinitionStore, itemStore, userStore } = useStores()

  useEffect(() => {
    // [eschwartz-TODO] Hardcoded user id
    //deviceStore.getDevices(env.HARDCODED_TEST_USER_ID);
    //itemStore.getItems(env.HARDCODED_TEST_USER_ID);
    // [eschwartz-TODO] Get only item defs for user
    //itemDefinitionStore.getItemDefinitions(env.HARDCODED_TEST_USER_ID);
    //userStore.getUser(env.HARDCODED_TEST_USER_ID);
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
