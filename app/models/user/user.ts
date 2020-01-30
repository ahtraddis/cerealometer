import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { DeviceModel } from "../device/device"
import { withEnvironment } from "../extensions"

/**
 * Model description here for TypeScript hints.
 */

export const UserMetricsModel = types
  .model("UserMetrics")
  .props({
      totalNetWeightKg: types.maybe(types.number),
      totalKg: types.maybe(types.number),
      overallPercentage: types.maybe(types.number),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

//const map = types.map(types.string, types.boolean)

export const UserModel = types
  .model("User")
  .props({
    id: types.maybe(types.string),
    name: types.maybe(types.string),
    email: types.maybe(types.string),
    metrics: types.maybe(UserMetricsModel),
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

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}

type UserMetricsType = Instance<typeof UserMetricsModel>
export interface UserMetrics extends UserMetricsType {}
