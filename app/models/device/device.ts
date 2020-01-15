import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions"

/**
 * Model description here for TypeScript hints.
 */
export const DeviceModel = types
  .model("Device")
  .props({
    device_id: types.string, // key
    led_state: types.integer,
    name: types.maybe(types.string),
    port_count: types.integer,
    user_id: types.string,
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type DeviceType = Instance<typeof DeviceModel>
export interface Device extends DeviceType {}
type DeviceSnapshotType = SnapshotOut<typeof DeviceModel>
export interface DeviceSnapshot extends DeviceSnapshotType {}
