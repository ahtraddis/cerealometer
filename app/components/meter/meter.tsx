import * as React from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models/root-store"
const {get} = require('underscore.get')
import { ViewStyle, SafeAreaView, Dimensions, View, StyleSheet } from "react-native"
import { color } from "../../theme"

import RNSpeedometer from 'react-native-speedometer'

const METER_SIDEBAR: ViewStyle = {
  marginTop: 10,
  flex: 1,
  backgroundColor: color.palette.darkerPurple,
  opacity: .5
}
const LABEL_COLOR = '#444'

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    marginBottom: 10,
  },
  meter: {
    flex: 10,
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 58,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3
  },
  meterSidebar: {
    ...METER_SIDEBAR,
  },
  meterSidebarLeft: {
    ...METER_SIDEBAR,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3
  },
  meterSidebarRight: {
    ...METER_SIDEBAR,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3
  },
  labelWrapper: {
    marginVertical: 5,
  },
  label: {
    position: 'relative',
    top: -5,
    textAlign: 'center',
  },
  labelNote: {
    fontSize: 15,
    fontFamily: 'sans-serif-monospace',
    fontWeight: 'normal',
    position: 'relative',
    top: -5,
    width: '100%',
    textAlign: 'center',
  },
})

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

export interface MeterProps {
  size?: number
}

interface DisplayProps {
  size?: number
}

const Display: React.FunctionComponent<DisplayProps> = observer((props) => {
  const { userStore } = useStores()
  const { size } = props

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.meterSidebarLeft} />
        <View style={styles.meter}>
          <RNSpeedometer
            easeDuration={500}
            maxValue={100}
            defaultValue={0}
            labelWrapperStyle={styles.labelWrapper}
            labelStyle={styles.label}
            labelNoteStyle={styles.labelNote}
            allowedDecimals={0}
            labels={labels}
            value={get(userStore, 'user.metrics.overallPercentage', 0)}
            size={size}
          />
        </View>
        <View style={styles.meterSidebarRight} />
      </View>
    </SafeAreaView>
  )
})

/**
 * Display the cereal safety meter using the cloud-computed metrics in userStore
 */
export function Meter(props: MeterProps) {
  const { size } = props
  const { width } = Dimensions.get("window")
  const sizeProp = size ? size : width - 140
  return (
    <Display size={sizeProp} {...props} />
  )
}
