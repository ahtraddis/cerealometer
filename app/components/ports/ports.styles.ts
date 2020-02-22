import { StyleSheet, Dimensions } from "react-native"
import { color } from "../../theme"

export const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
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
	},
	shelf: {
		flex: 0,
		flexDirection: 'row',
		marginBottom: 30,
		marginTop: 20,
	},
	slot: {
		flex: 0,
		width: 60,
		height: 60,
		borderColor: 'transparent',
		borderRightWidth: 1,
		marginRight: 1,
		backgroundColor: '#fff',
		//opacity: .2,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	image: {
		width: 50,
		height: 50,
		resizeMode: 'contain'
	},
	statusDebug: {
		display: 'none',
		alignItems: 'center',
		marginBottom: 2,
		opacity: 0.5,
	},
	statusDebugText: {
		color: '#fff',
		fontSize: 10
	},
	slotCaption: {
		alignItems: 'center',
		backgroundColor: color.palette.darkPurple,
		opacity: 1,
		borderColor: 'transparent',
		marginRight: 1,
		marginTop: 1,
	},
	slotCaptionHighlight: {
		alignItems: 'center',
		backgroundColor: color.palette.orangeDarker,
		borderColor: 'transparent',
		marginRight: 1,
		marginTop: 1,
	},
	slotCaptionText: {
		color: '#fff',
		fontSize: 12
	},
	shelfName: {
		padding: 10,
		alignItems: 'center'
	},
	shelfNameText: {
		fontSize: 16,
		color: '#fff'
	}
});