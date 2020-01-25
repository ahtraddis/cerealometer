import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle, Image } from "react-native"
import { Text } from "../"
import { Button } from "../../components"
import { ItemDefinition } from "../../models/item-definition"
import { Port } from "../../models/port"
import { Device } from "../../models/device"
import { BOLD } from "../../styles/common"
var moment = require('moment');
import { getBoundedPercentage } from "../../utils/math"
import { color } from "../../theme"

const NUTRITION_TEXT: TextStyle = {
  fontFamily: 'sans-serif-condensed',
}
const WRAPPER: ViewStyle = {
  flex: 1,
  padding: 0,
}
const ITEM: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  backgroundColor: '#fff',
  paddingTop: 10,
  //paddingBottom: 35,
  paddingLeft: 10,
  paddingRight: 10,
  borderRadius: 3,
  margin: 10,
}
const ITEM_IMAGE_VIEW: ViewStyle = {
  flex: 4,
  justifyContent: 'flex-start',
  height: 200,
  borderTopWidth: 5,
  borderBottomWidth: 5,
  borderColor: 'transparent',
  //backgroundColor: 'yellow',
  paddingRight: 10
}
const ITEM_INFO_VIEW: ViewStyle = {
  flex: 8,
  //height: 200,
  //backgroundColor: 'red',
  borderWidth: 1,
  borderTopColor: '#000',
  borderBottomColor: '#000',
  borderBottomWidth: 0,
  paddingLeft: 5,
  paddingRight: 5,
  marginBottom: 35
}
const ITEM_IMAGE: ImageStyle = {
  flex: 1,
  resizeMode: 'contain',
  marginBottom: 5
}
const ITEM_INFO: ViewStyle = {
  //padding: 10,
}
const ITEM_NAME: ViewStyle = {
  marginBottom: 5,
  borderBottomWidth: 1,
  borderBottomColor: '#000',
}
const ITEM_NAME_TEXT: TextStyle = {
  ...NUTRITION_TEXT,
  ...BOLD,
  fontSize: 20,
  color: '#000',

}
const PORT_INFO_LABEL: TextStyle = {
  ...NUTRITION_TEXT,
  ...BOLD,
  color: '#000',
  borderBottomWidth: 1,
  borderBottomColor: '#000',
  marginRight: 15
}
const PORT_INFO_VALUE: TextStyle = {
  ...NUTRITION_TEXT,
  color: '#000',
}
const TEXT_LABEL: TextStyle = {
  ...NUTRITION_TEXT,
  color: '#000',
  ...BOLD,
  borderBottomColor: '#000',
  borderBottomWidth: 1,
  paddingBottom: 2,
  paddingTop: 2,
}
const TEXT_VALUE: TextStyle = {
  color: '#000',
  ...NUTRITION_TEXT,
  fontWeight: 'normal',
}
const DIVIDER: ViewStyle = {
  borderBottomWidth: 10,
  borderBottomColor: '#000,'
}
const ACTION_BUTTON: ViewStyle = {
  padding: 3,
  marginTop: 10,
  marginBottom: 10,
  backgroundColor: '#72551e',
}
const ACTION_BUTTON_DISABLED: ViewStyle = {
  ...ACTION_BUTTON,
  backgroundColor: '#ddcbb3',
}
const ACTION_BUTTON_TEXT: TextStyle = {
  fontSize: 12,
}

export interface ItemProps {
  id: string
  item_definition_id: string
  last_known_weight_kg: number
  last_update_time: number
  user_id: string
  itemDefinition: ItemDefinition
  showSlotHeader: boolean
  buttonCallback: (event) => void
  deleteCallback: (event) => void
  buttonLabel: string
  buttonEnabled: boolean
  deleteButtonLabel: string
  port: Port
  device: Device
}

/**
 * Display a single user item
 */
export function Item(props: ItemProps) {
  const { id, item_definition_id, last_known_weight_kg, last_update_time, user_id, itemDefinition, showSlotHeader, buttonCallback, buttonLabel, buttonEnabled, deleteCallback, deleteButtonLabel, port, device, ...rest } = props
  const itemdef = itemDefinition
  //console.log("itemdef: ", itemdef)

  return (
    <View style={WRAPPER}>
      { showSlotHeader && port && device && (
        <View style={{flex: 0, padding: 0, flexDirection: 'row'}}>
          <View style={{flex: 1, height: 18}}>
            <Text style={{fontWeight: 'normal', fontSize: 16, textAlign: 'center'}}>
              SLOT {port.slot + 1}
            </Text>
          </View>
        </View>
      )}
      <View style={ITEM}>
        { itemdef &&
          <View style={ITEM_IMAGE_VIEW}>
            <View style={{flex: 2}}>
              <Image style={ITEM_IMAGE} source={{uri: itemdef.image_url}} />
              { false && port && (
                <View>
                  <Text style={PORT_INFO_LABEL}>Slot Status</Text>
                  <Text style={PORT_INFO_VALUE}>{port.status}</Text>
                </View>
              )}
            </View>
            <View style={{flex: 1}}>
              <View style={{}}>
                { false && port && (
                  <View>
                    <Text style={PORT_INFO_LABEL}>Slot Weight</Text>
                    <Text style={PORT_INFO_VALUE}>{port.weight_kg.toFixed(4)} kg</Text>
                  </View>
                )}
                { buttonCallback && buttonLabel &&
                  <Button disabled={!buttonEnabled} style={buttonEnabled ? ACTION_BUTTON : ACTION_BUTTON_DISABLED} textStyle={ACTION_BUTTON_TEXT} tx={buttonLabel}
                    onPress={() => buttonCallback(id)}
                  />
                }
                { deleteCallback && deleteButtonLabel &&
                  <Button style={ACTION_BUTTON} textStyle={ACTION_BUTTON_TEXT} tx={deleteButtonLabel}
                    onPress={() => deleteCallback(id)}
                  />
                }
              </View>
            </View>


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
            <View style={{}}>
              
              
              <Text style={TEXT_LABEL}>
                Last Seen
                &nbsp;<Text style={TEXT_VALUE}>
                  {last_update_time ? moment.unix(last_update_time).fromNow() : "never" }
                </Text>
              </Text>
              <Text style={TEXT_LABEL}>
                Last Weight
                &nbsp;<Text style={TEXT_VALUE}>
                  {parseFloat(last_known_weight_kg).toFixed(4)} kg
                </Text>
              </Text>
              { itemdef && (last_known_weight_kg > 0) && (
                  <Text style={TEXT_LABEL}>
                    Amount Remaining
                    &nbsp;<Text style={TEXT_VALUE}>
                      {parseFloat(getBoundedPercentage(itemdef.tare_weight_kg ? (last_known_weight_kg - itemdef.tare_weight_kg) : last_known_weight_kg, itemdef.net_weight_kg)).toFixed(0)}%
                    </Text>
                  </Text>
                )
              }
              <View style={DIVIDER} />
              { itemdef &&
                  <Text style={TEXT_LABEL}>
                    Net Weight
                    &nbsp;<Text style={TEXT_VALUE}>
                      {parseFloat(itemdef.net_weight_kg).toFixed(3)} kg
                    </Text>
                  </Text>
              }
              
              { itemdef &&
                <Text style={TEXT_LABEL}>
                  Tare Weight
                  &nbsp;<Text style={TEXT_VALUE}>
                    {parseFloat(itemdef.tare_weight_kg).toFixed(3)} kg
                  </Text>
                </Text>
              }
              <View style={DIVIDER} />
              
              
            </View>
          </View>
        </View>


      </View>
    </View>
  )

}
