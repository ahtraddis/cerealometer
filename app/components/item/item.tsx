import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle, Image } from "react-native"
import { Text } from "../"
import { Button } from "../../components"
import { ItemDefinition } from "../../models/item-definition"
import { Port } from "../../models/port"
import { BUTTON, BUTTON_TEXT, BOLD, HIDDEN, BLACK, WHITE, FULL, HEADER, HEADER_CONTENT, HEADER_TITLE, MESSAGE } from "../../styles/common"

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
const SLOT_HEADER: ViewStyle = {
  backgroundColor: 'green', padding: 5, alignItems: 'center'
}
const SLOT_HEADER_TEXT: TextStyle = {

}

export interface ItemProps {
  id: string
  device_id: string
  item_definition_id: string
  last_known_weight_kg: number
  last_checkin: number
  slot: number
  user_id: string
  item_definition: ItemDefinition
  showSlotHeader: boolean
  buttonCallback: (event) => void
  buttonLabel: string
  port: Port
}

/**
 * Display a single user item
 */
export function Item(props: ItemProps) {
  const { id, device_id, item_definition_id, last_known_weight_kg, last_checkin, slot, user_id, item_definition, showSlotHeader, buttonCallback, buttonLabel, port, ...rest } = props
  const itemdef = item_definition

  return (
    <View>
      { showSlotHeader && (device_id != "") && (slot != -1) && (
        <View style={SLOT_HEADER}>
          <Text style={SLOT_HEADER_TEXT}>
            Device &lt;{device_id}&gt; Slot &lt;{slot}&gt;
          </Text>
        </View>
      )}
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
                id:  <Text style={TEXT_VALUE}>{id}</Text>
              </Text>
              { port &&
                <View>
                  <Text style={TEXT_LABEL}>
                    status: <Text style={TEXT_VALUE}>{port.status}</Text>
                  </Text>
                  <Text style={TEXT_LABEL}>
                    weight_kg: <Text style={TEXT_VALUE}>{port.weight_kg}</Text>
                  </Text>
                  {/*<Text style={TEXT_LABEL}>
                    item_id: '<Text style={TEXT_VALUE}>{port.item_id}</Text>'
                  </Text>*/}
                </View>
              }
              <Text style={TEXT_LABEL}>
                net weight:
                &nbsp;<Text style={TEXT_VALUE}>
                  {parseFloat(itemdef.weight_grams / 1000).toFixed(3)} kg
                </Text>
              </Text>
              <Text style={TEXT_LABEL}>
                last_checkin:
                &nbsp;<Text style={TEXT_VALUE}>
                  {last_checkin ? last_checkin : "never" }
                </Text>
              </Text>
              <Text style={TEXT_LABEL}>
                last_known_weight_kg:
                &nbsp;<Text style={TEXT_VALUE}>
                  {parseFloat(last_known_weight_kg).toFixed(3)} kg
                </Text>
              </Text>
              <Text style={TEXT_LABEL}>
                remaining:
                &nbsp;<Text style={TEXT_VALUE}>
                  {parseFloat(100000 * last_known_weight_kg / itemdef.weight_grams).toFixed(0)}%
                </Text>
              </Text>
              { buttonCallback && buttonLabel &&
                <Button style={BUTTON} textStyle={BUTTON_TEXT} tx={buttonLabel} onPress={buttonCallback}/>
              }
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
