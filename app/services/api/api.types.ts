import { GeneralApiProblem } from "./api-problem"
import { DeviceSnapshot } from "../../models/device"
import { UserSnapshot } from "../../models/user"
import { PortSnapshot } from "../../models/port"
import { ItemDefinitionSnapshot } from "../../models/item-definition"
import { ItemSnapshot } from "../../models/item"
import { MessageSnapshot } from "../../models/message"

export type GetItemsResult = { kind: "ok"; items: ItemSnapshot[] } | GeneralApiProblem
export type GetDevicesResult = { kind: "ok"; devices: DeviceSnapshot[] } | GeneralApiProblem
export type AddDeviceResult = { kind: "ok"; device: DeviceSnapshot[] } | GeneralApiProblem
export type GetPortsResult = { kind: "ok"; ports: PortSnapshot[] } | GeneralApiProblem
export type SetPortItemResult = { kind: "ok"; port: PortSnapshot } | GeneralApiProblem
export type ClearPortItemResult = { kind: "ok"; port: PortSnapshot } | GeneralApiProblem
export type GetItemDefinitionsResult = { kind: "ok"; item_definitions: ItemDefinitionSnapshot[] } | GeneralApiProblem
export type UpdateItemDefinitionResult = { kind: "ok"; item_definition: ItemDefinitionSnapshot } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: UserSnapshot } | GeneralApiProblem
export type GetUpcDataResult = { kind: "ok"; item_definition: ItemDefinitionSnapshot } | GeneralApiProblem
export type AddItemResult = { kind: "ok"; item: ItemSnapshot } | GeneralApiProblem
export type DeleteItemResult = { kind: "ok"; item: ItemSnapshot } | GeneralApiProblem
export type GetMessagesResult = { kind: "ok"; messages: MessageSnapshot[] } | GeneralApiProblem
export type DeleteMessageResult = { kind: "ok" } | GeneralApiProblem