import * as React from "react"
import { useState, useEffect } from 'react'
import { View, ViewStyle, ImageStyle, TextStyle, Image, StyleSheet } from "react-native"
import { Text } from "../"
import { spacing } from "../../theme"
import * as conversion from "../../utils/conversion"

const ITEM: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  //height: 150,
  backgroundColor: "#333",
  marginTop: 10
}
const ITEM_IMAGE_VIEW: ViewStyle = {
  flex: 1,
  height: 200,
  borderTopWidth: 5,
  borderBottomWidth: 5,
  borderColor: 'transparent'
}
const ITEM_IMAGE: ViewStyle = {
  flex: 1,
  resizeMode: 'contain',
}
const ITEM_INFO_VIEW: ViewStyle = {
  flex: 1,
  height: 200,
  justifyContent: "center"
}
const ITEM_INFO: ViewStyle = {
  padding: 10
}
const ITEM_ITEM: ViewStyle = {
  
}
const ITEM_DEVICE: ViewStyle = {

}
const ITEM_SLOT: ViewStyle = {

}

const ITEM_WEIGHT: ViewStyle = {
  //width: "45%",
  //padding: 10
}
const ITEM_STATUS: ViewStyle = {
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

export interface ItemProps {
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

  //id: identifier,
  device: string,
  item_definition: string,
  last_known_weight_kg: float,
  slot: integer,
  user: string,

  item_definition_obj: object,
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function Item(props: ItemProps) {
  // grab the props
  const { tx, text, style, ...rest } = props
  const textStyle = { }

  useEffect(() => {
    //console.log("(item) props: ", props)
  });

  return (
    <View style={ITEM}>
      <View style={ITEM_IMAGE_VIEW}>
        <Image style={ITEM_IMAGE} source={{uri: props.item_definition_obj.image_url}} />
      </View>
      <View style={ITEM_INFO_VIEW}>
        <View style={ITEM_INFO}>
          {/*<View style={ITEM_DEVICE}>
            <Text>
              device_id: {props.device_id}
            </Text>
          </View>*/}
          {/*<View style={ITEM_SLOT}>
            <Text>
              slot: {props.slot.toString()}
            </Text>
          </View>*/}
          { props.item_definition && (
              <View style={ITEM_ITEM}>
                {/*<Text>
                  item_definition: {props.item_definition},
                </Text>*/}
                <Text>
                  name: {props.item_definition_obj.name}
                </Text>
              </View>
            )
          }
          <View style={ITEM_WEIGHT}>
            <Text>
              net weight: {parseFloat(props.item_definition_obj.weight_grams / 1000).toFixed(3)} kg
            </Text>
          </View>
          <View style={ITEM_WEIGHT}>
            <Text>
              last_known_weight_kg: {parseFloat(props.last_known_weight_kg).toFixed(3)} kg
            </Text>
            <Text>
              remaining: {parseFloat(100000 * props.last_known_weight_kg / props.item_definition_obj.weight_grams).toFixed(1)}%
            </Text>
          </View>
          {/*<View style={ITEM_STATUS}>
            <Text>
              status: {props.status}
            </Text>
          </View>*/}
        </View>
      </View>
    </View>
  )
}

