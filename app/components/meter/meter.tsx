import * as React from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models/root-store"
import { UserStore } from "../../models/user-store"
import { View, ViewStyle, SafeAreaView } from "react-native"
import { Text } from "../"

import RNSpeedometer from 'react-native-speedometer'

const METER: ViewStyle = {
  backgroundColor: "#ffffff",
  paddingTop: 10,
  paddingBottom: 70,
  marginBottom: 10,
}

export interface MeterProps {
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
}

// [TODO] Rewrite with observer wrapper on Meter (syntax?)
const Display = observer(() => {
  const { userStore } = useStores()
  return (
    <SafeAreaView style={METER}>
      <RNSpeedometer value={userStore.user.meter} size={265} />
    </SafeAreaView>
  )
})

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function Meter(props: MeterProps) {
  // grab the props
  const { tx, text, style, ...rest } = props
  const textStyle = { }

  return <Display />
}

