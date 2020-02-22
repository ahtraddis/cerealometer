import * as React from "react"
import { SafeAreaView, Dimensions, View } from "react-native"
import { Text } from "../"
import { color } from "../../theme"
import { styles, LABEL_COLOR } from "./meter.styles"
import RNSpeedometer from 'react-native-speedometer'

const labels = [
  {
    name: "YOU'RE HAVING TOAST",
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterRed,
  },
  {
    name: 'OH MY GOD',
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterDarkOrange,
  },
  {
    name: 'GETTING DESPERATE',
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterOrange,
  },
  {
    name: 'FAIR',
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterGold,
  },
  {
    name: 'STRONG',
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterGreen,
  },
  {
    name: 'UNBELIEVABLY STRONG',
    labelColor: LABEL_COLOR,
    activeBarColor: color.palette.meterLightGreen,
  },
]

export interface MeterProps {
  size?: number
  value?: number
}

/**
 * Display the cereal safety meter using the cloud-computed metrics in userStore
 */
export function Meter(props: MeterProps) {
  const { size, value } = props
  const { width } = Dimensions.get("window")

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.meter}>
          <Text style={styles.header} tx={"meter.header"} />
          <RNSpeedometer
            easeDuration={500}
            maxValue={100}
            defaultValue={0}
            labelWrapperStyle={styles.labelWrapper}
            labelStyle={styles.label}
            labelNoteStyle={styles.labelNote}
            allowedDecimals={0}
            labels={labels}
            value={value ? value : 0}
            size={size ? size : width - 140}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
