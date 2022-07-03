import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { DeviceModel, DeviceSnapshot, Device } from "../device/device"
import { withEnvironment } from "../extensions"
import { GetDevicesResult, AddDeviceResult } from "../../services/api"
import update from 'immutability-helper';

/**
 * DeviceStoreModel description
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
      const deviceModels: Device[] = deviceSnapshots.map(c => DeviceModel.create(c))
      self.devices.replace(deviceModels)
    },
  }))
  .actions(self => ({
    getDevices: flow(function*(user_id: string) {
      const result: GetDevicesResult = yield self.environment.api.getDevices(user_id)
      if (result.kind === "ok") {
        self.saveDevices(result.devices)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    updateDevice: flow(function*(in_device_id: string, snapshot: DeviceSnapshot) {
      // if snapshot is null, device has been deleted
      // find element index in store (whether updating or deleting)
      const index = self.devices.findIndex(device => device.id == in_device_id)
      if (snapshot != null) {
        const new_snapshot = update(snapshot, {$merge: {}});
        new_snapshot['id'] = in_device_id
        self.devices[index] = new_snapshot
      } else {
        // remove deleted device
        self.devices.splice(index, 1)
      }
    }),
  }))
  .actions(self => ({
    addDevice: flow(function*(user_id: string) {
      const result: AddDeviceResult = yield self.environment.api.addDevice(user_id)
      if (result.kind === "ok") {
        self.getDevices(user_id)
        return result.device
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    reset: () => {
      self.devices = []
    }
  }))

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
