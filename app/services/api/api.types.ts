import { GeneralApiProblem } from "./api-problem"
import { DeviceSnapshot } from "../../models/device"
import { UserSnapshot } from "../../models/user"

export type GetDevicesResult = { kind: "ok"; devices: DeviceSnapshot[] } | GeneralApiProblem
export type GetItemDefinitionsResult = { kind: "ok"; item_definitions: ItemDefinitionSnapshot[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: UserSnapshot[] } | GeneralApiProblem