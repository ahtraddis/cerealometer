import { StyleSheet, Dimensions } from "react-native"
import { color } from "../../theme"

const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  child: {
    height: height * 0.5,
    width,
    marginBottom: 10,
  },
  text: {
    fontSize: width * 0.5
  },
  paginationStyleItem: {
    borderColor: color.palette.cheerio,
    borderWidth: 6,
    padding: 5,
    shadowRadius: 1,
    marginBottom: 10,
  },
  empty: {
    paddingTop: 100,
    paddingBottom: 100,
    margin: 15,
    marginBottom: 25,
    backgroundColor: color.palette.darkerPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsTitle: {
    fontSize: 30,
    color: '#777',
    marginBottom: 10
  },
  noItemsText: {
    fontSize: 20,
    color: '#777',
  },
});