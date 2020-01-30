import { ViewStyle, TextStyle } from "react-native"
import { color } from "../theme"

export const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
export const BOLD: TextStyle = { fontWeight: 'bold' }
export const BLACK: TextStyle = { color: color.palette.black }
export const WHITE: TextStyle = { color: color.palette.white }
export const HIDDEN: TextStyle = { display: 'none' }

export const BUTTON: ViewStyle = {
  backgroundColor: "#5D2555",
  padding: 5,
  marginTop: 10,
  marginBottom: 10,
}
export const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  letterSpacing: 2,
}
export const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}
export const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.darkPlum,
}
export const HEADER: TextStyle = {
  paddingTop: 20,
  paddingBottom: 20,
}
export const HEADER_CONTENT: ViewStyle = {
  paddingBottom: 0,
  paddingTop: 0,
}
export const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 24,
  lineHeight: 30,
  textAlign: "center",
  letterSpacing: 1.5,
}
export const FOOTER: ViewStyle = {
  backgroundColor: "#20162D"
}
export const FOOTER_CONTENT: ViewStyle = {
  padding: 10,
}
export const MESSAGE: ViewStyle = {
  padding: 20,
  backgroundColor: '#ccc',
}
export const MESSAGE_TEXT: TextStyle = {
  color: '#fff'
}
export const SCREEN_HEADER: ViewStyle = {
  backgroundColor: color.palette.darkPurple,
  marginBottom: 15,
}
export const SCREEN_HEADER_TEXT: TextStyle = {
  color: '#fff',
  fontFamily: 'sans-serif-monospace',
  fontSize: 16,
  textAlign: 'center',
  padding: 5,
  letterSpacing: 1
}
export const EMPTY_MESSAGE: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  backgroundColor: color.palette.darkPurple,
  padding: 25,
  marginLeft: 15,
  marginRight: 15,
  marginTop: 10
}
export const EMPTY_LOADER_VIEW: ViewStyle = {
  justifyContent: 'center',
  paddingRight: 10,
}
export const EMPTY_MESSAGE_TEXT: TextStyle = {
  color: '#fff',
  fontSize: 16,
}
