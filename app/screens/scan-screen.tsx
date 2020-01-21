import * as React from "react"
import update from 'immutability-helper'
import { useState, useEffect } from "react"
import { useStores } from "../models/root-store"
import { ItemDefinition } from "../models/item-definition"
import { NavigationScreenProps } from "react-navigation"
import { ViewStyle, ImageStyle, View, SafeAreaView, Image, TextStyle, Vibration, StyleSheet } from "react-native"
//import { TouchableOpacity } from "react-native"
import { Screen, Text, Header, Wallpaper, Button } from "../components"
import { spacing } from "../theme"

import { BOLD, HIDDEN, BLACK, WHITE, FULL, HEADER, HEADER_CONTENT, HEADER_TITLE } from "../styles/common"
const DURATION = 50;
import { RNCamera } from 'react-native-camera';
import Sound from 'react-native-sound'

const CONTAINER: ViewStyle = {
  paddingHorizontal: spacing[4],
}
const CAMERA_CONTAINER: ViewStyle = {
  marginTop: 100,
  flex: 1,
  flexDirection: 'column',
}
const CAMERA_PREVIEW: ViewStyle = {
  marginTop: 100,
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: 50,
}
// for ItemLookupResult
const ITEM_CONTAINER: ViewStyle = {
  backgroundColor: '#fff',
  height: 100,
  padding: 10,
  margin: 15,
  alignItems: 'center',
}
const OUTER: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
}
const IMAGE_VIEW: ViewStyle = {
  flex: 1,
  width: 50,
  height: 50,
}
const IMAGE: ImageStyle = {
  height: 75,
}
const INFO_VIEW: ViewStyle = {
  flex: 3,
  height: 50,
  paddingLeft: 15,
  paddingRight: 15,
}
const TITLE_VIEW: ViewStyle = {
  marginBottom: 10,
}
const TITLE_TEXT: TextStyle = {
  ...BOLD,
  ...BLACK,
}
const ITEM_BUTTON_VIEW: ViewStyle = {}
const ITEM_BUTTON: ViewStyle = {
  padding: 5,
  backgroundColor: 'purple',
}
const ITEM_BUTTON_TEXT: TextStyle = {
  ...WHITE,
  fontSize: 12,
}
// const CAMERA_CAPTURE: ViewStyle = {
//   ...WHITE,
//   flex: 0,
//   borderRadius: 5,
//   padding: 15,
//   paddingHorizontal: 20,
//   alignSelf: 'center',
//   margin: 20,
// }
// const CAMERA_BUTTON: ViewStyle = {
//   flex: 0,
//   flexDirection: 'row',
//   justifyContent: 'center',
// }
// const CAMERA_BUTTON_TEXT: ViewStyle = {
//   ...BLACK,
//   fontSize: 14,
// }
const FOUND: ViewStyle = {
  height: 175,
}

export interface ItemLookupResultProps {
  itemDefinition: ItemDefinition
}

export function ItemLookupResult(props: ItemLookupResultProps) {
  // grab the props
  const { itemDefinition } = props
  const { itemStore, userStore } = useStores()
  let user = userStore.user

  async function addItem(user_id: string, item_definition_id: string) {
    console.log(`scan-screen: addItem(): adding item_definition_id ${item_definition_id}`)
    const response = await itemStore.addItem(user_id, item_definition_id)
    console.log("scan-screen: addItem(): response:", JSON.stringify(response, null, 2))
  }

  return (
    <View style={ITEM_CONTAINER}>
      <View style={OUTER}>
        <View style={IMAGE_VIEW}>
          <Image style={IMAGE} source={{uri: itemDefinition.image_url}} />
        </View>
        <View style={INFO_VIEW}>
          <View style={TITLE_VIEW}>
            <Text style={TITLE_TEXT}>{itemDefinition.name}</Text>
          </View>
          <View style={ITEM_BUTTON_VIEW}>
            <Button
              style={ITEM_BUTTON}
              textStyle={ITEM_BUTTON_TEXT}
              tx="scanScreen.addItemButton"
              onPress={
                async() => {
                  //console.log("itemDefinition: ", itemDefinition)
                  const result = await addItem(user.id, itemDefinition.id)
                  //console.log("scan-screen: addItem result:", JSON.stringify(result, null, 2))
                }
              }
            />
          </View>
        </View>
      </View>
    </View>
  )
}

