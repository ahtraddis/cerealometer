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
      // create model instances from the plain objects
      const itemDefinitionModels: ItemDefinition[] = itemDefinitionSnapshots.map(c => ItemDefinitionModel.create(c))
      self.itemDefinitions.replace(itemDefinitionModels)
    },
  }))
  .actions(self => ({
    saveItemDefinition: (itemDefinitionSnapshot: ItemDefinitionSnapshot) => {
      const itemDefinitionModel: ItemDefinition = ItemDefinitionModel.create(itemDefinitionSnapshot)
      const index = self.itemDefinitions.findIndex((itemdef) => (itemdef.id == itemDefinitionModel.id))
      if (index != -1) {
        //__DEV__ && console.tron.log("found itemDefinitionModel at index ", index)
        self.itemDefinitions[index] = itemDefinitionModel
      } else {
        //__DEV__ && console.tron.log("adding itemDefinitionModel")
        self.itemDefinitions.push(itemDefinitionModel)
      }
    },
  }))
  .actions(self => ({
    getItemDefinitions: flow(function*(user_id: string) {
      const result: GetItemDefinitionsResult = yield self.environment.api.getItemDefinitions(user_id)
      if (result.kind === "ok") {
        self.saveItemDefinitions(result.item_definitions)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    reset: flow(function*() {
      self.itemDefinitions = []
    }),
  }))
  .actions(self => ({
    getUpcData: flow(function*(upc) {
      // First check store for cached item def, otherwise fetch it.
      // If not found, cloud function will query UPC database and create a new item def.
      const storedItemDef = self.itemDefinitions.find((itemdef) => (itemdef.upc == upc))
      if (storedItemDef) return storedItemDef

      const result: GetUpcDataResult = yield self.environment.api.getUpcData(upc)
      if (result.kind === "ok") {
        self.saveItemDefinition(result.item_definition)
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
