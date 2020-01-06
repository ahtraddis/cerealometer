import { GeneralApiProblem } from "./api-problem"
import { DeviceSnapshot } from "../../models/device"

export type GetDevicesResult = { kind: "ok"; devices: DeviceSnapshot[] } | GeneralApiProblem