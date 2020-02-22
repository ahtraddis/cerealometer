import * as React from "react"
import update from 'immutability-helper'
import { useState, useEffect } from "react"
import { useStores } from "../../models/root-store"
import { NavigationInjectedProps } from "react-navigation"
import { View, Image, Vibration, ScrollView } from "react-native"
import { Screen, Text, Header, Wallpaper, Button, LoadingButton, LoginRequired, UserDebug } from "../../components"
import Camera from "../../components/camera/camera"
import { FULL, HEADER, HEADER_TITLE, SCREEN_CONTAINER, PLACEHOLDER_IMAGE_URL } from "../../styles/common"
import { styles } from "./scan-screen.styles"
import * as delay from "../../utils/delay"
var _ = require('underscore')
import Sound from 'react-native-sound'
import { Icon } from 'react-native-elements'
import * as Progress from 'react-native-progress'

const VIBRATE_DURATION = 50;

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
    /**
     * Send async UPC lookup request to HTTP function, set result in state
     */
    async function getItemData() {
      await delay.delay(1000)
      let result = await lookupUpc(upc)
      console.tron.log(result)
      setItemDefinition(result)
      setFetching(false)
    }
    // Fetch item def upon instantiation and save in state
    if (!itemDefinition) {
      setFetching(true)
      getItemData()
    }
  }, [upc]);

  async function lookupUpc(upc) {
    return await itemDefinitionStore.getUpcData(upc)
  }

  /**
   * Add quan items of given itemDefinition for current user
   * @param itemDefinition 
   * @param quan
   */
  const addItem = async(itemDefinition, quan) => {
    if (!userStore.user.uid) {
      __DEV__ && console.tron.log("missing user id")
      return
    }
    setAdding(true)
    await delay.delay(500) // temp delay to test loading state
    await itemStore.addItem(userStore.user.uid, itemDefinition.id, quan)
    // [escshwartz-TODO] Handle failure case
    setAdded(true)
    setAdding(false)
  }

  const incrementQuan = () => setQuan(Math.min(5, quan + 1))
  const decrementQuan = () => setQuan(Math.max(0, quan - 1))
  
  return (
    <View style={itemDefinition ? styles.itemFoundContainer : styles.itemContainer}>
      { !itemDefinition ? (
        <View style={styles.outer}>
          <View>
            { fetching ? (
              <View style={styles.progressContainer}>
                <Progress.Circle
                  style={styles.progress}
                  color={styles.progressColor.color}
                  size={14}
                  indeterminate={true}
                />
                <Text
                  style={styles.fetchingText}
                  tx={"scanScreen.lookingUpUpcLabel"}
                  txOptions={{upc: upc}} />
              </View>
            ) :
            (
              <Text
                style={styles.fetchingText}
                tx={"scanScreen.upcNotFound"}
                txOptions={{upc: upc}} />
            )}
          </View>
        </View>
      ) :
      (
        <View style={styles.outer}>
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              source={{uri: (itemDefinition.image_url != "") ?
                itemDefinition.image_url : PLACEHOLDER_IMAGE_URL}} />
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
                    <Text style={styles.quanText} text={quan.toString()} />
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
            { !added ? (
              <View style={styles.itemButtonView}>
                <LoadingButton
                  isLoading={adding}
                  style={(quan > 0) ? styles.itemButton : styles.itemButtonDisabled}
                  textStyle={styles.itemButtonText}
                  tx={"scanScreen.addItemLabel"}
                  onPress={() => addItem(itemDefinition, quan)}
                />
              </View>
            ) : (
              <View>
                <Icon
                  type='foundation'
                  color='green'
                  size={36}
                  name='check' />
              </View>
            )}
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

  /**
   * Play grocery checkout beep sound
   */
  const beep = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      __DEV__ && console.tron.log('failed to load the sound', error);
      return;
    }
  })

  const clearResults = () => {
    setLookupItems({})
  }

  /**
   * Parse detected barcode data and add lookup items to state for async processing
   * @param barcodes Result array from onGoogleVisionBarcodesDetected()
   */
  const readCodes = (barcodes) => {
    if (barcodes) {
      barcodes.map((code: { data: any; }) => {
        let upc = code.data
        // note: data can be a URL for QR codes
        if (!isNaN(upc) && !(upc in lookupItems)) {
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
            <Camera barcodeCallback={readCodes} />
          </View>
          <View style={styles.results}>
            <ScrollView>
              <View style={styles.resultsList}>
                { _.isEmpty(lookupItems) ? (
                  <View style={styles.noResults}>
                    <Text tx={"scanScreen.noResults"} style={styles.noResultsText} />
                  </View>
                ) :
                ( Object.keys(lookupItems).map((upc, i) => {
                  return (
                    <ItemLookupResult
                      key={i}
                      upc={upc}
                    />
                  )
                }))}
              </View>
              <View style={styles.resultsButtons}>
                <View style={styles.buttons}>
                  { !_.isEmpty(lookupItems) && (
                    <View>
                      <Button
                        style={styles.actionButton}
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
