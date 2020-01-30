import * as React from "react"
import update from 'immutability-helper'
import { useState, useEffect } from "react"
import { useStores } from "../models/root-store"
import { NavigationScreenProps } from "react-navigation"
import { ViewStyle, ImageStyle, View, Image, TextStyle, Vibration, ScrollView, Dimensions } from "react-native"
import { Screen, Text, Header, Wallpaper, Button, LoadingButton } from "../components"
import { color } from "../theme"
import { BLACK, WHITE, FULL, HEADER, HEADER_TITLE } from "../styles/common"
import * as delay from "../utils/delay"
var _ = require('underscore')
import { RNCamera } from 'react-native-camera';
import Sound from 'react-native-sound'

const VIBRATE_DURATION = 50;
const ITEM_HEIGHT = 60;

const { width } = Dimensions.get("window");

const SCREEN_CONTAINER: ViewStyle = {
  flex: 1,
}
const MAIN_CONTAINER: ViewStyle = {
  flex: 1,
}
const INSTRUCTION_CONTAINER: ViewStyle = {
  flex: 1,
  padding: 10,
  justifyContent: 'center',
}
const CAMERA_CONTAINER: ViewStyle = {
  flex: 3,
}
const RESULTS_CONTAINER: ViewStyle = {
  flex: 4,
  flexDirection: 'column',
}
const RESULTS_LIST: ViewStyle = {
  flex: 5,
  paddingTop: 20,
}
const NO_RESULTS_TEXT: TextStyle = {
  textAlign: 'center',
  fontSize: 20,
  opacity: .5,
}
const NO_RESULTS: ViewStyle = {
  flex: 1,
  paddingTop: 20,
}
const RESULTS_BUTTONS: ViewStyle = {
  flex: 1,
  alignItems: 'center',
}
const BUTTONS: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
}
const CAMERA_PREVIEW: ViewStyle = {
  flex: 1,
  width: width,
  overflow: 'hidden', // cam view exceeds view height
  justifyContent: 'space-around',
  alignItems: 'center',
}
const ITEM_CONTAINER: ViewStyle = {
  backgroundColor: color.palette.lightPlum,
  height: ITEM_HEIGHT,
  padding: 0,
  marginBottom: 20,
  marginLeft: 15,
  marginRight: 15,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 3,
}
const ITEM_FOUND_CONTAINER: ViewStyle = {
  ...ITEM_CONTAINER,
  backgroundColor: color.palette.white,
}
const OUTER: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
}
const IMAGE_VIEW: ViewStyle = {
  flex: 1,
  width: ITEM_HEIGHT,
  height: ITEM_HEIGHT,
  paddingLeft: 5,
}
const IMAGE: ImageStyle = {
  height: ITEM_HEIGHT - 10,
  resizeMode: 'contain',
  marginTop: 5
}
const INFO_VIEW: ViewStyle = {
  flex: 4,
  height: ITEM_HEIGHT,
  paddingLeft: 10,
  paddingRight: 0,
}
const INFO_CONTENT_VIEW: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
}
const BUTTONS_VIEW: ViewStyle = {
  flex: 1,
  paddingLeft: 10,
}
const TITLE_VIEW: ViewStyle = {
  marginBottom: 5,
  flex: 8,
  overflow: 'hidden',
  marginTop: 5,
  alignItems: 'center',
  justifyContent: 'center',
}
const QUAN_VIEW: ViewStyle = {
  flex: 0,
  display: 'none', // [eschwartz-TODO] Hiding quan +/- for now
  justifyContent: 'center',
  alignContent: 'flex-start',
}
const QUAN_COLUMN: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}
const QUAN_BUTTON_VIEW: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  padding: 5,
}
const QUAN_BUTTON: ViewStyle = {
  backgroundColor: '#aaa',
  width: 20,
}
const QUAN_BUTTON_TEXT: TextStyle = {
  fontSize: 20,
}
const QUAN_TEXT: TextStyle = {
  color: '#000',
  fontSize: 15,
}
const TITLE_TEXT: TextStyle = {
  ...BLACK,
  fontSize: 14,
}
const ITEM_BUTTON_VIEW: ViewStyle = {
  paddingRight: 5,
  flex: 0,
  flexDirection: 'column',
}
const ITEM_BUTTON: ViewStyle = {
  marginTop: 5,
  marginBottom: 5,
  paddingTop: 10,
  paddingBottom: 10,
  backgroundColor: color.palette.darkPurple,
}
const ITEM_BUTTON_DISABLED: ViewStyle = {
  ...ITEM_BUTTON,
  backgroundColor: '#bbb'
}
const ITEM_BUTTON_TEXT: TextStyle = {
  ...WHITE,
  fontSize: 12,
}
const ACTION_BUTTON: ViewStyle = {
  padding: 10,
  backgroundColor: color.palette.darkPurple,
  width: 100,
  marginLeft: 5,
  marginRight: 5,
  marginBottom: 10,
}
const ACTION_BUTTON_TEXT: TextStyle = {
  fontSize: 14,
}
const FETCHING_TEXT: TextStyle = {
  color: '#ccc',
}

export interface ItemLookupResultProps {
  upc: string
}

