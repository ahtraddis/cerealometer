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
   * Fetches a list of user's devices
   */
  async getDevices(user_id: string): Promise<Types.GetDevicesResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`/devices.json?orderBy="user_id"&equalTo="${user_id}"`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawDevices = response.data
      const convertedDevices: DeviceSnapshot[] = Object.keys(rawDevices).map(s => {
        let result = rawDevices[s]
        result.id = s // add key from parent
        return result
      })
      return { kind: "ok", devices: convertedDevices }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a list of ports associated with user's device(s)
   */
  async getPorts(user_id: string): Promise<Types.GetPortsResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`${HTTP_FUNCTION_BASEURL}/getPorts?user_id=${user_id}`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    // Return raw response since savePorts() parses both this GET and realtime updates
    return { kind: "ok", ports: response.data }
  }

  /**
   * Gets a list of item definitions associated with the user's items
   */
  async getItemDefinitions(user_id): Promise<Types.GetItemDefinitionsResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`${HTTP_FUNCTION_BASEURL}/getItemDefinitions?user_id=${user_id}`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawItemDefinitions = response.data
      const convertedItemDefinitions: ItemDefinitionSnapshot[] = Object.keys(rawItemDefinitions).map(s => {
        let result = rawItemDefinitions[s]
        result.id = s // add key from parent
        return result
      })
      return { kind: "ok", item_definitions: convertedItemDefinitions }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Get messages for user
   */
  async getMessages(user_id): Promise<Types.GetMessagesResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`/messages/${user_id}.json`)
    console.tron.log(response)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    // Return raw response since saveMessages() parses both this GET and realtime updates
    return { kind: "ok", messages: response.data }
  }

  /**
   * Delete message for the current user
   */
  async deleteMessage(id: string): Promise<Types.DeleteItemResult> {
    if (!id) {
      __DEV__ && console.tron.log('missing message id')
      return null
    }
    
    // const response: ApiResponse<any> = await this.apisauce.delete(`/messages/${item_id}.json`)
    // if (!response.ok) {
    //   const problem = getGeneralApiProblem(response)
    //   if (problem) return problem
    // }

    // try {
    //   const rawItem = response.data // expecting null
    //   return { kind: "ok", item: rawItem }
    // } catch (e) {
    //   __DEV__ && console.tron.log(e.message)
    //   return { kind: "bad-data" }
    // }
  }

  /**
   * Gets items for user
   */
  async getItems(user_id): Promise<Types.GetItemsResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`/items.json?orderBy="user_id"&equalTo="${user_id}"`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawItems = response.data
      const convertedItems: ItemSnapshot[] = Object.keys(rawItems).map(s => {
        let result = rawItems[s]
        result.id = s // add key from parent
        return result
      })
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
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${user_id}.json`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawUser = response.data
      let convertedUser = rawUser
      convertedUser.uid = user_id // add key
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
    const response: ApiResponse<any> = await this.apisauce.get(`${HTTP_FUNCTION_BASEURL}/getUpcData?upc=${upc}`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const rawData = response.data
    let itemDefinition: any = {}
    if (rawData.item_definition) {
      itemDefinition = rawData.item_definition
    }
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
  async addItem(user_id: string, item_definition_id: string, quantity: number): Promise<Types.AddItemResult> {
    if (!item_definition_id) {
      __DEV__ && console.tron.log('missing item_definition_id')
      return null
    }
    let data = {
      item_definition_id: item_definition_id,
      last_known_weight_kg: 0,
      last_update_time: 0,
      user_id: user_id,
    }
    let lastResponse;
    for (let count = 0; count < quantity; count++) {
      const response: ApiResponse<any> = await this.apisauce.post(`/items.json`, data)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      lastResponse = response
    }
    try {
      const rawItem = lastResponse.data
      __DEV__ && console.tron.log(`API: addItem(): (added ${quantity}, result from last) rawItem: `, rawItem)
      return { kind: "ok", item: rawItem }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Delete item for the current user
   */
  async deleteItem(item_id: string): Promise<Types.DeleteItemResult> {
    if (!item_id) {
      __DEV__ && console.tron.log('missing item_id')
      return null
    }
    const response: ApiResponse<any> = await this.apisauce.delete(`/items/${item_id}.json`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawItem = response.data // expecting null
      return { kind: "ok", item: rawItem }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Set item_id on a port (i.e. user adds item to shelf)
   */
  async setPortItem(device_id: string, slot: number, item_id: string): Promise<Types.SetPortItemResult> {
    let data = {
      device_id: device_id,
      slot: slot,
      item_id: item_id,
    }
    const response: ApiResponse<any> = await this.apisauce.post(`${HTTP_FUNCTION_BASEURL}/setPortItem`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const rawPort = response.data // expected: {"item_id": "<item_id>", "status": "<status>", "weight_kg": "<weight_kg>"}
      const convertedPort = rawPort
      convertedPort.device_id = device_id
      convertedPort.slot = slot
      return { kind: "ok", port: rawPort }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Clear item_id on a port (i.e. user removes item from shelf)
   */
  async clearPortItem(device_id: string, slot: number): Promise<Types.ClearPortItemResult> {
    let data = {
      device_id: device_id,
      slot: slot,
    }
    // [eschwartz-TODO] Change method to DELETE
    const response: ApiResponse<any> = await this.apisauce.post(`${HTTP_FUNCTION_BASEURL}/clearPortItem`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const rawPort = response.data // expected: {"item_id": "", "status": "<status>", "weight_kg": "<weight_kg>"}
      const convertedPort = rawPort
      convertedPort.device_id = device_id
      convertedPort.slot = slot
      return { kind: "ok", port: convertedPort }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Update tare weight on an ItemDefinition
   */
  async updateTareWeight(item_definition_id: string, tare_weight_kg: number): Promise<Types.UpdateItemDefinitionResult> {
    let data = {
      item_definition_id: item_definition_id,
      tare_weight_kg: tare_weight_kg,
    }
    const response: ApiResponse<any> = await this.apisauce.put(`${HTTP_FUNCTION_BASEURL}/setItemDefinitionTareWeight`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const rawItemDefinition = response.data
      return { kind: "ok", item_definition: rawItemDefinition }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
