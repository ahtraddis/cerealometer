import * as React from "react"
import { Component } from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Button, Header, Screen, Text, Wallpaper, Switch } from "../../components"
import { color, spacing } from "../../theme"

import RNSpeedometer from 'react-native-speedometer'

import { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'

const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const ALMOST: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
  fontStyle: "italic",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}
const FETCH: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const FETCH_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
const METER: ViewStyle = { backgroundColor: "#ffffff", paddingBottom: 80 }
const SWITCH_CONTAINER: ViewStyle = {
  padding: 20,
  alignItems: "center"
}
const SWITCH: ViewStyle = {
  paddingVertical: spacing[100],
  backgroundColor: "#000",
  padding: 80,
  border: "1px solid red",
  margin: 10,
  width: 100,
  //transform: [{scaleX: 2}, {scaleY: 2}],
}
const DATA: ViewStyle = {
  paddingTop: 10,
}
const BASE_URL = "http://10.1.1.17";

export interface WelcomeScreenProps extends NavigationScreenProps<{}> {}

export default class Slot extends Component {
  render() {
    return <Text>slot: weight_kg = {this.props.weight_kg}, status = {this.props.status}</Text>
  }
}

export default class Device extends Component {
  render() {
    return (
      <View>
        { this.props.slots.map(slot => {
          return <Slot weight_kg={slot.weight_kg} status={slot.status}></Slot>
        })}
      </View>
    )
  }
}

export const WelcomeScreen: React.FunctionComponent<WelcomeScreenProps> = props => {
  const nextScreen = React.useMemo(() => () => props.navigation.navigate("demo"), [
    props.navigation,
  ]);

  const [state, setState] = useState({
    fullDeflectionWeightKg: 0.387,
    deflectionPct: 0,
    ledState: 0,
    weightKg: 0,
    devices: [],
  });

  const getPercentage = (weightKg) => {
    console.log("getPercentage(): state = ", state);
    return Math.min(Math.max(parseInt(100.0 * weightKg / state.fullDeflectionWeightKg), 0), 100);
  }

  const fetchData = () => {
    fetch(BASE_URL + '/status', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(json => {
        console.log("json: " + JSON.stringify(json));
        setState({
          ...state,
          ledState: json.led_state,
          weightKg: json.weight_kg,
          deflectionPct: getPercentage(json.weight_kg),
          devices: [json],
        })
      })
      .catch(error => {
        console.error(error);
      });
  }

  const updateLedState = (value) => {
    //alert("updateLedState(): value=" + (value ? "on" : "off"));
    // update state optimistically
    setState({
      ...state,
      ledState: value,
    });
    fetch(BASE_URL + '/led/' + (value ? "on" : "off"), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(json => {
        setState({
          ...state,
          ledState: json.led_state,
          weightKg: json.weight_kg,
          deflectionPct: getPercentage(json.weight_kg),
        })
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header headerTx="welcomeScreen.title" style={HEADER} titleStyle={HEADER_TITLE} />
        <SafeAreaView style={METER}>
          <RNSpeedometer value={state.deflectionPct} size={275}/>
        </SafeAreaView>
        <SafeAreaView style={SWITCH_CONTAINER}>
          <Switch
            style={{textAlign: "center"}}
            value={state.ledState}
            onToggle={updateLedState}
          />
        </SafeAreaView>
        <SafeAreaView>
          <Button
            style={FETCH}
            textStyle={FETCH_TEXT}
            tx="welcomeScreen.fetch"
            onPress={fetchData}
          />
          <Text style={DATA}>
            ledState = {state.ledState}{"\n"}
            weightKg = {state.weightKg} ({(state.weightKg * 2.2046 * 16.0).toFixed(2)} oz){"\n"}
            devices = {JSON.stringify(state.devices)}

            

          </Text>
          {state.devices.map((device, i) => {
              return <Device key={i}
                device_id={device.device_id}
                led_state={device.led_state}
                slots={device.slots}
              />
          })}
        </SafeAreaView>
      </Screen>
      
    </View>
  )
}
