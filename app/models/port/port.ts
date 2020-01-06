import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const PortModel = types
  .model("Port")
  .props({
    //id: types.identifier,
    slot: types.integer,
    item: types.string,
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

type PortType = Instance<typeof PortModel>
export interface Port extends PortType {}
type PortSnapshotType = SnapshotOut<typeof PortModel>
export interface PortSnapshot extends PortSnapshotType {}
