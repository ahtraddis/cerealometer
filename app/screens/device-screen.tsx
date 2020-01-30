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
    // [eschwartz-TODO] Hardcoded user id
    //deviceStore.getDevices(env.HARDCODED_TEST_USER_ID);
    //itemDefinitionStore.getItemDefinitions(env.HARDCODED_TEST_USER_ID);
    //itemStore.getItems(env.HARDCODED_TEST_USER_ID);
    //userStore.getUser(env.HARDCODED_TEST_USER_ID);
  }, [])

  const renderDevice = ({ device }) => {
    return (
      <Device {...device} />
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
        { (deviceStore.devices.length > 0) &&
          <FlatList
            style={DEVICE_LIST}
            data={deviceStore.devices}
            renderItem={renderDevice}
            //extraData={{ extraDataForMobX: deviceStore.devices.length > 0 ? deviceStore.devices[0] : "" }}
            keyExtractor={device => device.id}
          />
        }
      </Screen>
    </View>
  )
})
