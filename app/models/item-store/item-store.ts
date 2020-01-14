import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { ItemModel } from "../item/item"
import { withEnvironment } from "../extensions"
import { AddItemResult } from "../../services/api"
/**
 * Model description here for TypeScript hints.
 */
export const ItemStoreModel = types
  .model("ItemStore")
  .props({
    items: types.optional(types.array(ItemModel), []),
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    addItem: flow(function*(user_id, item_definition_id) {
      console.log(`item-store: addItem(): user_id = '${user_id}', item_definition_id = '${item_definition_id}'`, item_definition_id)
      const result: AddItemResult = yield self.environment.api.addItem(user_id, item_definition_id)
      if (result.kind === "ok") {
        return result.item
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type ItemStoreType = Instance<typeof ItemStoreModel>
export interface ItemStore extends ItemStoreType {}
type ItemStoreSnapshotType = SnapshotOut<typeof ItemStoreModel>
export interface ItemStoreSnapshot extends ItemStoreSnapshotType {}
