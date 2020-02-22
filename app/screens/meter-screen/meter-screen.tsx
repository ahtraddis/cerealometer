import * as React from "react"
import { useStores } from "../../models/root-store"
import { useEffect } from "react"
import { useNavigation } from 'react-navigation-hooks'
import { observer } from "mobx-react-lite"
import { UserSnapshot } from "../../models/user"
import { NavigationInjectedProps } from "react-navigation"
import { View, TouchableHighlight } from "react-native"
import { styles } from "./meter-screen.styles"
import { Screen, Text, LoginRequired, Meter, Bargraph, Wallpaper, LoadingButton } from "../../components"
import { FULL, SCREEN_HEADER, SCREEN_HEADER_TEXT, SCREEN_CONTAINER } from "../../styles/common"
const { get } = require('underscore.get')
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth';

export interface MeterScreenProps extends NavigationInjectedProps<{}> {}

export const MeterScreen: React.FunctionComponent<MeterScreenProps> = observer((props) => {
  
  const { userStore, deviceStore, portStore, itemStore, itemDefinitionStore } = useStores();
  const { navigate } = useNavigation()

  function onUserChange(snapshot: UserSnapshot) {
    userStore.setUser(snapshot.val())
  }

  let isLoggedIn = userStore.user.isLoggedIn

  useEffect(() => {
    let refSet, userRef
    if (isLoggedIn) {
      refSet = true
      let uid = userStore.user.uid
      userRef = database().ref(`/users/${uid}`)
      userRef.on('value', onUserChange);
    }
    if (refSet) {
      return () => userRef.off('value', onUserChange)
    }
  }, [])

  const logoutPressed = async() => {
    try {
      await auth().signOut();
      // [eschwartz-TODO] Check best practices for clearing async storage upon logout
      userStore.reset()
      deviceStore.reset()
      portStore.reset()
      itemStore.reset()
      itemDefinitionStore.reset()
      navigate('login')
    } catch (e) {
      console.tron.error(e.message);
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
          <Text style={SCREEN_HEADER_TEXT} tx={"meterScreen.header"} />
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 0, marginTop: 10, marginBottom: 10}}>
            <Meter value={100.0 * get(userStore, 'user.metrics.overall', 0)} />
          </View>
          <View style={{flex: 1}}>
            <Bargraph metrics={get(userStore, 'user.metrics', {})} />
          </View>

          <LoadingButton style={styles.buttonContainer} tx={"login.logoutButton"} onPress={() => logoutPressed()} />

          {/* <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', marginBottom: 20, display: 'none'}}>
            <TouchableHighlight
              style={styles.buttonContainer}
              onPress={() => logoutPressed()}
            >
              <Text style={styles.loginText} tx={"login.logoutButton"} />
            </TouchableHighlight>
          </View> */}
        </View>
      </Screen>
    </View>
  )
})
