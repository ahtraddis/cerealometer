import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG, HTTP_FUNCTION_BASEURL } from "./api-config"
import * as Types from "./api.types"
import { DeviceSnapshot } from "../../models/device"
import { ItemSnapshot } from "../../models/item"
import { ItemDefinitionSnapshot } from "../../models/item-definition"

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
  async getDevices(user_id: string): Promise<Types.GetDevicesResult> {
    //console.log(`API: getDevices(): called for user_id '${user_id}'`)
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/devices.json?orderBy="user_id"&equalTo="${user_id}"`)
    //console.log("API: getDevices(): response:", JSON.stringify(response, null, 2));
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawDevices = response.data
      //console.log("API: getDevices(): rawDevices:", JSON.stringify(rawDevices, null, 2))
      const convertedDevices: DeviceSnapshot[] = Object.keys(rawDevices).map(s => {
        let result = rawDevices[s]
        result.device_id = s // add key from parent
        return result
      })
      //console.log("API: getDevices(): convertedDevices:", JSON.stringify(convertedDevices))
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
    //console.log("API: getItemDefinitions() called")
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/item_definitions.json`)
    //console.log("API: getItemDefinitions(): response:", response);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawItemDefinitions = response.data
      //console.log("API: getItemDefinitions(): rawItemDefinitions:", JSON.stringify(rawItemDefinitions, null, 2))
      const convertedItemDefinitions: ItemDefinitionSnapshot[] = Object.keys(rawItemDefinitions).map(s => {
        let result = rawItemDefinitions[s]
        result.item_definition_id = s // add key from parent
        return result
      })
      //console.log("API: getItemDefinitions(): convertedItemDefinitions:", JSON.stringify(convertedItemDefinitions, null, 2))
      return { kind: "ok", item_definitions: convertedItemDefinitions }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets items for user
   */
  async getItems(user_id): Promise<Types.GetItemsResult> {
    //console.log(`API: getItems() called for user_id '${user_id}'`)
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/items.json?orderBy="user_id"&equalTo="${user_id}"`)
    //console.log("API: getItems(): response:", response);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawItems = response.data
      //console.log("API: getItems(): rawItems:", JSON.stringify(rawItems, null, 2))
      const convertedItems: ItemSnapshot[] = Object.keys(rawItems).map(s => {
        let result = rawItems[s]
        result.item_id = s // add key from parent
        return result
      })
      //console.log("API: getItems(): convertedItems:", JSON.stringify(convertedItems, null, 2))
      return { kind: "ok", items: convertedItems }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a user profile
   */
  async getUser(user_id: string): Promise<Types.GetUserResult> {
    //console.log(`API: getUser() called for user_id '${user_id}'`)
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${user_id}.json`)
    //console.log("API: getUser(): response:", JSON.stringify(response, null, 2))
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawUser = response.data
      //console.log("API: getUser(): rawUser:", JSON.stringify(rawUser, null, 2))
      let convertedUser = rawUser
      convertedUser.user_id = user_id
      //console.log("API: getUser():", JSON.stringify(convertedUser, null, 2))
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
    console.log(`API: getUpcData() called for upc '${upc}'`)
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`${HTTP_FUNCTION_BASEURL}/getUpcData?upc=${upc}`)
    //console.log("API: getUpcData(): response from GET: ", JSON.stringify(response, null, 2))
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const rawData = response.data
    console.log("API: getUpcData(): rawData:", JSON.stringify(rawData, null, 2))
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
  async addItem(user_id: string, item_definition_id: string): Promise<Types.AddItemResult> {
    console.log(`API: addItem(): adding item for user_id '${user_id}'`)
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
    console.log("API: addItem(): response:", JSON.stringify(response, null, 2))
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawItem = response.data
      console.log("API: addItem(): rawItem: ", rawItem)
      let convertedItem = rawItem
      console.log("API: addItem(): convertedItem:", JSON.stringify(convertedItem))
      return { kind: "ok", item: convertedItem }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
