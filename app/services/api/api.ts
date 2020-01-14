import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG, HTTP_FUNCTION_BASEURL } from "./api-config"
import * as Types from "./api.types"
import { DeviceSnapshot } from "../../models/device"
import { ItemDefinitionSnapshot } from "../../models/item-definition"
import uuid from "uuid"

const HARDCODED_TEST_USER_ID = "1";

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
    const response: ApiResponse<any> = await this.apisauce.get(`/devices.json`)
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
        result.id = uuid() // [eschwartz-TODO] Need this?
        result.device_id = s // add key from parent
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
    const response: ApiResponse<any> = await this.apisauce.get(`/item_definitions.json`)
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
        result.id = uuid() // [eschwartz-TODO] Need this?
        result.item_definition_id = s // add key from parent
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
  async getUser(user_id: string): Promise<Types.GetUserResult> {
    console.log("api: getting user...")
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${user_id}.json`)
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
      //convertedUser.id = uuid()
      convertedUser.user_id = user_id
      //console.log("convertedUser: ", JSON.stringify(convertedUser))
      return { kind: "ok", user: convertedUser }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets UPC data
   * First does a PATCH to /upc/${upc} with submitted: true
   */
  async getUpcData(upc: string): Promise<Types.GetUpcDataResult> {
    console.log("api: getting upc data...")
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`${HTTP_FUNCTION_BASEURL}/getUpcData?upc=${upc}`)
    //console.log("api: getUpcData() response from GET: ", response)
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const rawData = response.data
    console.log("api: getUpcData(): rawData: ", rawData)
    let itemDefinition: any = {}
    if (rawData.item_definition) {
      itemDefinition = rawData.item_definition
    }
    // transform the data into the format we are expecting
    try {
      return { kind: "ok", item_definition: itemDefinition }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Add (create) item for the current user
   */
  // [eschwartz-TODO] Pass in email or user ID param (hardcoded to me for now)
  async addItem(user_id: string, item_definition_id: string): Promise<Types.AddItemResult> {
    console.log("api: adding item for user...")
    // make the api call
    let data = {
      item_definition_id: item_definition_id,
      device_id: "",
      slot: -1,
      last_known_weight_kg: 0,
      last_checkin: 0,
      user_id: user_id,
    }
    const response: ApiResponse<any> = await this.apisauce.post(`/items.json`, data)
    console.log("addItem: response: ", response);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawItem = response.data
      console.log("rawItem: ", rawItem)
      let convertedItem = rawItem
      console.log("convertedItem: ", JSON.stringify(convertedItem))
      return { kind: "ok", item: convertedItem }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
