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

const BASE_URL = "http://10.1.1.17";

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
const FETCH: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  marginBottom: 10,
  backgroundColor: "#5D2555",
}
const FETCH_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = {
  backgroundColor: "#20162D"
}
const METER: ViewStyle = {
  backgroundColor: "#ffffff",
  paddingTop: 10,
  paddingBottom: 70,
  marginBottom: 10,
}
const SWITCH_CONTAINER: ViewStyle = {
  padding: 20,
  alignItems: "center"
}
const SWITCH: ViewStyle = {
  textAlign: "center",
  paddingVertical: spacing[100],
  backgroundColor: "#000",
  padding: 80,
  border: "1px solid red",
  margin: 10,
  width: 100,
}
const DEVICE: ViewStyle = {
  marginBottom: 10,
}
const DEVICE_NAME: ViewStyle = {
  alignItems: "center",
  backgroundColor: "darkgreen",
  padding: 10,
}
const DEVICE_TEXT: ViewStyle = {
  color: "#fff",
}
const SLOT: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  width: "100%",
  backgroundColor: "green",
}
const SLOT_NUMBER: ViewStyle = {
  width: "10%",
  alignItems: "center",
  backgroundColor: "forestgreen",
  padding: 10,
}
const SLOT_NAME: ViewStyle = {
  width: "45%",
  padding: 10
}
const SLOT_STATUS: ViewStyle = {
  width: "45%",
  padding: 10,
  alignItems: "flex-end"
}

function kilogramsToOunces(kilograms) {
  return (kilograms * 2.2046 * 16.0).toFixed(1);
}


function Items({ userId }) {
  const [initializing, setInitializing] = useState(true);
  const [items, setItems] = useState(null);
 
  // Subscriber handler
  function onItemsChange(snapshot) {
    // Set the items state from the snapshot
    console.log("onItemsChange fired: ", snapshot.val());
    setItems(snapshot.val());
 
    // Connection established
    if (initializing) setInitializing(false);
  }
 
  useEffect(() => {
    // Create reference
    const ref = database().ref(`/items/${deviceId}`);
 
    // Subscribe to value changes
    ref.on('value', onDeviceChange);
 
    // Unsubscribe from changes on unmount
    return () => ref.off('value', onDeviceChange);
  }, [deviceId]);
 
  // Wait for first connection
  if (initializing) return null;

  return (
    <View><Text>test</Text></View>
  )
}

function Device({ deviceId }) {
  const [initializing, setInitializing] = useState(true);
  const [device, setDevice] = useState(null);
 
  // Subscriber handler
  function onDeviceChange(snapshot) {
    // Set the device state from the snapshot
    console.log("onDeviceChange fired: ", snapshot.val());
    setDevice(snapshot.val());
 
    // Connection established
    if (initializing) setInitializing(false);
  }
 
  useEffect(() => {
    // Create reference
    const ref = database().ref(`/devices/${deviceId}`);
 
    // Subscribe to value changes
    ref.on('value', onDeviceChange);
 
    // Unsubscribe from changes on unmount
    return () => ref.off('value', onDeviceChange);
  }, [deviceId]);
 
  // Wait for first connection
  if (initializing) return null;

  return (
    <View style={DEVICE}>
      <View style={DEVICE_NAME}>
        <Text style={DEVICE_TEXT}>
          {device.name}
        </Text>
      </View>
      { device.slots.map((slot, index) => {
        return (
          <View style={SLOT}>
            <View style={SLOT_NUMBER}>
              <Text>{index + 1}</Text>
            </View>
            <View style={SLOT_NAME}>
              <Text>
                {kilogramsToOunces(slot.weight_kg)} oz
              </Text>
            </View>
            <View style={SLOT_STATUS}>
              <Text>
                {slot.status}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export interface WelcomeScreenProps extends NavigationScreenProps<{}> {}

export const WelcomeScreen: React.FunctionComponent<WelcomeScreenProps> = props => {
  const nextScreen = React.useMemo(() => () => props.navigation.navigate("demo"), [
    props.navigation,
  ]);

  const [state, setState] = useState({
    fullDeflectionWeightKg: 0.387,
    deflectionPct: 57,
    ledState: 0,
    weightKg: 0,
    devices: [],
    // Placeholder values until I figure out where state belongs and how to do auth
    //userId: encodeURIComponent("eric@whyanext,com"), // note the comma
    userId: "eric%40whyanext,com",
    deviceId: "-LxNyE47HCaN9ojmR3D2",
  });

  const [items, setItems] = useState(null);
  const [name, setName] = useState(null);

  //var userId = auth().currentUser.uid;
  var userId = state.userId;
  database().ref('/users/' + userId).once('value').then(function(snapshot) {
    console.log("user snapshot.val(): ", snapshot.val());
    var name = (snapshot.val() && snapshot.val().name) || 'Anonymous';
    setName(name);
  });



  database().ref('/items').orderByChild('user').equalTo(state.userId).once('value').then(function(snapshot) {
    console.log("items snapshot.val(): ", snapshot.val());
    //setItems(snapshot.val());
  });

  const getPercentage = (weightKg) => {
    console.log("getPercentage(): state = ", state);
    return Math.min(Math.max(parseInt(100.0 * weightKg / state.fullDeflectionWeightKg), 0), 100);
  }

  // For testing. App won't normally fetch data directly from the ESP8266.
  const fetchData = () => {
    fetch(BASE_URL + '/status', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(json => {
        //console.log("json: " + JSON.stringify(json));
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
        {/*<SafeAreaView style={SWITCH_CONTAINER}>
          <Switch
            style={SWITCH}
            value={state.ledState}
            onToggle={updateLedState}
          />
        </SafeAreaView>*/}
        {/*<SafeAreaView>
          <Button
            style={FETCH}
            textStyle={FETCH_TEXT}
            tx="welcomeScreen.fetch"
            onPress={fetchData}
          />
        </SafeAreaView>*/}
        <SafeAreaView>
          <Device key={0} style={DEVICE} deviceId={state.deviceId} />
        </SafeAreaView>
        <SafeAreaView>
          <View>
            <Text>userId: "{state.userId}"</Text>
            <Text>deviceId: "{state.deviceId}"</Text>
            <Text>name: "{name}"</Text>
          </View>
        </SafeAreaView>
        { items &&
          <SafeAreaView>
            <View>
                { Object.keys(items).map(function(key, index) {
                  return (
                    <Text key={index}>{items[key].name}</Text>
                  );
                })}
              
            </View>
          </SafeAreaView>
        }
      </Screen>
    </View>
  )
}
