import { StyleSheet, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 185,
    flexDirection: 'row',
    //marginBottom: 10,
    // justifyContent: "center",
    // alignItems: "center",
    //backgroundColor: "#fff",
    // margin: 10,
    // borderRadius: 2,
  },
  graph: {
    flex: 10,
    backgroundColor: '#fff',
    //paddingTop: 8,
    //paddingBottom: 58,
    //marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3
  },
})

