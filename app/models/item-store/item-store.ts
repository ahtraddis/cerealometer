import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { ItemModel, ItemSnapshot, Item } from "../item/item"
import { withEnvironment } from "../extensions"
import { AddItemResult, DeleteItemResult, GetItemsResult } from "../../services/api"
var _ = require('underscore');

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
    saveItems: (snapshots: ItemSnapshot[]) => {
      let result = []
      if (!_.isEmpty(snapshots)) {
        Object.keys(snapshots).map((item_id) => {
          let itemData = snapshots[item_id]
          itemData.id = item_id
          result.push(itemData)
        })
      }
      const sortedResult = result.slice().sort((a, b) => b.last_update_time - a.last_update_time)
      // create model instances from the plain objects
      const itemModels: Item[] = sortedResult.map(c => ItemModel.create(c))
      self.items.replace(itemModels)
    },
  }))
  .actions(self => ({
    getItems: flow(function*(user_id) {
      const result: GetItemsResult = yield self.environment.api.getItems(user_id)
      //console.tron.log(result)
      if (result.kind === "ok") {
        self.saveItems(result.items)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    updateItems: flow(function*(snapshot) {
      self.saveItems(snapshot.val())
    }),
  }))
  .actions(self => ({
    reset: flow(function*() {
      self.items = []
    }),
  }))
  .actions(self => ({
    addItem: flow(function*(user_id, item_definition_id, quantity) {
      const result: AddItemResult = yield self.environment.api.addItem(user_id, item_definition_id, quantity)
      if (result.kind === "ok") {
        return result.item
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    deleteItem: flow(function*(item_id) {
      const result: DeleteItemResult = yield self.environment.api.deleteItem(item_id)
      if (result.kind === "ok") {
        return result.item
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  
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
