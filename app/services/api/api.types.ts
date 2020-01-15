import { GeneralApiProblem } from "./api-problem"
import { DeviceSnapshot } from "../../models/device"
import { UserSnapshot } from "../../models/user"
import { ItemDefinitionSnapshot } from "../../models/item-definition"
import { ItemSnapshot } from "../../models/item"

export type GetItemsResult = { kind: "ok"; items: ItemSnapshot[] } | GeneralApiProblem
export type GetDevicesResult = { kind: "ok"; devices: DeviceSnapshot[] } | GeneralApiProblem
export type GetItemDefinitionsResult = { kind: "ok"; item_definitions: ItemDefinitionSnapshot[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: UserSnapshot } | GeneralApiProblem
export type GetUpcDataResult = { kind: "ok"; item_definition: ItemDefinitionSnapshot } | GeneralApiProblem
export type AddItemResult = { kind: "ok"; item: ItemSnapshot } | GeneralApiProblem
