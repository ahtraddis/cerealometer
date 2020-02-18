import { StyleSheet } from "react-native"
import { color } from "../../theme/color"
import { ITEM_COMMON } from "../item/item.styles"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slotLabelView: {
    flex: 1,
    height: 18,
    justifyContent: 'center',
    marginBottom: 10,
  },
  slotLabelText: {
    fontSize: 16,
    textAlign: 'center',
  },
  vacantSlot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vacantMessage: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vacantMessageTitle: {
    fontSize: 30,
    color: '#777',
    marginBottom: 10
  },
  vacantMessageText: {
    fontSize: 20,
    color: '#777',
  },
  vacantMessageBody: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  vacantMessageIcon: {
    justifyContent: 'center',
    paddingRight: 5,
  },
  vacantMessageTextContainer: {
    justifyContent: 'center',
  },
  item: {
    ...ITEM_COMMON,
    backgroundColor: color.palette.darkerPurple,
  },
  progress: {
    marginTop: 2
  },
})