import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle, Image, StyleSheet } from "react-native"
import { Text, Icon } from "../"
import { spacing } from "../../theme"

import * as conversion from "../../utils/conversion"

const PORT: ViewStyle = {
  flex: 1,
  //width: 300,
  //borderRadius: 10,
  flexDirection: "row",
  //height: 150,
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
const PORT_IMAGE: ViewStyle = {
  flex: 1,
  resizeMode: 'contain',
}
const PORT_INFO_VIEW: ViewStyle = {
  flex: 1, height: 200, justifyContent: "center"
}
const PORT_INFO: ViewStyle = {
  padding: 10
}
const PORT_ITEM: ViewStyle = {}
const PORT_SLOT: ViewStyle = {
  //width: "10%",
  //alignItems: "center",
  //backgroundColor: "forestgreen",
  //padding: 10,
}
const PORT_WEIGHT: ViewStyle = {
  //width: "45%",
  //padding: 10
}
const PORT_STATUS: ViewStyle = {
  //width: "45%",
  //padding: 10,
  //alignItems: "flex-end"
}
const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export interface PortProps {
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

  id: identifier,
  slot: integer,
  item: string,
  status: string,
  weight_kg: float,
}

export function Port(props: PortProps) {

  // grab the props
  const { tx, text, style, ...rest } = props
  const textStyle = { }

  let statusColor = "transparent";
  if (props.status == "present") {
    statusColor = "green"
  } else if (props.status == "absent") {
    statusColor = "red"
  } else if (props.status == "vacant") {
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
