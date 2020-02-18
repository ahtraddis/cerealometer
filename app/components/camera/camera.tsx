import * as React from "react"
import { useRef } from "react"
import { View } from "react-native"
import { Text } from "../"
import { styles } from "./camera.styles"
import { RNCamera } from 'react-native-camera';
import { withNavigationFocus } from 'react-navigation'

export interface CameraProps {
  isFocused?: boolean,
  barcodeCallback(data: any): void,
}

const notAuthorizedView = (
  <View style={styles.notAuthorized}>
    <Text style={styles.notAuthorizedText} tx={"camera.notAuthorized"} />
  </View>
)

/**
 * Camera component description
 */
export function Camera(props: CameraProps) {
  const { isFocused, barcodeCallback } = props
  const cameraRef = useRef(null);

  // Check focus state to resolve black screen issue upon navigation tab change
  // Ref: https://react-native-community.github.io/react-native-camera/docs/react-navigation
  if (!isFocused) {
    return <View />
  } else {
    return (
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Ready to scan?',
          message: 'Cerealometer needs your permission to use the camera to scan barcodes.',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={({ barcodes }) => {
          if (barcodeCallback) {
            barcodeCallback(barcodes)
          }
        }}
        notAuthorizedView={notAuthorizedView}
      />
    )
  }
}

export default withNavigationFocus(Camera)