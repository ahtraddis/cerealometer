import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle } from "react-native"
import { Text, Icon } from "../"
import { spacing } from "../../theme"
import { Slot } from "../slot/slot"
import { SlotModel } from "../../models/slot"

const DEVICE: ViewStyle = {
  marginBottom: 10,
}
const DEVICE_NAME: ViewStyle = {
  alignItems: "center",
  backgroundColor: "darkgreen",
  padding: 10,
}
const DEVICE_TEXT: ViewStyle = {
  color: "#fff",
}


export interface DeviceProps {
  id: identifier,
  name: string,
  led_state: integer,
  slots: array,//Array<SlotModel>,
}


export const Device: React.FunctionComponent<DeviceProps> = props => {

  return (
    <View style={DEVICE}>
      <View style={DEVICE_NAME}>
        <Text style={DEVICE_TEXT}>
          {props.name}
        </Text>
      </View>
      { props.slots && props.slots.map((slot, index) => {
        return (
          <Slot key={index} name={slot.name} status={slot.status} weight_kg={slot.weight_kg} />
        )
      })}
    </View>
  )
}
