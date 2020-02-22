import * as React from "react"
import { UserMetrics } from "../../models/user"
import { View, SafeAreaView } from "react-native"
import { Text } from ".."
import { googleChartColors } from "../../styles/common"
import { styles } from "./bargraph.styles"
import { VictoryGroup, VictoryBar } from "victory-native";
const { get } = require('underscore.get')

interface BargraphProps {
  metrics?: UserMetrics
}

// Minimum value to plot for bar visibility when value is 0
const MIN_X_VALUE = 2

/**
 * Display bargraphs
 */
export function Bargraph(props: BargraphProps) {
  const { metrics } = props

  const variety = get(metrics, 'variety', 0)
  const quantity = get(metrics, 'quantity', 0)
  const favoritity = get(metrics, 'favoritity', 0)
  const overall = get(metrics, 'overall', 0)

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.graph}>
          <View>
            <Text style={styles.header} tx={"bargraph.header"} />
          </View>
          <VictoryGroup
            offset={35}
            padding={{left: 15, right: 140}}
            animate={{ duration: 500, onLoad: {duration: 0} }}
            domain={{y: [0, 100]}}
            horizontal={true}
            colorScale={googleChartColors}
            height={150}
          >
            <VictoryBar
              data={[{
                x: "a",
                y: overall ? (100 * overall) : MIN_X_VALUE,
                label: "Overall"
              }]}
            />
            <VictoryBar
              data={[{
                x: "a",
                y: favoritity ? (100 * favoritity) : MIN_X_VALUE,
                label: "Favoritity"
              }]}
            />
            <VictoryBar
              data={[{
                x: "a",
                y: variety ? (100 * variety) : MIN_X_VALUE,
                label: "Variety"
              }]}
            />
            <VictoryBar
              data={[{
                x: "a",
                y: quantity ? (100 * quantity) : MIN_X_VALUE,
                label: "Quantity"
              }]}
            />
          </VictoryGroup>
        </View>
      </View>
    </SafeAreaView>
  )
}
