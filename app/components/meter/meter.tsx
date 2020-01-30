import * as React from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models/root-store"
const {get} = require('underscore.get')
import { ViewStyle, SafeAreaView, Dimensions, View } from "react-native"
import { color } from "../../theme"

import RNSpeedometer from 'react-native-speedometer'

const LABEL_COLOR = '#444'
const CONTAINER: ViewStyle = {
  flex: 0,
  flexDirection: 'row',
  marginBottom: 10,
}
const METER: ViewStyle = {
  flex: 10,
  backgroundColor: '#fff',
  paddingTop: 8,
  paddingBottom: 58,
  marginTop: 5,
  marginLeft: 10,
  marginRight: 10,
  borderRadius: 3
}
const LABEL = {
  position: 'relative',
  top: -5,
  textAlign: 'center',
}
const LABEL_NOTE = {
  fontSize: 15,
  fontFamily: 'sans-serif-monospace',
  fontWeight: 'normal',
  position: 'relative',
  top: -5,
  width: '100%',
  textAlign: 'center',
}

const labels = [
  {
    name: "YOU'RE HAVING TOAST 😢",
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterRed,
  },
  {
    name: 'OH MY GOD 😳',
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterDarkOrange,
  },
  {
    name: 'GETTING DESPERATE 😟',
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterOrange,
  },
  {
    name: 'FAIR 🙂',
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterGold,
  },
  {
    name: 'STRONG 😋',
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterGreen,
  },
  {
    name: 'UNBELIEVABLY STRONG 🙂',
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterLightGreen,
  },
]
const LABEL_WRAPPER: ViewStyle = {
  marginVertical: 5,
}
const METER_SIDEBAR: ViewStyle = {
  marginTop: 10,
  flex: 1,
  backgroundColor: color.palette.darkerPurple,
  opacity: .5
}
const METER_SIDEBAR_LEFT: ViewStyle = {
  ...METER_SIDEBAR,
  borderTopRightRadius: 3,
  borderBottomRightRadius: 3
}
const METER_SIDEBAR_RIGHT: ViewStyle = {
  ...METER_SIDEBAR,
  borderTopLeftRadius: 3,
  borderBottomLeftRadius: 3
}

const Display = observer((props) => {
  const { userStore } = useStores()
  const { width } = Dimensions.get("window");

  return (
    <SafeAreaView>
      <View style={CONTAINER}>
        <View style={METER_SIDEBAR_LEFT} />
        <View style={METER}>
          <RNSpeedometer
            easeDuration={500}
            maxValue={100}
            defaultValue={0}
            labelWrapperStyle={LABEL_WRAPPER}
            labelStyle={LABEL}
            labelNoteStyle={LABEL_NOTE}
            allowedDecimals={0}
            labels={labels}
            value={get(userStore, 'user.metrics.overallPercentage', 0)}
            size={width-140}
          />
        </View>
        <View style={METER_SIDEBAR_RIGHT} />
      </View>
    </SafeAreaView>
  )
})

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

/**
 * Display the cereal safety meter using the cloud-computed metrics in userStore
 */
export function Meter(props: MeterProps) {
  const { tx, text, style, ...rest } = props

  return <Display {...props} />
}
