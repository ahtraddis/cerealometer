import * as React from "react"
import { useStores } from "../../models/root-store"
import { useEffect, useState } from "react"
import { useNavigation } from 'react-navigation-hooks';
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TouchableHighlight, TextInput } from "react-native"
import { Text } from "../../components"
import { styles } from "./login-form.styles"
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
    <View>
      { errors.map((error, index) => {
        return <Text key={index} style={{color: '#fff'}}>{error}</Text>
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

  const { userStore } = useStores()
  const { navigate } = useNavigation()

  useEffect(() => {})

  // async function register(email, password) {
  //   try {
  //     let result = await auth().createUserWithEmailAndPassword(email, password);
  //     console.tron.log(result);
  //   } catch (e) {
  //     console.tron.error(e.message);
  //   }
  // }

  async function login(email, password) {
    clearErrors()
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
  }

  const clearErrors = () => {
    setInvalidEmail(false)
    setUserDisabled(false)
    setUserNotFound(false)
    setWrongPassword(false)
    setOtherError(false)
  }

  const loginPressed = async() => {
    //console.tron.log("login-form: logging in...")
    login(email, password)
  }

  // [eschwartz-TODO] REMOVE AFTER TESTING!
  const loginTestPressed = async() => {
    setEmail('eric@whyanext.com')
    setPassword('test123')
  }

  const logoutPressed = async() => {
    //console.tron.log("login-form: logging out...")
    try {
      let result = await auth().signOut();
    } catch (e) {
      console.tron.error(e.message);
    }
  }

  let errors = [];
  if (invalidEmail) {
    errors.push('Invalid email')
  }
  if (userDisabled) {
    errors.push('User disabled')
  }
  if (userNotFound) {
    errors.push('User not found')
  }
  if (wrongPassword) {
    errors.push('Wrong password')
  }
  if (otherError) {
    errors.push('Other error')
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Email"
          keyboardType="email-address"
          underlineColorAndroid='transparent'
          onChangeText={(text) => setEmail(text)}
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
          value={password}
        />
      </View>

      <TouchableHighlight
        style={[styles.buttonContainer, styles.loginButton]}
        onPress={() => loginPressed()}
      >
        <Text style={styles.loginText} tx={"login.loginButton"} />
      </TouchableHighlight>

      <ErrorList errors={errors}/>

      <TouchableHighlight
        style={styles.buttonContainer}
        onPress={() => navigate('forgot')}
      >
          <Text>Forgot password?</Text>
      </TouchableHighlight>

      { !userStore.user.isLoggedIn && (
        <TouchableHighlight
          style={styles.buttonContainer}
          onPress={() => navigate('register')}
        >
            <Text>Register</Text>
        </TouchableHighlight>
      )}
      
      { userStore.user.isLoggedIn && (
        <TouchableHighlight
          style={styles.buttonContainer}
          onPress={() => logoutPressed()}>
            <Text>Logout</Text>
        </TouchableHighlight>
      )}

      <TouchableHighlight
        style={{marginTop: 20}}
        onPress={() => loginTestPressed()}
      >
        <Text style={styles.loginText}>TEST: POPULATE CORRECT LOGIN</Text>
      </TouchableHighlight>

    </View>
  )
});