import * as React from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models/root-store"
import { ViewStyle, SafeAreaView, Dimensions, Text, View } from "react-native"
import { color } from "../../theme"

import RNSpeedometer from 'react-native-speedometer'

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
  //fontSize: 16,
}
const LABEL_NOTE = {
  fontSize: 16,
  fontFamily: 'sans-serif-monospace',
  fontWeight: 'normal',
  position: 'relative',
  top: -5,
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
  showStats?: boolean
}

const labels = [
  {
    name: "TOAST.😢",
    labelColor: '#444', //'#ff2900',
    activeBarColor: '#ff2900',
  },
  {
    name: 'OH MY GOD.😳',
    labelColor: '#444', //'#ff5400',
    activeBarColor: '#ff5400',
  },
  {
    name: 'GETTING DESPERATE 😟',
    labelColor: '#444', //'#f4ab44',
    activeBarColor: '#f4ab44',
  },
  {
    name: 'FAIR 🙂',
    labelColor: '#444', //'#f2cf1f',
    activeBarColor: '#f2cf1f',
  },
  {
    name: 'STRONG 😋',
    labelColor: '#444', //'#14eb6e',
    activeBarColor: '#14eb6e',
  },
  {
    name: 'UNBELIEVABLY STRONG 🙂',
    labelColor: '#444', //'#00ff6b',
    activeBarColor: '#00ff6b',
  },
]
const LABEL_WRAPPER: ViewStyle = {
  marginVertical: 5,
}
const METER_SIDEBAR: ViewStyle = {
  marginTop: 10,
  flex: 1, backgroundColor: '#312244',
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

// [eschwartz-TODO] Rewrite with observer wrapper on Meter (syntax?)
const Display = observer((props) => {
  const { userStore } = useStores()
  const { width } = Dimensions.get("window");
  const { showStats } = props
  let overallPercentage = (userStore && userStore.user && userStore.user.metrics) ? userStore.user.metrics.overallPercentage.toFixed(0) : 0;
  let totalKg = (userStore && userStore.user && userStore.user.metrics) ? userStore.user.metrics.totalKg : 0;
  let totalNetWeightKg = (userStore && userStore.user && userStore.user.metrics) ? userStore.user.metrics.totalNetWeightKg : 0;
  return (
    <SafeAreaView>
      <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
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
            value={(userStore && userStore.user && userStore.user.metrics) ? userStore.user.metrics.overallPercentage : 0 }
            size={width-120}
          />
        </View>
        <View style={METER_SIDEBAR_RIGHT} />
      </View>
      
    </SafeAreaView>
  )
})

/**
 * Display the cereal safety meter using the cloud-computed metrics in userStore
 */
export function Meter(props: MeterProps) {
  // grab the props
  const { tx, text, style, showStats, ...rest } = props

  return <Display {...props} />
}
