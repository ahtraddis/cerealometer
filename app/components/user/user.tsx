import * as React from "react"
import { useStores } from "../../models/root-store"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Text } from "../"

export interface UserProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  name: string
  email: string
  meter: number
  user_id: string
  // [eschwartz-TODO] Not sure how to handle device list
  //devices:
}

const Info = observer(() => {
  const { userStore } = useStores()
  let user = userStore.user
  return (
    <View>
      <Text>name: {userStore.user.name}</Text>
      <Text>email: {user.email}</Text>
      <Text>meter: {user.meter}</Text>
      <Text>user_id: {user.user_id}</Text>
    </View>
  )
})

/**
 * Display some user info for debugging
 */
export function User(props: UserProps) {
  // grab the props
  const { tx, text, style, name, email, meter, user_id, ...rest } = props
  //const textStyle = { }

  return (
    <Info />
  )

}
