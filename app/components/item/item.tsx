import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle, Image } from "react-native"
import { Text } from "../"
import { ItemDefinition } from "../../models/item-definition"

const ITEM: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  backgroundColor: "#333",
  paddingTop: 10,
  paddingBottom: 25,
  paddingLeft: 10,
  paddingRight: 25,
}
const ITEM_IMAGE_VIEW: ViewStyle = {
  flex: 4,
  justifyContent: 'flex-start',
  height: 200,
  borderTopWidth: 5,
  borderBottomWidth: 5,
  borderColor: 'transparent',
  //backgroundColor: 'yellow',
  padding: 5,
}
const ITEM_INFO_VIEW: ViewStyle = {
  flex: 8,
  height: 200,
  //backgroundColor: 'red',
}
const ITEM_IMAGE: ImageStyle = {
  flex: 1,
  resizeMode: 'cover',
}
const ITEM_INFO: ViewStyle = {
  padding: 10,
}
const ITEM_NAME: ViewStyle = {
  marginBottom: 10,
}
const ITEM_NAME_TEXT: TextStyle = {
  fontFamily: "Montserrat-Regular",
  fontSize: 20,
}
const TEXT_LABEL: TextStyle = {
  color: '#aaa',
}
const TEXT_VALUE: TextStyle = {
  color: '#eee',
}

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

  item_id: string, // key
  device_id: string,
  item_definition_id: string,
  last_known_weight_kg: number,
  last_checkin: number,
  slot: number,
  user_id: string,
  item_definition: ItemDefinition,
}

/**
 * Display a single user item
 */
export function Item(props: ItemProps) {
  // grab the props
  const { tx, text, style, item_id, device_id, item_definition_id, last_known_weight_kg, last_checkin, slot, user_id, item_definition, ...rest } = props
  //const textStyle = { }
  const itemdef = item_definition

  return (
    <View style={ITEM}>
      <View style={ITEM_IMAGE_VIEW}>
        <Image style={ITEM_IMAGE} source={{uri: itemdef.image_url}} />
      </View>
      <View style={ITEM_INFO_VIEW}>
        <View style={ITEM_INFO}>
          { itemdef && (
              <View style={ITEM_NAME}>
                <Text style={ITEM_NAME_TEXT}>
                  {itemdef.name}
                </Text>
              </View>
            )
          }
          <View>
            <Text style={TEXT_LABEL}>
              net weight:  <Text style={TEXT_VALUE}>{parseFloat(itemdef.weight_grams / 1000).toFixed(3)} kg</Text>
            </Text>
            <Text style={TEXT_LABEL}>
              last_checkin:  <Text style={TEXT_VALUE}>{last_checkin ? last_checkin : "never" }</Text>
            </Text>
            <Text style={TEXT_LABEL}>
              last_known_weight_kg: <Text style={TEXT_VALUE}>{parseFloat(last_known_weight_kg).toFixed(3)} kg</Text>
            </Text>
            <Text style={TEXT_LABEL}>
              remaining: <Text style={TEXT_VALUE}>{parseFloat(100000 * last_known_weight_kg / itemdef.weight_grams).toFixed(0)}%</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
