import { StyleSheet } from "react-native"
import { color } from "../../theme"

export const LABEL_COLOR = '#444'

export const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginLeft: 20,
    marginRight: 20,
    //height: 185,
    flexDirection: 'row',
    marginBottom: 10,
  },
  meter: {
    flex: 10,
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 35,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3
  },
  header: {
    fontSize: 22,
    fontFamily: 'sans-serif-condensed',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  labelWrapper: {
    marginVertical: 5,
  },
  label: {
    position: 'relative',
    top: -67,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'normal',
  },
  labelNote: {
    fontSize: 18,
    fontFamily: 'sans-serif-monospace',
    fontWeight: 'normal',
    position: 'relative',
    top: -24,
    width: '100%',
    textAlign: 'center',
  },

  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: color.palette.darkOrange,
    marginBottom: 5
  },

})