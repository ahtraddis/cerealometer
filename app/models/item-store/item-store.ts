import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { ItemModel, ItemSnapshot, Item } from "../item/item"
import { withEnvironment } from "../extensions"
import { AddItemResult, GetItemsResult } from "../../services/api"
import update from 'immutability-helper'
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
    saveItems: (itemSnapshots: ItemSnapshot[]) => {
      //console.log("item-store: saveItems(): itemSnapshots:", JSON.stringify(itemSnapshots, null, 2))
      // create model instances from the plain objects
      const itemModels: Item[] = itemSnapshots.map(c => ItemModel.create(c))
      self.items.replace(itemModels) // Replace the existing data with the new data
      //console.log("item-store: saveItems(): self.items:", JSON.stringify(self.items, null, 2))
    },
  }))
  .actions(self => ({
    getItems: flow(function*(user_id) {
      const result: GetItemsResult = yield self.environment.api.getItems(user_id)
      //console.log("item-store: getItems() result:", JSON.stringify(result, null, 2))
      if (result.kind === "ok") {
        self.saveItems(result.items)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    updateItems: flow(function*(snapshot) {
      //console.log("item-store: updateItems(): snapshot.val(): ", JSON.stringify(snapshot.val(), null, 2))
      //console.log("item-store: updateItems(): self.items:", JSON.stringify(self.items, null, 2))
      if (_.isEmpty(snapshot.val())) {
        self.items = []
      } else {
        Object.keys(snapshot.val()).map((key) => {
          console.log(`looking for key '${key}' in self.items`)
          var obj = snapshot.val()[key]
          obj.item_id = key

          let index = self.items.findIndex(i => (i.item_id == key))
          //let new_obj = update(self.items[index], {$merge: {}});
          //new_obj.item_id = key
          if (index != -1) {
            console.log("updating obj: ", obj)
            self.items[index] = obj
          } else {
            console.log("adding obj: ", obj)
            self.items.push(obj)
          }
        })
      }
      //console.log("item-store: updateItems(): itemStore:", JSON.stringify(self.items, null, 2))
    }),
  }))
  .actions(self => ({
    clearItems: flow(function*() {
      self.items = []
    }),
  }))
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
