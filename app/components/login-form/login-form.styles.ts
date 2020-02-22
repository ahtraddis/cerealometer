import { StyleSheet } from "react-native"
import { color } from "../../theme/color"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.palette.darkerPurple,
  },
  upper: {
    flex: 1,
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
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  form: {
    flex: 2,
  },
  errorContainer: {
    flex: 1,
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: 'center',
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
    justifyContent: 'center',
  },
  button: {
    backgroundColor: color.palette.darkOrange,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 15,
  },
  linkContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    borderRadius: 5,
  },
  errorList: {
    width: 300,
    marginBottom: 15,
  },
  errorListText: {
    color: '#fff',
    backgroundColor: 'red',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  debugText: {
    color: 'white',
    opacity: .3,
  },
});