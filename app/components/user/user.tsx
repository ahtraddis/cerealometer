import * as React from "react"
import { useState, useEffect } from 'react'
import { useStores } from "../../models/root-store"
import { UserStore } from "../../models/user-store"
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
  meter: float
  user_id: string
  //devices
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
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function User(props: UserProps) {
  // grab the props
  const { tx, text, style, ...rest } = props
  const textStyle = { }

  const { userStore } = useStores()

  useEffect(() => {
    //console.log("user.tsx props : ", props)
  })

  return (
    <Info />
  )
  
}