// [eschwartz-TODO] May need to change back to NavigationInjectedProps. Study this.
export interface ScanScreenProps extends NavigationScreenProps<{}> {}

export const ScanScreen: React.FunctionComponent<ScanScreenProps> = (props) => {
  const { itemDefinitionStore } = useStores()
  const [lookupItems, setLookupItems] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    setLookupItems({});
    setCount(0);
  }, []);

  const beep = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // loaded successfully
    //console.log('duration in seconds: ' + beep.getDuration() + 'number of channels: ' + beep.getNumberOfChannels());
  });

  // const takePicture = async() => {
  //   if (this.camera) {
  //     const options = { quality: 0.5, base64: true };
  //     const data = await this.camera.takePictureAsync(options);
  //   }
  // }

  async function lookupUpc(upc) {
    //console.log(`scan-screen: lookupUpc(): looking up upc ${upc}`)
    let response = await itemDefinitionStore.getUpcData(upc)
    //console.log("scan-screen: lookupUpc(): response:", JSON.stringify(response, null, 2))
    return response
  }

  const readCodes = (barcodes) => {
    // add lookup items to state for async processing
    barcodes.map((code: { data: any; }) => {
      let key = code.data
      if (!(key in lookupItems)) {
        console.log(`scan-screen: adding ${key} to lookupItems`)
        Vibration.vibrate(DURATION)
        beep.play()
        let newLookupItems = update(lookupItems, {$merge: {}});
        newLookupItems[key] = {
          data: code,
          processed: false,
          processing: false,
          result: {}
        }
        setLookupItems(newLookupItems)
      }
    })

    if (Object.keys(lookupItems).length) {
      Object.keys(lookupItems).map(key => {
        let item = lookupItems[key]
        if ((item.processed == false) && (item.processing == false)) {
          console.log(`scan-screen: calling lookupUpc() for item ${item.data.data}`);
          (async () => {
            // set processing to true before sending async request
            let newLookupItems = update(lookupItems, {$merge: {}});
            newLookupItems[key].processing = true
            setLookupItems(newLookupItems)
            // send async lookup request to cloud function
            let result = await lookupUpc(item.data.data);
            console.log("scan-screen: got lookupUpc result:", JSON.stringify(result, null, 2))
            // update result in state and set processed true
            newLookupItems = update(lookupItems, {$merge: {}});
            newLookupItems[key].processed = true
            newLookupItems[key].processing = false
            newLookupItems[key].result = result
            setLookupItems(newLookupItems)
            // [eschwartz-TODO] fix this hack to update state
            setCount(count + 1)
          })()
        }
      })
    }
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll">
        <SafeAreaView style={HEADER}>
          <View style={HEADER_CONTENT}>
            <Header headerTx="scanScreen.header" style={HEADER} titleStyle={HEADER_TITLE} />
          </View>
        </SafeAreaView>
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
          {/*
          <View style={CAMERA_BUTTON}>
            <TouchableOpacity style={CAMERA_CAPTURE} onPress={takePicture}>
            <Text style={CAMERA_BUTTON} tx="scanScreen.takePicture" />
            </TouchableOpacity>
          </View>
          */}
        </View>
      </Screen>
      <SafeAreaView>
        <Text style={HIDDEN}>[HACK] count: {count}</Text>
        <View style={FOUND}>
          { Object.keys(lookupItems).map((key, i) => {
              let result = lookupItems[key].result
              return (
                <ItemLookupResult
                  key={i}
                  itemDefinition={result}
                />
              )
            })
          }
        </View>
      </SafeAreaView>
    </View>
  )
}
