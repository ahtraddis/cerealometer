import { StyleSheet } from "react-native"
import { TEXT, BOLD } from "../../styles/common"
import { color } from "../../theme/color"

export const styles = StyleSheet.create({
  timestamp: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5
  },
  timestampText: {
    color: '#ccc',
    fontSize: 14,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  imageColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  textColumn: {
    flex: 4,
    paddingLeft: 10,
    paddingRight: 5
  },
  buttonColumn: {
    flex: 0,
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
  button: {
    backgroundColor: "#5D2555",
    padding: 5,
    justifyContent: 'center',
  },
  buttonText: {
    ...TEXT,
    fontSize: 12,
  },
  title: {
    ...BOLD,
    fontSize: 16,
    color: color.palette.meterRed,
  },
  message: {
    fontSize: 14,
    color: '#000',
  },
})