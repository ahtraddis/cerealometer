import { StyleSheet, TextStyle, ViewStyle } from "react-native"
import { BOLD } from "../../styles/common"

export const ITEM_COMMON: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  padding: 10,
  paddingLeft: 0,
  margin: 15,
  marginTop: 0,
  marginBottom: 25,
}
export const NUTRITION_TEXT: TextStyle = {
  fontFamily: 'sans-serif-condensed',
}
export const BUTTON: ViewStyle = {
  padding: 3,
  marginTop: 10,
  marginBottom: 5,
  backgroundColor: '#72551e',
  width: 75,
}
export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  nutritionText: {
    ...NUTRITION_TEXT,
  },
  container: {
    ...ITEM_COMMON,
    flex: 0,
    backgroundColor: '#fff',
  },
  imageButtonsView: {
    flex: 3,
  },
  imageView: {
    flex: 1,
    paddingRight: 5,
    paddingLeft: 5,
  },
  buttonView: {
    flex: 2,
  },
  itemInfoView: {
    flex: 7,
    overflow: 'hidden',
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 10,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  itemInfo: {},
  itemName: {
    marginBottom: 5,
    borderBottomColor: '#000',
  },
  itemNameText: {
    ...NUTRITION_TEXT,
    ...BOLD,
    fontSize: 22,
    color: '#000',
  },
  textLabel: {
    ...NUTRITION_TEXT,
    color: '#000',
    ...BOLD,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    paddingBottom: 2,
    paddingTop: 2,
  },
  textValue: {
    color: '#000',
    ...NUTRITION_TEXT,
    fontWeight: 'normal',
  },
  divider: {
    borderBottomWidth: 10,
    borderBottomColor: '#000',
  },
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  button: {
    ...BUTTON,
  },
  buttonDisabled: {
    ...BUTTON,
    backgroundColor: '#ddcbb3',
  },
  buttonText: {
    fontSize: 12,
  },
})