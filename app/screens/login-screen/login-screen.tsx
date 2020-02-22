import * as React from "react"
import { useStores } from "../../models/root-store"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { NavigationInjectedProps } from "react-navigation"
import { View } from "react-native"
import { Wallpaper, Screen, LoginForm, UserDebug } from "../../components"
import { FULL, SCREEN_CONTAINER } from "../../styles/common"
import auth from '@react-native-firebase/auth'

export interface LoginScreenProps extends NavigationInjectedProps<{}> {}

export const LoginScreen: React.FunctionComponent<LoginScreenProps> = observer((props) => {
  const { userStore } = useStores()

  // Set an initializing state while Firebase connects
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user) {
    //console.tron.log("user: ", user)
    userStore.updateAuthState(user)
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber // unsubscribe on unmount
  })

  return (
    <View style={FULL} >
      <Wallpaper />
      <Screen style={SCREEN_CONTAINER} preset="scroll">
        <LoginForm />
        <UserDebug />
      </Screen>
    </View>
  )
})
