import { StyleSheet, Dimensions } from "react-native"
import { color } from "../../theme"

const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  child: {
    height: height * 0.5,
    width
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
  }
});