export function ItemLookupResult(props: ItemLookupResultProps) {
  const { upc } = props
  const { itemDefinitionStore, itemStore, userStore } = useStores()
  const [fetching, setFetching] = useState(false);
  const [itemDefinition, setItemDefinition] = useState(null)
  const [quan, setQuan] = useState(1)
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    // send async lookup request to cloud function
    async function getData() {
      await delay.delay(500)
      let result = await lookupUpc(upc)
      setItemDefinition(result)
      setFetching(false)
    }
    if (!itemDefinition) {
      setFetching(true)
      getData()
    }
  }, [upc]);

  async function lookupUpc(upc) {
    return await itemDefinitionStore.getUpcData(upc)
  }

  const addItem = async(itemDefinition, quan) => {
    if (!userStore.user.id) {
      __DEV__ && console.tron.log("missing user id")
      return
    }
    setAdding(true)
    await delay.delay(500)
    await itemStore.addItem(userStore.user.id, itemDefinition.id, quan)
    // [escshwartz-TODO] Handle failure case
    setAdded(true)
    setAdding(false)
  }

  const incrementQuan = () => setQuan(Math.min(5, quan + 1))
  const decrementQuan = () => setQuan(Math.max(0, quan - 1))
  
  return (
    <View style={itemDefinition ? ITEM_FOUND_CONTAINER : ITEM_CONTAINER}>
      { !itemDefinition && (
        <View style={OUTER}>
          <View>
            { fetching && (
              <Text style={FETCHING_TEXT}>
                Looking up UPC {upc}...
              </Text>
            )}
            { !fetching && (
              <Text style={FETCHING_TEXT}>
                Sorry, UPC {upc} not found.
              </Text>
            )}
          </View>
        </View>
      )}
      { itemDefinition && (
        <View style={OUTER}>
          <View style={IMAGE_VIEW}>
            { itemDefinition.image_url &&
              <Image style={IMAGE} source={{uri: itemDefinition.image_url}} />
            }
          </View>
          <View style={INFO_VIEW}>
            <View style={INFO_CONTENT_VIEW}>
              <View style={TITLE_VIEW}>
                <Text style={TITLE_TEXT} text={itemDefinition.name} />
              </View>
              <View style={QUAN_VIEW}>
                <View style={QUAN_COLUMN}>
                  <View style={QUAN_BUTTON_VIEW}>
                    <Button
                      tx={"scanScreen.incrementButtonLabel"}
                      style={QUAN_BUTTON}
                      textStyle={QUAN_BUTTON_TEXT}
                      onPress={incrementQuan}
                    />
                  </View>
                  <View style={QUAN_BUTTON_VIEW}>
                    <Text style={QUAN_TEXT}>{quan}</Text>
                  </View>
                  <View style={QUAN_BUTTON_VIEW}>
                    <Button
                      tx={"scanScreen.decrementButtonLabel"}
                      style={QUAN_BUTTON}
                      textStyle={QUAN_BUTTON_TEXT}
                      onPress={decrementQuan}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={BUTTONS_VIEW}>
            <View style={ITEM_BUTTON_VIEW}>
              <LoadingButton
                isLoading={adding}
                style={(quan > 0) ? ITEM_BUTTON : ITEM_BUTTON_DISABLED}
                textStyle={ITEM_BUTTON_TEXT}
                tx={"scanScreen.addItemLabel"}
                onPress={() => addItem(itemDefinition, quan)}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

// [eschwartz-TODO] May need to change back to NavigationInjectedProps. Study this.
export interface ScanScreenProps extends NavigationScreenProps<{}> {}

export const ScanScreen: React.FunctionComponent<ScanScreenProps> = (props) => {
  const [lookupItems, setLookupItems] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {}, []);

  const beep = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      __DEV__ && console.tron.log('failed to load the sound', error);
      return;
    }
  })

  const clearResults = () => {
    setLookupItems({})
  }

  const readCodes = (barcodes) => {
    //__DEV__ && console.tron.log("readCodes()", barcodes)
    // add lookup items to state for async processing
    barcodes.map((code: { data: any; }) => {
      let upc = code.data
      if (!(upc in lookupItems)) {
        __DEV__ && console.tron.log(`adding ${upc} to lookupItems`)
        Vibration.vibrate(VIBRATE_DURATION)
        beep.play()
        let newLookupItems = update(lookupItems, {$merge: {}});
        newLookupItems[upc] = {
          data: code,
        }
        setCount(count + 1)
        setLookupItems(newLookupItems)
      }
    })
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={SCREEN_CONTAINER} preset="scroll">
        <View style={MAIN_CONTAINER}>
          <View style={INSTRUCTION_CONTAINER}>
            <Header
              headerTx={"scanScreen.header"}
              style={HEADER}
              titleStyle={HEADER_TITLE} />
          </View>
          <View style={CAMERA_CONTAINER}>
            <RNCamera
              /*ref={ref => {
                this.camera = ref;
              }}*/
              style={CAMERA_PREVIEW}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.off}
              captureAudio={false}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              onGoogleVisionBarcodesDetected={({ barcodes }) => {
                readCodes(barcodes)
              }}
            />
          </View>
          <View style={RESULTS_CONTAINER}>
            <ScrollView>
              <View style={RESULTS_LIST}>
                { _.isEmpty(lookupItems) && (
                  <View style={NO_RESULTS}>
                    <Text tx={"scanScreen.noResults"} style={NO_RESULTS_TEXT} />
                  </View>
                )}
                { !_.isEmpty(lookupItems) && Object.keys(lookupItems).map((upc, i) => {
                  return (
                    <ItemLookupResult
                      key={i}
                      upc={upc}
                    />
                  )
                })}
              </View>
              <View style={RESULTS_BUTTONS}>
                <View style={BUTTONS}>
                  { !_.isEmpty(lookupItems) && (
                    <View>
                      <Button style={ACTION_BUTTON}
                        textStyle={ACTION_BUTTON_TEXT}
                        tx={"scanScreen.clearResultsLabel"}
                        onPress={clearResults}
                      />
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Screen>
    </View>
  )
}
