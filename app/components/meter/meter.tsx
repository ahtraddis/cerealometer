import * as React from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models/root-store"
import { ViewStyle, SafeAreaView, Dimensions } from "react-native"

import RNSpeedometer from 'react-native-speedometer'

const METER: ViewStyle = {
  backgroundColor: "#ffffff",
  paddingTop: 10,
  paddingBottom: 70,
  marginBottom: 10,
}

const LABEL = {
  position: 'relative',
  top: -5,
  textAlign: 'center',
}
const LABEL_NOTE = {
  fontSize: 20,
  fontWeight: 'bold',
  position: 'relative',
  top: -5,
  backgroundColor: '#fff',
  width: '100%',
  textAlign: 'center',
}

export interface MeterProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

const labels = [
  {
    name: "TOAST. 😢",
    labelColor: '#ff2900',
    activeBarColor: '#ff2900',
  },
  {
    name: 'Oh My God',
    labelColor: '#ff5400',
    activeBarColor: '#ff5400',
  },
  {
    name: 'Getting Desperate',
    labelColor: '#f4ab44',
    activeBarColor: '#f4ab44',
  },
  {
    name: 'Fair',
    labelColor: '#f2cf1f',
    activeBarColor: '#f2cf1f',
  },
  {
    name: 'Strong',
    labelColor: '#14eb6e',
    activeBarColor: '#14eb6e',
  },
  {
    name: 'Unbelievably Strong',
    labelColor: '#00ff6b',
    activeBarColor: '#00ff6b',
  },
]

// [eschwartz-TODO] Rewrite with observer wrapper on Meter (syntax?)
const Display = observer(() => {
  const { userStore } = useStores()
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={METER}>
      <RNSpeedometer
        easeDuration={500}
        maxValue={100}
        defaultValue={0}
        labelWrapperStyle={{marginVertical: 5}}
        labelStyle={LABEL}
        labelNoteStyle={LABEL_NOTE}
        allowedDecimals={0}
        labels={labels}
        value={userStore.user.meter}
        size={width-70}
      />
    </SafeAreaView>
  )
})

/**
 * Display the cereal safety meter using the cloud-computed metrics in userStore
 */
export function Meter(props: MeterProps) {
  // grab the props
  const { tx, text, style, ...rest } = props
  //const textStyle = { }

  return <Display />
}
