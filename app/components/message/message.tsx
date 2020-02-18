import * as React from "react"
import { useState } from "react"
import { useStores } from "../../models/root-store"
import { View, Image } from "react-native"
import { Text, LoadingButton } from "../"
import { styles } from "./message.styles"
var moment = require('moment');
import * as delay from "../../utils/delay"

const PLACEHOLDER_IMAGE_URL = 'https://placeimg.com/50/50/animals'

export interface MessageProps {
  id: string
  title?: string
  message?: string
  image_url?: string
  create_time?: number
}

/**
 * Message component
 */
export function Message(props: MessageProps) {
  const { id, title, message, image_url, create_time } = props
  const { userStore, messageStore } = useStores()
  const [loading, setLoading] = useState(false)

  const dismiss = async() => {
    console.tron.log(`dismissing id ${id}`)
    setLoading(true)
    await delay.delay(250)
    await messageStore.deleteMessage(userStore.user.uid, id)
    setLoading(false)
  }

  return (
    <View>
      <View style={styles.timestamp}>
        <Text style={styles.timestampText}>{moment.unix(create_time).fromNow()}</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.imageColumn}>
          <Image
            style={styles.image}
            source={{uri: image_url ? image_url : PLACEHOLDER_IMAGE_URL}}/>
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
    </View>
  )
}