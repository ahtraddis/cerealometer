import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { withEnvironment } from "../extensions"

/**
 * UserMetricsModel description
 */
export const UserMetricsModel = types
  .model("UserMetrics")
  .props({
      totalNetWeightKg: types.maybe(types.number),
      totalKg: types.maybe(types.number),
      itemCount: types.maybe(types.number),
      variety: types.maybe(types.number),
      quantity: types.maybe(types.number),
      favoritity: types.maybe(types.number),
      overall: types.maybe(types.number),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export const UserModel = types
  .model("User")
  .props({
    // defined by Firebase auth
    uid: types.maybe(types.string),
    phoneNumber: types.maybe(types.string),
    displayName: types.maybe(types.string),
    isAnonymous: types.maybe(types.boolean),
    email: types.maybe(types.string),
    emailVerified: types.maybe(types.boolean),
    providerId: types.maybe(types.string),
    photoURL: types.maybe(types.string),
    // custom
    isLoggedIn: types.maybe(types.boolean),
    name: types.maybe(types.string),
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
