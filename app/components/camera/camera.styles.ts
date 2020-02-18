import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  camera: {
    flex: 3,
  },
  preview: {
    flex: 1,
    width: width,
    overflow: 'hidden', // cam view exceeds view height
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  notAuthorized: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  notAuthorizedText: {
    color: '#777'
  }
})