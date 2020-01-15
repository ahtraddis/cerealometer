import * as React from "react"
import { useStores } from "../models/root-store"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import * as env from "../environment-variables"
import { NavigationScreenProps } from "react-navigation"
import { color, spacing } from "../theme"
import { ViewStyle, View, FlatList, Text } from "react-native"
import { Screen, Wallpaper } from "../components"
import { Device } from "../components"
import { FULL } from "../styles/common"

const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const DEVICE_LIST: ViewStyle = {
  marginBottom: spacing.large,
}

export interface DeviceScreenProps extends NavigationScreenProps<{}> {}

export const DeviceScreen: React.FunctionComponent<DeviceScreenProps> = observer((props) => {
  const { deviceStore, itemDefinitionStore, itemStore, userStore } = useStores()

  useEffect(() => {
    deviceStore.getDevices(env.HARDCODED_TEST_USER_ID);
    // [eschwartz-TODO] Hardcoded user ID
    itemStore.getItems(env.HARDCODED_TEST_USER_ID);
    itemDefinitionStore.getItemDefinitions();
    // [eschwartz-TODO] Hardcoded user ID
    userStore.getUser(env.HARDCODED_TEST_USER_ID);
    //console.log("device-screen: deviceStore: ", JSON.stringify(deviceStore, null, 2));
    //console.log("device-screen: itemDefinitionStore: ", JSON.stringify(itemDefinitionStore, null, 2));
    //console.log("device-screen: userStore: ", JSON.stringify(userStore, null, 2));
    //console.log("device-screen: itemStore: ", JSON.stringify(itemStore, null, 2));
  }, [])

  const renderDevice = ({ item }) => {
    //console.log("device-screen: renderDevice(): item: ", item)
    return (
      <Device {...item} />
    )
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER}>
        { (deviceStore.devices.length == 0) &&
          <View style={{backgroundColor: 'white', padding: 50}}>
            <Text>No devices</Text>
          </View>
        }
        <FlatList
          style={DEVICE_LIST}
          data={deviceStore.devices}
          renderItem={renderDevice}
          //extraData={{ extraDataForMobX: deviceStore.devices.length > 0 ? deviceStore.devices[0] : "" }}
          keyExtractor={device => device.device_id}
        />
      </Screen>
    </View>
  )
})
