import { StyleSheet } from "react-native"
import toUpper from "ramda/es/toUpper"

export const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    // justifyContent: "center",
    // alignItems: "center",
    //backgroundColor: "#fff",
    // margin: 10,
    // borderRadius: 2,
  },
  graph: {
    flex: 1,
    backgroundColor: '#fff',
    //paddingTop: 8,
    //paddingBottom: 58,
    //marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3,
    paddingTop: 8,
  },
  header: {
    fontSize: 22,
    fontFamily: 'sans-serif-condensed',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    textTransform: 'uppercase',
  }
})

