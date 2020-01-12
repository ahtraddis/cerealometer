import * as React from "react"
import { View, ViewStyle, Image } from "react-native"
import { Text } from "../"

export interface ScrollItemProps {
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

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function ScrollItem(props: ScrollItemProps) {
  // grab the props
  const { tx, text, style, ...rest } = props
  const textStyle = { }

  return (
    <View style={{height: 200, width: 350}} {...rest}>
      {props.children}
    </View>
  )
}
