import { API_URL } from "react-native-dotenv"
import * as env from "../../environment-variables"
import * as config from "../../config"

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: env.API || config.FIREBASE_BASEURL,
  timeout: 10000,
}

export const HTTP_FUNCTION_BASEURL: string = config.HTTP_FUNCTION_BASEURL
