import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { DeviceModel, DeviceSnapshot, Device } from "../device/device"
import { withEnvironment } from "../extensions"
import { GetDevicesResult } from "../../services/api"

/**
 * Model description here for TypeScript hints.
 */
export const DeviceStoreModel = types
  .model("DeviceStore")
  .props({
    devices: types.optional(types.array(DeviceModel), []),
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    saveDevices: (deviceSnapshots: DeviceSnapshot[]) => {
      //console.log("deviceSnapshots: ", deviceSnapshots);
      // create model instances from the plain objects
      const deviceModels: Device[] = deviceSnapshots.map(c => DeviceModel.create(c)) 
      self.devices.replace(deviceModels) // Replace the existing data with the new data
      //console.log("self.devices: ", self.devices)
    },
  }))
  .actions(self => ({
    getDevices: flow(function*() {
      const result: GetDevicesResult = yield self.environment.api.getDevices()
      //console.log("getDevices: result: ", result)
      if (result.kind === "ok") {
        self.saveDevices(result.devices)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type DeviceStoreType = Instance<typeof DeviceStoreModel>
export interface DeviceStore extends DeviceStoreType {}
type DeviceStoreSnapshotType = SnapshotOut<typeof DeviceStoreModel>
export interface DeviceStoreSnapshot extends DeviceStoreSnapshotType {}
