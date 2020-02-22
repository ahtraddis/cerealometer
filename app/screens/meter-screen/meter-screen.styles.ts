import { StyleSheet } from "react-native"
import { color } from "../../theme/color"

export const styles = StyleSheet.create({
  
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    backgroundColor: color.palette.darkPurple,
  },
  loginText: {
    color: 'white',
  },
  
});