import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { ItemDefinitionModel, ItemDefinitionSnapshot, ItemDefinition } from "../item-definition/item-definition"
import { withEnvironment } from "../extensions"
import { GetItemDefinitionsResult, GetUpcDataResult } from "../../services/api"
/**
 * Model description here for TypeScript hints.
 */
export const ItemDefinitionStoreModel = types
  .model("ItemDefinitionStore")
  .props({
    itemDefinitions: types.optional(types.array(ItemDefinitionModel), []),
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    saveItemDefinitions: (itemDefinitionSnapshots: ItemDefinitionSnapshot[]) => {
      //console.log("item-definition-store: saveItemDefinitions(): itemDefinitionSnapshots: ", JSON.stringify(itemDefinitionSnapshots, null, 2))
      // create model instances from the plain objects
      const itemDefinitionModels: ItemDefinition[] = itemDefinitionSnapshots.map(c => ItemDefinitionModel.create(c))
      self.itemDefinitions.replace(itemDefinitionModels)
    },
  }))
  .actions(self => ({
    getItemDefinitions: flow(function*() {
      const result: GetItemDefinitionsResult = yield self.environment.api.getItemDefinitions()
      if (result.kind === "ok") {
        self.saveItemDefinitions(result.item_definitions)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    getUpcData: flow(function*(upc) {
      const result: GetUpcDataResult = yield self.environment.api.getUpcData(upc)
      if (result.kind === "ok") {
        return result.item_definition
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

type ItemDefinitionStoreType = Instance<typeof ItemDefinitionStoreModel>
export interface ItemDefinitionStore extends ItemDefinitionStoreType {}
type ItemDefinitionStoreSnapshotType = SnapshotOut<typeof ItemDefinitionStoreModel>
export interface ItemDefinitionStoreSnapshot extends ItemDefinitionStoreSnapshotType {}