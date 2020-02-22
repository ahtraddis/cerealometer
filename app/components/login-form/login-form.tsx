import * as React from "react"
import { useStores } from "../../models/root-store"
import { useState } from "react"
import { useNavigation } from 'react-navigation-hooks';
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TouchableHighlight, TextInput, Image } from "react-native"
import { Text, LoadingButton } from "../../components"
import { styles } from "./login-form.styles"
const logo = require("../../static/logo.png")
import * as config from "../../config"
import auth from '@react-native-firebase/auth';

interface ErrorListProps {
  errors: string[],
}

export interface LoginFormProps {
  style?: ViewStyle
}

const ErrorList: React.FunctionComponent<ErrorListProps> = ((props) => {
  const { errors } = props
  return (
    <View style={styles.errorList}>
      { errors.map((error, index) => {
        return <Text style={styles.errorListText} key={index}>{error}</Text>
      })}
    </View>
  )
})

export const LoginForm: React.FunctionComponent<LoginFormProps> = observer((props) => {
  const { style, ...rest } = props

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [userDisabled, setUserDisabled] = useState(false)
  const [userNotFound, setUserNotFound] = useState(false)
  const [wrongPassword, setWrongPassword] = useState(false)
  const [otherError, setOtherError] = useState(false)

  const [loggingIn, setLoggingIn] = useState(false)

  const { userStore } = useStores()
  const { navigate } = useNavigation()

  async function login(email, password) {
    clearErrors()
    setLoggingIn(true)
    try {
      let result = await auth().signInWithEmailAndPassword(email, password);
      // result object includes user, additionalUserInfo
      if (result) {
        navigate('item')
      }
    } catch (e) {
      console.tron.error(e.message);
      switch (e.code) {
        case 'auth/invalid-email':
          setInvalidEmail(true)
          break;
        case 'auth/user-disabled':
          setUserDisabled(true)
          break;
        case 'auth/user-not-found':
          setUserNotFound(true)
          break;
        case 'auth/wrong-password':
          setWrongPassword(true)
          break;
        default:
          setOtherError(true)
          break;
      }
    }
    setLoggingIn(false)
  }

  const clearErrors = () => {
    setInvalidEmail(false)
    setUserDisabled(false)
    setUserNotFound(false)
    setWrongPassword(false)
    setOtherError(false)
  }

  const loginPressed = async() => {
    if (email && password) {
      console.tron.log("login-form: logging in...")
      login(email, password)
    }
  }

  // [eschwartz-TODO] REMOVE AFTER TESTING!
  const populateCorrectLogin = async() => {
    if (config.FIREBASE_AUTH_TEST_EMAIL) {
      setEmail(config.FIREBASE_AUTH_TEST_EMAIL)
    }
    if (config.FIREBASE_AUTH_TEST_PASSWORD) {
      setPassword(config.FIREBASE_AUTH_TEST_PASSWORD)
    }
  }
  const populateIncorrectLogin = async() => {
    if (config.FIREBASE_AUTH_TEST_EMAIL_INCORRECT) {
      setEmail(config.FIREBASE_AUTH_TEST_EMAIL_INCORRECT)
    }
    if (config.FIREBASE_AUTH_TEST_PASSWORD_INCORRECT) {
      setPassword(config.FIREBASE_AUTH_TEST_PASSWORD_INCORRECT)
    }
  }
  const testErrorStates = async() => {
    setInvalidEmail(true)
    //setUserDisabled(true)
    //setWrongPassword(true)
  }

  const logoutPressed = async() => {
    console.tron.log("login-form: logging out...")
    try {
      await auth().signOut();
      userStore.reset()
    } catch (e) {
      console.tron.error(e.message);
    }
  }

  let errors = [];
  if (invalidEmail) {
    errors.push('Aw, snap! Your email address was invalid.')
  }
  if (userDisabled) {
    errors.push('Aw, snap! Your account is currently disabled.')
  }
  if (userNotFound) {
    errors.push('Aw, snap! Your account could not be found.')
  }
  if (wrongPassword) {
    errors.push('Aw, snap! Your password was incorrect.')
  }
  if (otherError) {
    errors.push('Aw, snap! An error occured. Try again later!')
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.upper}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={logo}/>
        </View>
        <View style={styles.errorContainer}>
          { (errors.length > 0) && <ErrorList errors={errors}/> }
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid='transparent'
            onChangeText={(text) => setEmail(text)}
            onFocus={() => clearErrors()}
            value={email}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            onChangeText={(text) => setPassword(text)}
            onFocus={() => clearErrors()}
            value={password}
          />
        </View>

        <LoadingButton
          style={styles.button}
          textStyle={styles.buttonText}
          tx={"login.loginButton"}
          isLoading={loggingIn}
          onPress={() => loginPressed()}
        />

        {/* <TouchableHighlight
          style={styles.linkContainer}
          onPress={() => navigate('forgot')}
        >
          <Text tx={"login.troubleLoggingIn"} />
        </TouchableHighlight> */}

        { !userStore.user.isLoggedIn && (
          <TouchableHighlight
            style={styles.linkContainer}
            onPress={() => navigate('register')}
          >
            <Text tx={"login.registerLabel"} />
          </TouchableHighlight>
        )}
        
        { userStore.user.isLoggedIn && (
          <TouchableHighlight
            style={styles.linkContainer}
            onPress={() => logoutPressed()}>
            <Text tx={"login.logoutLabel"} />
          </TouchableHighlight>
        )}

        <TouchableHighlight style={{marginTop: 20}} onPress={() => populateCorrectLogin()}>
          <Text style={styles.debugText}>TEST: POPULATE CORRECT LOGIN</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => populateIncorrectLogin()}>
          <Text style={styles.debugText}>TEST: POPULATE INCORRECT LOGIN</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => testErrorStates()}>
          <Text style={styles.debugText}>TEST: ERROR STATES</Text>
        </TouchableHighlight>

      </View>
    </View>
  )
});