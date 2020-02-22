import { StyleSheet, TextStyle } from "react-native"

export const TINY_TEXT: TextStyle = {
  fontSize: 10,
  color: '#777',
}

export const styles = StyleSheet.create({
	container: {
		display: 'none', // show/hide on all screens
		marginBottom: 15,
		marginTop: 0,
		paddingTop: 5,
		paddingBottom: 0,
		borderTopColor: '#555',
		borderTopWidth: 1,
		flex: 0,
		flexDirection: 'row'
	},
	column: {
		flex: 1,
		paddingLeft: 5,
		paddingRight: 5,
	},
	buttonColumn: {
		flex: 0,
		paddingRight: 5
	},
	button: {
		backgroundColor: "#5D2555",
		padding: 5,
		marginTop: 0,
		marginBottom: 5,
	},
	text: {
		fontSize: 10,
  	color: '#777',
	},
	label: {
		...TINY_TEXT,
  	color: '#bbb',
	}
})
