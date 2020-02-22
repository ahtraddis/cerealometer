import createNativeStackNavigator from "react-native-screens/createNativeStackNavigator"
import {
  LoginScreen,
  ForgotScreen,
  RegisterScreen,
} from "../screens"

export const AuthNavigator = createNativeStackNavigator(
  {
    login: {
      screen: LoginScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Login",
        headerTitleAlign: 'center',
      }),
    },
    register: {
      screen: RegisterScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Sign Up",
        headerTitleAlign: 'center',
      }),
    },
    forgot: {
      screen: ForgotScreen,
      navigationOptions: ( {navigation }) => ({
        title: "Forgot",
        headerTitleAlign: 'center',
      }),
    },
  },
  {
    headerMode: 'none',
    initialRouteName: "login",
    tabBarOptions: {
      style: {
        height: 36,
        backgroundColor: '#555',
      },
      tabStyle: {
        marginRight: 1,
        marginLeft: 0,
      },
      labelPosition: 'below-icon',
      labelStyle: {
        fontSize: 13,
      },
      activeBackgroundColor: '#1e0033',
      inactiveBackgroundColor: '#ccc',
      activeTintColor: '#ccc',
      inactiveTintColor: '#333',
    }
  },
)

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 */
export const exitRoutes: string[] = ["login", "register", "forgot"]
