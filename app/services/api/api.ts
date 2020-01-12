import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import { DeviceSnapshot } from "../../models/device"
import { UserSnapshot } from "../../models/user"
import { ItemDefinitionSnapshot } from "../../models/item-definition"
import uuid from "uuid"

const API_PAGE_SIZE = 50

/*const convertDevice = (raw: any): DeviceSnapshot => {
  const id = uuid()
  return {
    id: id,
    led_state: raw.led_state,
    name: raw.name,
    user: raw.user,
  }
}*/

const firebaseEncodeEmail = (email) => {
  let encoded = encodeURIComponent(email).replace('.', ',');
  // return double-encoded value to convert '%' to '%25'
  return encodeURIComponent(encoded)
}

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Gets a list of devices
   */
  async getDevices(): Promise<Types.GetDevicesResult> {
    console.log("api: getting devices...")
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get("/devices.json", { amount: API_PAGE_SIZE })
    //console.log("getDevices: response: ", response);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawDevices = response.data
      //console.log("rawDevices: ", rawDevices)
      const convertedDevices: DeviceSnapshot[] = Object.keys(rawDevices).map(s => {
        let result = rawDevices[s]
        result.id = uuid()
        result.device_id = s // add key
        return result
      })
      //console.log("convertedDevices: ", JSON.stringify(convertedDevices))
      return { kind: "ok", devices: convertedDevices }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a list of item definitions
   */
  async getItemDefinitions(): Promise<Types.GetItemDefinitionsResult> {
    //console.log("api: getting item definitions...")
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get("/item_definitions.json", { amount: API_PAGE_SIZE })
    //console.log("getItemDefinitions: response: ", response);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawItemDefinitions = response.data
      //console.log("rawItemDefinitions: ", rawItemDefinitions)
      const convertedItemDefinitions: ItemDefinitionSnapshot[] = Object.keys(rawItemDefinitions).map(s => {
        let result = rawItemDefinitions[s]
        result.id = uuid()
        result.item_definition_id = s // add key
        return result
      })
      //console.log("convertedItemDefinitions: ", JSON.stringify(convertedItemDefinitions))
      return { kind: "ok", item_definitions: convertedItemDefinitions }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a user profile
   */
  // [eschwartz-TODO] Pass in email or user ID param (hardcoded to me for now)
  async getUser(): Promise<Types.GetUserResult> {
    console.log("api: getting user...")
    // make the api call
    let hardcodedUserEmail = "eric@whyanext.com"
    let encodedEmail = firebaseEncodeEmail("eric@whyanext.com")
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${encodedEmail}.json`,
      { amount: API_PAGE_SIZE })
    //console.log("getUser: response: ", response);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawUser = response.data
      //console.log("rawUser: ", rawUser)
      let convertedUser = rawUser
      convertedUser.id = uuid()
      convertedUser.user_id = hardcodedUserEmail.replace('.', ',')
      //console.log("convertedUser: ", JSON.stringify(convertedUser))
      return { kind: "ok", user: convertedUser }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

}
