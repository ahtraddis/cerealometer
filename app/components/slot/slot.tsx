import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle } from "react-native"
import { Text, Icon } from "../"
import { spacing } from "../../theme"

import * as conversion from "../../utils/conversion"

const SLOT: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  width: "100%",
  backgroundColor: "green",
}
const SLOT_NUMBER: ViewStyle = {
  width: "10%",
  alignItems: "center",
  backgroundColor: "forestgreen",
  padding: 10,
}
const SLOT_NAME: ViewStyle = {
  width: "45%",
  padding: 10
}
const SLOT_STATUS: ViewStyle = {
  width: "45%",
  padding: 10,
  alignItems: "flex-end"
}


export interface SlotProps {
  id: identifier,
  name: string,
  status: string,
  weight_kg: float,
}

export function Slot(props: SlotProps) {
  return (
    <View style={SLOT}>
      <View style={SLOT_NUMBER}>
        <Text>n</Text>
      </View>
      <View style={SLOT_NAME}>
        <Text>
          {conversion.kilogramsToOunces(props.weight_kg).toFixed(1)} oz
        </Text>
      </View>
      <View style={SLOT_STATUS}>
        <Text>
          {props.status}
        </Text>
      </View>
    </View>
  )
}
