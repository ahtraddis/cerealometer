import * as React from "react"
import { useStores } from "../../models/root-store"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { NavigationInjectedProps } from "react-navigation"
import { View, FlatList } from "react-native"
import { Screen, Wallpaper, Text, LoginRequired, UserDebug } from "../../components"
import { Device, Button } from "../../components"
import { FULL, SCREEN_CONTAINER, SCREEN_HEADER, SCREEN_HEADER_TEXT, EMPTY_MESSAGE, EMPTY_MESSAGE_TEXT } from "../../styles/common"
import { styles } from "./device-screen.styles"

export interface DeviceScreenProps extends NavigationInjectedProps<{}> {}

export const DeviceScreen: React.FunctionComponent<DeviceScreenProps> = observer((props) => {
  const { deviceStore, userStore } = useStores()
  const [refreshing, setRefreshing] = useState(false)

  let isLoggedIn = userStore.user.isLoggedIn

  useEffect(() => {
    if (isLoggedIn) {
      let uid = userStore.user.uid
      deviceStore.getDevices(uid);
    }
  }, [])

  const renderDevice = ({ item }) => {
    return (
      <Device {...item} />
    )
  }

  const onRefresh = async() => {
    //__DEV__ && console.tron.log("onRefresh()")    
    if (isLoggedIn) {
      let uid = userStore.user.uid
      setRefreshing(true)
      await deviceStore.getDevices(uid)
      setRefreshing(false)
    }
  }

  const Empty = () => {
    return (
      <View style={EMPTY_MESSAGE}>
        <Text style={EMPTY_MESSAGE_TEXT} tx={"deviceScreen.emptyLabel"} />
      </View>
    )
  }

  const addDevice = () => {
    if (isLoggedIn) {
      let uid = userStore.user.uid
      deviceStore.addDevice(uid);
    }
  }

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
          <Text style={SCREEN_HEADER_TEXT} tx={"deviceScreen.header"} />
        </View>
        <FlatList
          onRefresh={onRefresh}
          refreshing={refreshing}
          data={deviceStore.devices}
          ListEmptyComponent={Empty}
          renderItem={renderDevice}
          extraData={{ extraDataForMobX: deviceStore.devices.length > 0 ? deviceStore.devices[0] : "" }}
          keyExtractor={device => device.id}
        />
        <Button style={styles.button} textStyle={styles.buttonText} tx={"deviceScreen.addDevice"} onPress={addDevice} />
      </Screen>
      <UserDebug />
    </View>
  )
})
