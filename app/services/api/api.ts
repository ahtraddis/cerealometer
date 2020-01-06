import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import { DeviceSnapshot } from "../../models/device"
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
    //console.log("api: getting devices...")
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get("/devices.json", { amount: API_PAGE_SIZE })
    //console.log("response: ", response);
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
        var result = rawDevices[s]
        result.id = uuid()
        result.device_id = s
        return result
      })
      //console.log("convertedDevices: ", JSON.stringify(convertedDevices))
      return { kind: "ok", devices: convertedDevices }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

}
