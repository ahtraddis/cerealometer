import { PortStoreModel } from "../../models/port-store"
import { ItemStoreModel } from "../../models/item-store"
import { UserStoreModel } from "../../models/user-store"
import { ItemDefinitionStoreModel } from "../../models/item-definition-store"
import { DeviceStoreModel } from "../../models/device-store"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { NavigationStoreModel } from "../../navigation/navigation-store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  portStore: types.optional(PortStoreModel, {}),
  itemStore: types.optional(ItemStoreModel, {}),
  userStore: types.optional(UserStoreModel, {}),
  itemDefinitionStore: types.optional(ItemDefinitionStoreModel, {}),
  deviceStore: types.optional(DeviceStoreModel, {}),
  navigationStore: types.optional(NavigationStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
