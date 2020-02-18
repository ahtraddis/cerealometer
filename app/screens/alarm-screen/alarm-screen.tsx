import * as React from "react"
import { useStores } from "../../models/root-store"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { UserSnapshot } from "../../models/user"
import { NavigationInjectedProps } from "react-navigation"
import { View, SafeAreaView } from "react-native"
import { Screen, Text, LoginRequired, Messages, Wallpaper } from "../../components"
import { FULL, SCREEN_HEADER, SCREEN_HEADER_TEXT, SCREEN_CONTAINER } from "../../styles/common"
import database from '@react-native-firebase/database'

export interface AlarmScreenProps extends NavigationInjectedProps<{}> {}

export const AlarmScreen: React.FunctionComponent<AlarmScreenProps> = observer((props) => {
  const { userStore } = useStores();

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
          <Text style={SCREEN_HEADER_TEXT} tx={"alarmScreen.header"} />
        </View>
        <SafeAreaView style={{marginTop: 10, paddingTop: 0, paddingBottom: 40}}>
          <Messages />
        </SafeAreaView>
      </Screen>
    </View>
  )
})
