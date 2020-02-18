import { StyleSheet } from "react-native"
import { color } from "../../theme/color"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.palette.darkerPurple,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#ffffff',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center'
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
  loginText: {
    color: 'white',
  }
});