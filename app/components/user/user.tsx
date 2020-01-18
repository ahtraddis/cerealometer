import * as React from "react"
import { useStores } from "../../models/root-store"
import { observer } from "mobx-react-lite"
import { UserMetrics } from "../../models/user"
import { View } from "react-native"
import { Text } from "../"

const TEXT: TextStyle = {
  color: '#777',
}

export interface UserProps {
  id: string
  name: string
  email: string
  metrics: UserMetrics
  // [eschwartz-TODO] Not sure how to handle device list
  //devices:
}

const Info = observer(() => {
  const { userStore } = useStores()
  let user = userStore.user
  return (
    <View>
      <Text style={TEXT}>id: {user.id}</Text>
      <Text style={TEXT}>name: {userStore.user.name}</Text>
      <Text style={TEXT}>email: {user.email}</Text>
      <Text style={TEXT}>metrics: {JSON.stringify(user.metrics, null, 2)}</Text>
    </View>
  )
})

/**
 * Display some user info for debugging
 */
export function User(props: UserProps) {
  // grab the props
  //const { id, name, email, metrics, ...rest } = props
  //const textStyle = { }

  return (
    <Info />
  )

}