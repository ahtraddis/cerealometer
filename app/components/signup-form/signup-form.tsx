import * as React from "react"
import { useStores } from "../../models/root-store"
import { useEffect, useState } from "react"
import { useNavigation } from 'react-navigation-hooks';
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TouchableHighlight, TextInput, Image } from "react-native"
import { Text, LoadingButton } from "../../components"
import { styles } from "../login-form/login-form.styles"
const logo = require("../../static/logo.png")
import * as config from "../../config"
import auth from '@react-native-firebase/auth';

interface ErrorListProps {
  errors: string[],
}

export interface SignupFormProps {
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

export const SignupForm: React.FunctionComponent<SignupFormProps> = observer((props) => {
  const { style, ...rest } = props

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [emailAlreadyInUse, setEmailAlreadyInUse] = useState(false)
  const [otherError, setOtherError] = useState(false)
  
  const [registering, setRegistering] = useState(false)

  //const { userStore } = useStores()
  const { navigate } = useNavigation()

  useEffect(() => {})

  async function register(email, password) {
    clearErrors()
    setRegistering(true)
    try {
      let result = await auth().createUserWithEmailAndPassword(email, password);
      console.tron.log(result)
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
        case 'auth/email-already-in-use':
          setEmailAlreadyInUse(true)
          break;
        default:
          setOtherError(true)
          break;
      }
    }
    setRegistering(false)
  }

  const clearErrors = () => {
    setInvalidEmail(false)
    setEmailAlreadyInUse(false)
    setOtherError(false)
  }

  const signupPressed = async() => {
    if (email && password) {
      console.tron.log("signup-form: registering...")
      register(email, password)
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
    setEmailAlreadyInUse(true)
  }

  let errors = [];
  if (invalidEmail) {
    errors.push('Aw, snap! Your email address was invalid.')
  }
  if (emailAlreadyInUse) {
    errors.push('Aw, snap! That email address is already in use.')
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
          tx={"signup.signupButton"}
          isLoading={registering}
          onPress={() => signupPressed()}
        />

        <TouchableHighlight
          style={styles.linkContainer}
          onPress={() => navigate('login')}
        >
          <Text>
            <Text tx={"login.alreadySignedUpLabel"} /> <Text tx={"login.loginHereLabel"} />
          </Text>
        </TouchableHighlight>

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