import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle } from "react-native"
import { Text, Icon } from "../"
import { spacing } from "../../theme"

import * as conversion from "../../utils/conversion"

const PORT: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  width: "100%",
  backgroundColor: "green",
}
const PORT_NUMBER: ViewStyle = {
  width: "10%",
  alignItems: "center",
  backgroundColor: "forestgreen",
  padding: 10,
}
const PORT_NAME: ViewStyle = {
  width: "45%",
  padding: 10
}
const PORT_STATUS: ViewStyle = {
  width: "45%",
  padding: 10,
  alignItems: "flex-end"
}

export interface PortProps {
  id: identifier,
  slot: integer,
  item: string,
  status: string,
  weight_kg: float,
}

export function Port(props: PortProps) {
  return (
    <View style={PORT}>
      <View style={PORT_NUMBER}>
        <Text>{props.slot}</Text>
      </View>
      <View style={PORT_NAME}>
        <Text>
          {conversion.kilogramsToOunces(props.weight_kg).toFixed(1)} oz
        </Text>
      </View>
      <View style={PORT_STATUS}>
        <Text>
          {props.status}
        </Text>
      </View>
    </View>
  )
}
