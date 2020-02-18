import * as React from "react"
import { UserMetrics } from "../../models/user"
import { View } from "react-native"
import { googleChartColors, SIDEBAR_LEFT, SIDEBAR_RIGHT } from "../../styles/common"
import { styles } from "./bargraph.styles"
const { get } = require('underscore.get')
import { VictoryGroup, VictoryBar } from "victory-native";

interface BargraphProps {
  metrics?: UserMetrics
}

/**
 * Display bargraphs
 */
export function Bargraph(props: BargraphProps) {
  const { metrics } = props

  const overallPercentage = get(metrics, 'overallPercentage', 0)
  const crunchiness = get(metrics, 'crunchiness', 0)
  const sweetness = get(metrics, 'sweetness', 0)
  const favoriteness = get(metrics, 'favoriteness', 0)

  return (
    <View style={styles.container}>
      <View style={SIDEBAR_LEFT} />
      <View style={styles.graph}>
        <VictoryGroup
          offset={35}
          padding={{left: 15, right: 140}}
          animate={{ duration: 500 }}
          domain={{y: [0, 100]}}
          sortKey={(datum) => datum.yValue}
          horizontal={true}
          colorScale={googleChartColors}
        >
          <VictoryBar
            data={[{x: "a", y: 100 * crunchiness, label: "Crunchiness"}]}
          />
          <VictoryBar
            data={[{x: "a", y: 100 * sweetness, label: "Sweetness"}]}
          />
          <VictoryBar
            data={[{x: "a", y: 100 * favoriteness, label: "Favoriteness"}]}
          />
          <VictoryBar
            data={[{x: "a", y: overallPercentage, label: "Overall"}]}
          />
        </VictoryGroup>
      </View>
      <View style={SIDEBAR_RIGHT} />
    </View>
  )
}
