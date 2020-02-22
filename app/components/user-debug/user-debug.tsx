import * as React from "react"
import { observer } from "mobx-react-lite"
import { useNavigation } from 'react-navigation-hooks'
import { useStores } from "../../models/root-store"
import { View } from "react-native"
import { styles } from "./user-debug.styles"
import { Text, Button } from "../../components"

import auth from '@react-native-firebase/auth'

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
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.text}>
          <Text style={styles.label}>isLoggedIn:</Text> {isLoggedIn ? "true" : "false"}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>uid:</Text> {uid}</Text>
        <Text style={styles.text}>
          <Text style={styles.label}>phoneNumber:</Text> {phoneNumber}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>displayName:</Text> {displayName}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>isAnonymous:</Text> {isAnonymous ? "true" : "false"}
        </Text>
        
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>
          <Text style={styles.label}>email:</Text> {email}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>emailVerified:</Text> {emailVerified ? "true" : "false"}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>providerId:</Text> {providerId}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>photoURL:</Text> {photoURL}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>metrics:</Text> {JSON.stringify(metrics)}
        </Text>
      </View>
      <View style={styles.buttonColumn}>
        <Button
          style={styles.button}
          text={"Go Login"}
          onPress={() => navigate('login')} />
        <Button
          style={styles.button}
          text={"Logout"}
          onPress={logoutPressed} />
        
      </View>
      <View style={styles.buttonColumn}>
        
        <Button
          style={styles.button}
          text={"Go Items"}
          onPress={() => navigate('primaryStack')} />
        <Button
          style={styles.button}
          text={"Go Device"}
          onPress={() => navigate('device')} />
        <Button
          style={styles.button}
          text={"Go Settings"}
          onPress={() => navigate('settings')} />
      </View>
    </View>
  )
})
