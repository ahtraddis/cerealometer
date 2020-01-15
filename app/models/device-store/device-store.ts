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
      //console.log("device-store: saveDevices(): deviceSnapshots:", JSON.stringify(deviceSnapshots, null, 2))
      // create model instances from the plain objects
      const deviceModels: Device[] = deviceSnapshots.map(c => DeviceModel.create(c))
      self.devices.replace(deviceModels) // Replace the existing data with the new data
      //console.log("device-store: saveDevices(): self.devices:", JSON.stringify(self.devices, null, 2))
    },
  }))
  .actions(self => ({
    getDevices: flow(function*(user_id: string) {
      const result: GetDevicesResult = yield self.environment.api.getDevices(user_id)
      //console.log("device-store: getDevices(): result:", JSON.stringify(result, null, 2))
      if (result.kind === "ok") {
        self.saveDevices(result.devices)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    updateDevice: flow(function*(device: DeviceSnapshot) {
      //console.log("device-store: updateDevices(): self.devices:", JSON.stringify(self.devices, null, 2))
      //console.log("device-store: updateDevices(): new device snapshot:", JSON.stringify(device, null, 2))
      // [eschwartz-TODO] Merge updated device into store
    }),
  }))
  //.actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

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
