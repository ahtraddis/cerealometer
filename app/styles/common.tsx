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
  padding: 15,
}
export const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
export const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}
export const FULL: ViewStyle = {
  flex: 1
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
