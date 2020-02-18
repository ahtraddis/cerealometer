import { ViewStyle, StyleSheet } from "react-native"
import { color } from "../../theme/color"

export const LABEL_COLOR = '#444'

export const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 185,
    flexDirection: 'row',
    marginBottom: 10,
  },
  meter: {
    flex: 10,
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 58,
    //marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3
  },  
  labelWrapper: {
    marginVertical: 5,
  },
  label: {
    position: 'relative',
    top: -5,
    textAlign: 'center',
  },
  labelNote: {
    fontSize: 15,
    fontFamily: 'sans-serif-monospace',
    fontWeight: 'normal',
    position: 'relative',
    top: -5,
    width: '100%',
    textAlign: 'center',
  },
})