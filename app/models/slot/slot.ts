import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const SlotModel = types
  .model("Slot")
  .props({
    id: types.identifier,
    name: types.maybe(types.string),
    status: types.string,
    weight_kg: types.float,
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type SlotType = Instance<typeof SlotModel>
export interface Slot extends SlotType {}
type SlotSnapshotType = SnapshotOut<typeof SlotModel>
export interface SlotSnapshot extends SlotSnapshotType {}
