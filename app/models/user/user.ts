import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { withEnvironment } from "../extensions"

/**
 * Model description here for TypeScript hints.
 */

export const UserModel = types
  .model("User")
  .props({
    user_id: types.maybe(types.string), // key
    name: types.maybe(types.string),
    email: types.maybe(types.string),
    meter: types.maybe(types.number)
    // [eschwartz-TODO] not sure how to do this for devices yet!
    //devices: types.optional(types.map(<map of key-value pairs>) {}),
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
