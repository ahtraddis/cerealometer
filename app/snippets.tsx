// For local testing. App won't normally fetch data directly from the ESP8266.
// const fetchData = () => {
//   fetch(BASE_URL + '/status', {
//     method: 'GET',
//   })
//   .then(response => response.json())
//   .then(json => {
//     //console.log("json: " + JSON.stringify(json));
//     setState({
//       ...state,
//       ledState: json.led_state,
//       weightKg: json.weight_kg,
//       deflectionPct: getPercentage(json.weight_kg),
//       devices: [json],
//     })
//   })
//   .catch(error => {
//     console.error(error);
//   });
// }

// For local testing.
// const updateLedState = (value) => {
//   //alert("updateLedState(): value=" + (value ? "on" : "off"));
//   // update state optimistically
//   setState({
//     ...state,
//     ledState: value,
//   });
//   fetch(BASE_URL + '/led/' + (value ? "on" : "off"), {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     }
//   })
//   .then(response => response.json())
//   .then(json => {
//     setState({
//       ...state,
//       ledState: json.led_state,
//       weightKg: json.weight_kg,
//       deflectionPct: getPercentage(json.weight_kg),
//     })
//   })
//   .catch(error => {
//     console.error(error);
//   });
// }
