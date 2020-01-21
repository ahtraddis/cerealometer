import * as React from "react"
import { View, ViewStyle, Image, ImageStyle, StyleSheet } from "react-native"
import { Text } from "../"

import * as conversion from "../../utils/conversion"

const PORT: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  backgroundColor: "#333",
  marginTop: 10
}
const PORT_IMAGE_VIEW: ViewStyle = {
  flex: 1,
  height: 200,
  borderTopWidth: 5,
  borderBottomWidth: 5,
  borderColor: 'transparent'
}
const PORT_IMAGE: ImageStyle = {
  flex: 1,
  resizeMode: 'contain',
}
const PORT_INFO_VIEW: ViewStyle = {
  flex: 1,
  height: 200,
  justifyContent: "center",
}
const PORT_INFO: ViewStyle = {
  padding: 10
}
const PORT_ITEM: ViewStyle = {}
const PORT_SLOT: ViewStyle = {}
const PORT_WEIGHT: ViewStyle = {}
const PORT_STATUS: ViewStyle = {}

export interface PortProps {
  slot: number
  item_id: string
  status: string
  weight_kg: number
}

export function Port(props: PortProps) {

  // grab the props
  const { slot, item_id, status, weight_kg, ...rest } = props

  let statusColor = "transparent";
  if (props.status == "LOADED") {
    statusColor = "green"
  } else if (props.status == "UNLOADED") {
    statusColor = "red"
  } else if (props.status == "VACANT") {
    statusColor = "transparent"
  } else {
    statusColor = "transparent"
  }

  return (
    <View style={PORT}>
      <View style={[PORT_IMAGE_VIEW, {borderBottomColor: statusColor}]}>
        <Image style={PORT_IMAGE} source={{uri: props.image_url}} />
      </View>
      <View style={PORT_INFO_VIEW}>
        <View style={PORT_INFO}>
          <View style={PORT_SLOT}>
            <Text>
              slot: {props.slot}
            </Text>
          </View>
          { props.item.name && (
              <View style={PORT_ITEM}>
                <Text>
                  item.name: {props.item.name},
                </Text>
              </View>
            )
          }
          <View style={PORT_WEIGHT}>
            <Text>
              weight_kg: {conversion.kilogramsToOunces(props.weight_kg).toFixed(1)} oz
            </Text>
          </View>
          <View style={PORT_STATUS}>
            <Text>
              status: {props.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
