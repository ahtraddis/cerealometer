import * as React from "react"
import { useNavigation } from 'react-navigation-hooks'
import { View, StyleSheet } from "react-native"
import { Text, Wallpaper, Button, UserDebug } from "../../components"
import { FULL } from "../../styles/common"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  text: {
    color: '#bbb',
  },
  button: {
    width: 120,
    backgroundColor: "#5D2555",
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
  },
})

export const LoginRequired = (props) => {
  const { navigate } = useNavigation()
  
  return (
    <View style={FULL} >
      <Wallpaper />
      <View style={styles.container}>
        <Text style={styles.text} tx={"loginRequired.message"} />
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          tx={"loginRequired.buttonLabel"}
          onPress={() => navigate('login')} />
      </View>
      <UserDebug />
    </View>
  )
}