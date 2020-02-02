import * as React from "react"
import { observer } from "mobx-react-lite"
import { useNavigation } from 'react-navigation-hooks'
import { useStores } from "../../models/root-store"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text, Button } from "../../components"

import auth from '@react-native-firebase/auth'

const USER_DEBUG: ViewStyle = {
  //display: 'none', // show/hide on all screens
  marginBottom: 15,
  marginTop: 0,
  paddingTop: 5,
  paddingBottom: 0,
  borderTopColor: '#555',
  borderTopWidth: 1,
  flex: 0,
  flexDirection: 'row'
}
const COLUMN: ViewStyle = {
  flex: 1,
  paddingLeft: 5,
  paddingRight: 5,
}
const BUTTON_COLUMN: ViewStyle = {
  flex: 0,
  paddingRight: 5
}
const BUTTON: ViewStyle = {
  backgroundColor: "#5D2555",
  padding: 5,
  marginTop: 0,
  marginBottom: 5,
}
const TINY_TEXT: TextStyle = {
  fontSize: 10,
  color: '#777',
}
const TINY_LABEL: TextStyle = {
  ...TINY_TEXT,
  color: '#bbb',
}


export const UserDebug = observer((props) => {
  const { userStore } = useStores()
  const { navigate } = useNavigation()
  const {
    isLoggedIn,
    uid,
    phoneNumber,
    displayName,
    isAnonymous,
    email,
    emailVerified,
    providerId,
    photoURL,
    metrics
  } = userStore.user

  const logoutPressed = async() => {
    try {
      await auth().signOut();
      navigate('login')
    } catch (e) {
      console.tron.error(e.message);
    }
  }

  return (
    <View style={USER_DEBUG}>
      <View style={COLUMN}>
        <Text style={TINY_TEXT}>
          <Text style={TINY_LABEL}>isLoggedIn:</Text> {isLoggedIn ? "true" : "false"}
        </Text>
        <Text style={TINY_TEXT}>
          <Text style={TINY_LABEL}>uid:</Text> {uid}</Text>
        <Text style={TINY_TEXT}>
          <Text style={TINY_LABEL}>phoneNumber:</Text> {phoneNumber}
        </Text>
        <Text style={TINY_TEXT}>
          <Text style={TINY_LABEL}>displayName:</Text> {displayName}
        </Text>
        <Text style={TINY_TEXT}>
          <Text style={TINY_LABEL}>isAnonymous:</Text> {isAnonymous ? "true" : "false"}
        </Text>
        
      </View>
      <View style={COLUMN}>
        <Text style={TINY_TEXT}>
          <Text style={TINY_LABEL}>email:</Text> {email}
        </Text>
        <Text style={TINY_TEXT}>
          <Text style={TINY_LABEL}>emailVerified:</Text> {emailVerified ? "true" : "false"}
        </Text>
        <Text style={TINY_TEXT}>
          <Text style={TINY_LABEL}>providerId:</Text> {providerId}
        </Text>
        <Text style={TINY_TEXT}>
          <Text style={TINY_LABEL}>photoURL:</Text> {photoURL}
        </Text>
        <Text style={TINY_TEXT}>
          <Text style={TINY_LABEL}>metrics:</Text> {JSON.stringify(metrics)}
        </Text>
      </View>
      <View style={BUTTON_COLUMN}>
        <Button
          style={BUTTON}
          text={"Go Login"}
          onPress={() => navigate('login')} />
        <Button
          style={BUTTON}
          text={"Logout"}
          onPress={logoutPressed} />
        
      </View>
      <View style={BUTTON_COLUMN}>
        
        <Button
          style={BUTTON}
          text={"Go Items"}
          onPress={() => navigate('primaryStack')} />
        <Button
          style={BUTTON}
          text={"Go Device"}
          onPress={() => navigate('device')} />
        <Button
          style={BUTTON}
          text={"Go Settings"}
          onPress={() => navigate('settings')} />
      </View>
    </View>
  )
})
