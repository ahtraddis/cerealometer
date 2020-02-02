import * as React from "react"
import update from 'immutability-helper'
import { useState, useEffect } from "react"
import { useStores } from "../models/root-store"
import { NavigationInjectedProps } from "react-navigation"
import { StyleSheet, ViewStyle, View, Image, Vibration, ScrollView, Dimensions } from "react-native"
import { Screen, Text, Header, Wallpaper, Button, LoadingButton, LoginRequired, UserDebug } from "../components"
import { color } from "../theme"
import { BLACK, WHITE, FULL, HEADER, HEADER_TITLE, SCREEN_CONTAINER } from "../styles/common"
import * as delay from "../utils/delay"
var _ = require('underscore')
import { RNCamera } from 'react-native-camera';
import Sound from 'react-native-sound'

const VIBRATE_DURATION = 50;
const ITEM_HEIGHT = 60;

const { width } = Dimensions.get("window");

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
const ITEM_BUTTON: ViewStyle = {
  marginTop: 5,
  marginBottom: 5,
  paddingTop: 10,
  paddingBottom: 10,
  backgroundColor: color.palette.darkPurple,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  instructions: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  camera: {
    flex: 3,
  },
  results: {
    flex: 4,
    flexDirection: 'column',
  },
  resultsList: {
    flex: 5,
    paddingTop: 20,
  },
  noResults: {
    flex: 1,
    paddingTop: 20,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 20,
    opacity: .5,
  },
  resultsButtons: {
    flex: 1,
    alignItems: 'center',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
  },
  cameraPreview: {
    flex: 1,
    width: width,
    overflow: 'hidden', // cam view exceeds view height
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  itemContainer: {
    ...ITEM_CONTAINER,
  },
  itemFoundContainer: {
    ...ITEM_CONTAINER,
    backgroundColor: color.palette.white,
  },
  outer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageView: {
    flex: 1,
    width: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
    paddingLeft: 5,
  },
  image: {
    height: ITEM_HEIGHT - 10,
    resizeMode: 'contain',
    marginTop: 5
  },
  infoView: {
    flex: 4,
    height: ITEM_HEIGHT,
    paddingLeft: 10,
    paddingRight: 0,
  },
  infoContentView: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonsView: {
    flex: 1,
    paddingLeft: 10,
  },
  titleView: {
    marginBottom: 5,
    flex: 8,
    overflow: 'hidden',
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quanView: {
    flex: 0,
    display: 'none', // [eschwartz-TODO] Hiding quan +/- for now
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  quanColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quanButtonView: {
    flex: 1,
    justifyContent: 'center',
    padding: 5,
  },
  quanButton: {
    backgroundColor: '#aaa',
    width: 20,
  },
  quanButtonText: {
    fontSize: 20,
  },
  quanText: {
    color: '#000',
    fontSize: 15,
  },
  titleText: {
    ...BLACK,
    fontSize: 14,
  },
  itemButtonView: {
    paddingRight: 5,
    flex: 0,
    flexDirection: 'column',
  },
  itemButton: {
    ...ITEM_BUTTON,
  },
  itemButtonDisabled: {
    ...ITEM_BUTTON,
    backgroundColor: '#bbb'
  },
  itemButtonText: {
    ...WHITE,
    fontSize: 12,
  },
  actionButton: {
    padding: 10,
    backgroundColor: color.palette.darkPurple,
    width: 100,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 14,
  },
  fetchingText: {
    color: '#ccc',
  },
})

export interface ItemLookupResultProps {
  upc: string
}

export interface ScanScreenProps extends NavigationInjectedProps<{}> {}

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
    if (!userStore.user.uid) {
      __DEV__ && console.tron.log("missing user id")
      return
    }
    setAdding(true)
    await delay.delay(500)
    await itemStore.addItem(userStore.user.uid, itemDefinition.id, quan)
    // [escshwartz-TODO] Handle failure case
    setAdded(true)
    setAdding(false)
  }

  const incrementQuan = () => setQuan(Math.min(5, quan + 1))
  const decrementQuan = () => setQuan(Math.max(0, quan - 1))
  
  return (
    <View style={itemDefinition ? styles.itemFoundContainer : styles.itemContainer}>
      { !itemDefinition && (
        <View style={styles.outer}>
          <View>
            { fetching && (
              <Text style={styles.fetchingText}>
                Looking up UPC {upc}...
              </Text>
            )}
            { !fetching && (
              <Text style={styles.fetchingText}>
                Sorry, UPC {upc} not found.
              </Text>
            )}
          </View>
        </View>
      )}
      { itemDefinition && (
        <View style={styles.outer}>
          <View style={styles.imageView}>
            { itemDefinition.image_url &&
              <Image style={styles.image} source={{uri: itemDefinition.image_url}} />
            }
          </View>
          <View style={styles.infoView}>
            <View style={styles.infoContentView}>
              <View style={styles.titleView}>
                <Text style={styles.titleText} text={itemDefinition.name} />
              </View>
              <View style={styles.quanView}>
                <View style={styles.quanColumn}>
                  <View style={styles.quanButtonView}>
                    <Button
                      tx={"scanScreen.incrementButtonLabel"}
                      style={styles.quanButton}
                      textStyle={styles.quanButtonText}
                      onPress={incrementQuan}
                    />
                  </View>
                  <View style={styles.quanButtonView}>
                    <Text style={styles.quanText}>{quan}</Text>
                  </View>
                  <View style={styles.quanButtonView}>
                    <Button
                      tx={"scanScreen.decrementButtonLabel"}
                      style={styles.quanButton}
                      textStyle={styles.quanButtonText}
                      onPress={decrementQuan}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonsView}>
            <View style={styles.itemButtonView}>
              <LoadingButton
                isLoading={adding}
                style={(quan > 0) ? styles.itemButton : styles.itemButtonDisabled}
                textStyle={styles.itemButtonText}
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

export const ScanScreen: React.FunctionComponent<ScanScreenProps> = (props) => {
  const [lookupItems, setLookupItems] = useState({});
  const [count, setCount] = useState(0);
  const { userStore } = useStores();

  let isLoggedIn = userStore.user.isLoggedIn

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

  if (!isLoggedIn) {
    return (
      <LoginRequired />
    )
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={SCREEN_CONTAINER} preset="scroll">
        <View style={styles.container}>
          <View style={styles.instructions}>
            <Header
              headerTx={"scanScreen.header"}
              style={HEADER}
              titleStyle={HEADER_TITLE} />
          </View>
          <View style={styles.camera}>
            <RNCamera
              /*ref={ref => {
                this.camera = ref;
              }}*/
              style={styles.cameraPreview}
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
          <View style={styles.results}>
            <ScrollView>
              <View style={styles.resultsList}>
                { _.isEmpty(lookupItems) && (
                  <View style={styles.noResults}>
                    <Text tx={"scanScreen.noResults"} style={styles.noResultsText} />
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
              <View style={styles.resultsButtons}>
                <View style={styles.buttons}>
                  { !_.isEmpty(lookupItems) && (
                    <View>
                      <Button style={styles.actionButton}
                        textStyle={styles.actionButtonText}
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
        <UserDebug />
      </Screen>
    </View>
  )
}
