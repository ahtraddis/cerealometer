import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions"

/**
 * Model description here for TypeScript hints.
 */
export const ItemDefinitionModel = types
  .model("ItemDefinition")
  .props({
    item_definition_id: types.string, // key
    brand: types.string,
    description: types.string,
    image_url: types.string,
    name: types.string,
    upc: types.string,
    weight_grams: types.integer,
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

type ItemDefinitionType = Instance<typeof ItemDefinitionModel>
export interface ItemDefinition extends ItemDefinitionType {}
type ItemDefinitionSnapshotType = SnapshotOut<typeof ItemDefinitionModel>
export interface ItemDefinitionSnapshot extends ItemDefinitionSnapshotType {}
