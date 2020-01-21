import * as React from "react"
import { useStores } from "../models/root-store"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import * as env from "../environment-variables"
import { NavigationScreenProps } from "react-navigation"
import { View, ViewStyle } from "react-native"
import { Wallpaper, Items, Meter, User, Screen } from "../components"
import { FULL } from "../styles/common"

const USER: ViewStyle = {
  marginTop: 50,
  paddingTop: 10,
  borderTopWidth: 1,
  borderTopColor: '#333',
}

export interface ItemsWrapperProps {
  listType?: string
  showSlotHeader?: boolean
  emptyMessage?: string
}

export const ItemsWrapper: React.FunctionComponent<ItemsWrapperProps> = observer((props) => {
  const { userStore, itemStore, portStore } = useStores()
  const [count, setCount] = useState(0);
  const { listType, showSlotHeader, emptyMessage, ...rest } = props
  useEffect(() => {
    // [eschwartz-TODO] Hack to force rerender on Items. Not sure why this is working!
    //setCount(1)
  }, [])
  // This needs to visibly display something in userStore to make it render observable changes.
  return (
      <Items
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
    // [eschwartz-TODO] Hardcoded user ID
    deviceStore.getDevices(env.HARDCODED_TEST_USER_ID);

    // [eschwartz-TODO] Hardcoded user ID
    itemStore.getItems(env.HARDCODED_TEST_USER_ID);
    // [eschwartz-TODO] Get only item defs for user
    itemDefinitionStore.getItemDefinitions();
    // [eschwartz-TODO] Hardcoded user ID
    //userStore.clearUser()
    userStore.getUser(env.HARDCODED_TEST_USER_ID);
    //console.log("item-screen: itemDefinitionStore.item_definitions:", JSON.stringify(itemDefinitionStore.itemDefinitions, null, 2))
    //console.log("item-screen: userStore.user:", JSON.stringify(userStore.user, null, 2))
    // [eschwartz-TODO] Hardcoded user ID
    portStore.getPorts(env.HARDCODED_TEST_USER_ID)
    //console.log("item-screen: portStore.ports:", JSON.stringify(portStore.ports, null, 2))
    // console.log("item-screen: itemStore.items:", JSON.stringify(itemStore.items, null, 2))
    //console.log("item-screen: deviceStore.devices:", JSON.stringify(deviceStore.devices, null, 2))
  }, [])

  return (
    <View style={FULL}>
      {/*<Wallpaper />*/}
      <Screen preset="scroll">
        <Meter />
        <ItemsWrapper
          listType={"active"}
          showSlotHeader={true}
          emptyMessage={"No items yet. Go to Overstock to add!"}
        />
        {/*<View style={USER}>
          <User />
        </View>*/}
      </Screen>
    </View>
  )
})
