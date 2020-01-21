import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle, Image } from "react-native"
import { Text } from "../"
import { Button } from "../../components"
import { ItemDefinition } from "../../models/item-definition"
import { Port } from "../../models/port"
import { Device } from "../../models/device"
import { BUTTON, BUTTON_TEXT } from "../../styles/common"
var moment = require('moment');
import { getBoundedPercentage } from "../../utils/math"

const WRAPPER: ViewStyle = {
  flex: 1,
}
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
  //padding: 10,
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
  item_definition_id: string
  last_known_weight_kg: number
  last_checkin: number
  user_id: string
  itemDefinition: ItemDefinition
  showSlotHeader: boolean
  buttonCallback: (event) => void
  buttonLabel: string
  buttonEnabled: boolean
  port: Port
  device: Device
}

/**
 * Display a single user item
 */
export function Item(props: ItemProps) {
  const { id, item_definition_id, last_known_weight_kg, last_checkin, user_id, itemDefinition, showSlotHeader, buttonCallback, buttonLabel, buttonEnabled, port, device, ...rest } = props
  const itemdef = itemDefinition
  //console.log("itemdef: ", itemdef)

  return (
    <View style={WRAPPER}>
      { showSlotHeader && port && device && (
        <View style={SLOT_HEADER}>
          <Text style={SLOT_HEADER_TEXT}>
            {device.name} &mdash; Slot {port.slot}
          </Text>
        </View>
      )}
      <View style={ITEM}>
        { itemdef &&
          <View style={ITEM_IMAGE_VIEW}>
            <Image style={ITEM_IMAGE} source={{uri: itemdef.image_url}} />
          </View>
        }
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
              { itemdef &&
                <Text style={TEXT_LABEL}>
                  net weight:
                  &nbsp;<Text style={TEXT_VALUE}>
                    {parseFloat(itemdef.net_weight_kg).toFixed(3)} kg
                  </Text>
                </Text>
              }
              { itemdef &&
                <Text style={TEXT_LABEL}>
                  tare weight:
                  &nbsp;<Text style={TEXT_VALUE}>
                    {parseFloat(itemdef.tare_weight_kg).toFixed(3)} kg
                  </Text>
                </Text>
              }
              <Text style={TEXT_LABEL}>
                last checkin:
                &nbsp;<Text style={TEXT_VALUE}>
                  {last_checkin ? moment.unix(last_checkin).fromNow() : "never" }
                </Text>
              </Text>
              <Text style={TEXT_LABEL}>
                last known weight:
                &nbsp;<Text style={TEXT_VALUE}>
                  {parseFloat(last_known_weight_kg).toFixed(3)} kg
                </Text>
              </Text>
              { itemdef && (last_known_weight_kg > 0) && (
                  <Text style={TEXT_LABEL}>
                    remaining:
                    &nbsp;<Text style={TEXT_VALUE}>
                      {parseFloat(getBoundedPercentage(itemdef.tare_weight_kg ? (last_known_weight_kg - itemdef.tare_weight_kg) : last_known_weight_kg, itemdef.net_weight_kg)).toFixed(0)}%
                    </Text>
                  </Text>
                )
              }
              { port &&
                <View>
                  <Text style={TEXT_LABEL}>
                    slot status: <Text style={TEXT_VALUE}>{port.status}</Text>
                  </Text>
                  <Text style={TEXT_LABEL}>
                    slot weight: <Text style={TEXT_VALUE}>{port.weight_kg} kg</Text>
                  </Text>
                  {/*<Text style={TEXT_LABEL}>
                    item_id: '<Text style={TEXT_VALUE}>{port.item_id}</Text>'
                  </Text>*/}
                </View>
              }
              { buttonCallback && buttonLabel &&
                <Button disabled={!buttonEnabled} style={BUTTON} textStyle={BUTTON_TEXT} tx={buttonLabel}
                  onPress={() => buttonCallback(id)}
                />
              }
            </View>
          </View>
        </View>


      </View>
    </View>
  )

}
