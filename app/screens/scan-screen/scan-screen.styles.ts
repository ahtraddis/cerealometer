import { StyleSheet, ViewStyle } from "react-native"
import { color } from "../../theme/color"
import { BLACK, WHITE } from "../../styles/common"

export const ITEM_HEIGHT = 60;

export const ITEM_CONTAINER: ViewStyle = {
  backgroundColor: color.palette.lightPlum,
  height: ITEM_HEIGHT,
  padding: 0,
  marginBottom: 20,
  marginLeft: 15,
  marginRight: 15,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 3,
}
export const ITEM_BUTTON: ViewStyle = {
  marginTop: 5,
  marginBottom: 5,
  paddingTop: 10,
  paddingBottom: 10,
  backgroundColor: color.palette.darkPurple,
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  instructions: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  camera: {
    flex: 3,
    borderColor: 'black',
    borderTopWidth: 3,
    borderBottomWidth: 3,
  },
  results: {
    flex: 4,
    flexDirection: 'column',
  },
  resultsList: {
    flex: 5,
    paddingTop: 20,
  },
  noResults: {
    flex: 1,
    paddingTop: 20,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 20,
    opacity: .5,
  },
  resultsButtons: {
    flex: 1,
    paddingLeft: 10,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
  },
  itemContainer: {
    ...ITEM_CONTAINER,
  },
  itemFoundContainer: {
    ...ITEM_CONTAINER,
    backgroundColor: color.palette.white,
  },
  outer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageView: {
    flex: 1,
    width: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
    paddingLeft: 5,
  },
  image: {
    height: ITEM_HEIGHT - 10,
    resizeMode: 'contain',
    marginTop: 5
  },
  infoView: {
    flex: 4,
    height: ITEM_HEIGHT,
    paddingLeft: 10,
    paddingRight: 0,
  },
  infoContentView: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonsView: {
    flex: 1,
    paddingLeft: 10,
  },
  titleView: {
    marginBottom: 5,
    flex: 8,
    height: 50,
    overflow: 'hidden',
    marginTop: 5,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  quanView: {
    flex: 0,
    display: 'none', // [eschwartz-TODO] Hiding quan +/- for now
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  quanColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quanButtonView: {
    flex: 1,
    justifyContent: 'center',
    padding: 5,
  },
  quanButton: {
    backgroundColor: '#aaa',
    width: 20,
  },
  quanButtonText: {
    fontSize: 20,
  },
  quanText: {
    color: '#000',
    fontSize: 15,
  },
  titleText: {
    ...BLACK,
    fontSize: 14,
  },
  itemButtonView: {
    paddingRight: 5,
    flex: 0,
    flexDirection: 'column',
  },
  itemButton: {
    ...ITEM_BUTTON,
  },
  itemButtonDisabled: {
    ...ITEM_BUTTON,
    backgroundColor: '#bbb'
  },
  itemButtonText: {
    ...WHITE,
    fontSize: 12,
  },
  actionButton: {
    padding: 5,
    backgroundColor: color.palette.darkPurple,
    width: 100,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 14,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    marginRight: 10,
    marginTop: 2
  },
  progressColor: {
    color: 'white',
  },
  fetchingText: {
    color: '#ccc',
  },
})