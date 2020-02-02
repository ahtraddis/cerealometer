import * as React from "react"
import { useEffect, useState } from "react"
import { useStores } from "../../models/root-store"
import { View, Image, StyleSheet } from "react-native"
import { Text, LoadingButton } from "../"
import { TEXT, BOLD } from "../../styles/common"
import { color } from "../../theme"
import * as delay from "../../utils/delay"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  imageColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  textColumn: {
    flex: 4,
    paddingLeft: 10,
    paddingRight: 5
  },
  buttonColumn: {
    flex: 0,
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
  button: {
    backgroundColor: "#5D2555",
    padding: 5,
    justifyContent: 'center',
  },
  buttonText: {
    ...TEXT,
    fontSize: 12,
  },
  title: {
    ...BOLD,
    fontSize: 16,
    color: color.palette.meterRed,
  },
  message: {
    fontSize: 14,
    color: '#000',
  },
})

const PLACEHOLDER_IMG = 'https://placeimg.com/50/50/animals'

export interface MessageProps {
  id: string
  title?: string
  message?: string
  image_url?: string
  create_time?: number
}

/**
 * Message component
 *
 */
export function Message(props: MessageProps) {
  const { id, title, message, image_url } = props

  const { userStore, messageStore } = useStores()
  const [loading, setLoading] = useState(false)

  useEffect(() => {

  }, [])

  const dismiss = async() => {
    console.tron.log(`dimissing id ${id}`)
    setLoading(false)
    //await delay.delay(1000)
    const result = await messageStore.deleteMessage(userStore.user.uid, id)
    setLoading(true)
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageColumn}>
        <Image style={styles.image} source={{uri: image_url ? image_url : PLACEHOLDER_IMG}}/>
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <View style={styles.buttonColumn}>
        <LoadingButton
          isLoading={loading}
          style={styles.button}
          textStyle={styles.buttonText}
          tx={"message.dismissButtonLabel"}
          onPress={dismiss} />
      </View>
    </View>
  )
}