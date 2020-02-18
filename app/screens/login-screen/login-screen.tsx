import * as React from "react"
import { useStores } from "../../models/root-store"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { NavigationInjectedProps } from "react-navigation"
import { View, Image } from "react-native"
import { Wallpaper, Screen, LoginForm, UserDebug } from "../../components"
import { FULL, SCREEN_CONTAINER } from "../../styles/common"
const logo = require("./noun_Cereal_15832.png")
import auth from '@react-native-firebase/auth'

export interface LoginScreenProps extends NavigationInjectedProps<{}> {}

export const LoginScreen: React.FunctionComponent<LoginScreenProps> = observer((props) => {
  const { userStore } = useStores()

  // Set an initializing state while Firebase connects
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user) {
    userStore.updateAuthState(user)
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  })

  return (
    <View style={FULL} >
      <Wallpaper />
      <View style={{alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
      <Image style={{width: 150, height: 150}} source={logo} />
      </View>
      <Screen style={SCREEN_CONTAINER} preset="scroll">
        <LoginForm />
        <UserDebug />
      </Screen>
    </View>
  )
})
