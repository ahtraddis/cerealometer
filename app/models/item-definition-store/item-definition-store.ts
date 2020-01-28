import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { ItemDefinitionModel, ItemDefinitionSnapshot, ItemDefinition } from "../item-definition/item-definition"
import { withEnvironment } from "../extensions"
import { GetItemDefinitionsResult, UpdateItemDefinitionResult, GetUpcDataResult } from "../../services/api"

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
    clearItemDefinitions: flow(function*() {
      self.itemDefinitions = []
    }),
  }))
  .actions(self => ({
    getUpcData: flow(function*(upc) {
      // First check local store for cached item def, otherwise fetch it
      const itemdef = self.itemDefinitions.find((itemdef) => (itemdef.upc == upc))
      if (itemdef) {
        console.log("item-definition-store: getUpcData(): returning cached result:", JSON.stringify(itemdef, null, 2))
        return itemdef
      }
      const result: GetUpcDataResult = yield self.environment.api.getUpcData(upc)
      console.log("item-definition-store: getUpcData(): result:", JSON.stringify(result, null, 2))
      if (result.kind === "ok") {
        return result.item_definition
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    updateTareWeight: flow(function*(itemDefinitionId, tareWeightKg) {
      const result: UpdateItemDefinitionResult = yield self.environment.api.updateTareWeight(itemDefinitionId, tareWeightKg)
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
