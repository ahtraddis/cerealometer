import { API_URL } from "react-native-dotenv"
import * as env from "../../environment-variables"

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
  url: env.API || "https://my-project-1518494092131.firebaseio.com",
  timeout: 10000,
}
