import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
//import uuid from "react-native-uuid"

const API_PAGE_SIZE = 1

const convertDevice = (raw: any): DeviceSnapshot => {
  console.log("raw.name: ", raw.name, "raw.id: ", raw.id);
  //const id = uuid.v1()
  return {
    //id: raw.id,
    name: raw.name,
    led_state: raw.led_state,
    slots: raw.slots,
  }
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
   * Gets a list of users.
   */
  async getUsers(): Promise<Types.GetUsersResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertUser = raw => {
      return {
        id: raw.id,
        name: raw.name,
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawUsers = response.data
      const resultUsers: Types.User[] = rawUsers.map(convertUser)
      return { kind: "ok", users: resultUsers }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a single user by ID
   */

  async getUser(id: string): Promise<Types.GetUserResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: Types.User = {
        id: response.data.id,
        name: response.data.name,
      }
      return { kind: "ok", user: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a list of devices
   */
  async getDevices(): Promise<Types.GetDevicesResult> {
    // make the api call
    //const response: ApiResponse<any> = await this.apisauce.get("", { amount: API_PAGE_SIZE })
    const response: ApiResponse<any> = await this.apisauce.get("", {})
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawDevices = response.data
      
      console.log("rawDevices: ", rawDevices)


      
      /*const convertedDevices: DeviceSnapshot[] = Object.keys(rawDevices).forEach(function(key) {
        convertDevice(rawDevices[key])
      })*/

      const result = [
        {
          name: "Device 11",
          id: "1",
          led_state: 0, 
          slots: [
            {
              //id: "1",
              name: "Slot 1",
              status: "vacant",
              weight_kg: 0.2
            }
          ]
        },
        {
          name: "Device 2",
          id: "2",
          led_state: 1,
          slots: [
            {
              name: "Slot 1",
              status: "vacant",
              weight_kg: 0.4
            }
          ]
        }
      ];
      console.log("result: ", JSON.stringify(result))
      

      return { kind: "ok", devices: result }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

}
