import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { PortModel, PortSnapshot, Port } from "../port/port"
import { GetPortsResult, SetPortItemResult, ClearPortItemResult } from "../../services/api"
import { withEnvironment } from "../extensions"
var _ = require('underscore');

/**
 * PortStoreModel model description
 */
export const PortStoreModel = types
  .model("PortStore")
  .props({
    ports: types.optional(types.array(PortModel), []),
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    savePorts: (portSnapshots: PortSnapshot[]) => {
      // Expected structure from API or from Realtime Database update:
      // "-LxNyE47HCaN9ojmR3D2": {
      //   "data": {
      //     "0": {
      //       "item_id": "-LymVh8HGJJ0RabGJ0Rj",
      //       "last_update_time": 1580336911,
      //       "status": "VACANT",
      //       "weight_kg": 0.05069,
      //     },
      //     ...
      //   },
      //   "user_id": "1",
      // },
      // ...

      // Flatten into array, adding device_id and slot keys. Note that it's possible for an array element to be null if a port was deleted.
      let result = []
      if (!_.isEmpty(portSnapshots)) {
        Object.keys(portSnapshots).map((device_id) => {
          let deviceData = portSnapshots[device_id].data
          if (deviceData) {
            Object.keys(deviceData).map((slot) => {
              let portData = deviceData[slot]
              if (portData) {
                portData.device_id = device_id
                portData.slot = parseInt(slot)
                // On init of a new device, 'status', 'item_id', and 'last_update_time' will be momentarily
                // unpopulated before the portCreated() HTTP function runs. Populate them
                // here to ensure valid models.
                if (!('status' in portData)) portData.status = 'UNKNOWN'
                if (!('item_id' in portData)) portData.item_id = ''
                if (!('last_update_time' in portData)) portData.last_update_time = 0
                result.push(portData)
              }
            })
          }
        })
      }
      const portsModels: Port[] = result.map(c => PortModel.create(c))
      self.ports = portsModels
    },
  }))
  .actions(self => ({
    getPorts: flow(function*(user_id: string) {
      const result: GetPortsResult = yield self.environment.api.getPorts(user_id)
      if (result.kind === "ok") {
        self.savePorts(result.ports)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    updatePorts: flow(function*(snapshot) {
      self.savePorts(snapshot.val())
    }),
  }))
  .actions(self => ({
    setPortItem: flow(function*(device_id: string, slot: number, item_id: string) {
      const result: SetPortItemResult = yield self.environment.api.setPortItem(device_id, slot, item_id)
      if (result.kind === "ok") {
        return result.port
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    clearPortItem: flow(function*(device_id: string, slot: number) {
      const result: ClearPortItemResult = yield self.environment.api.clearPortItem(device_id, slot)
      if (result.kind === "ok") {
        return result.port
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    reset: () => {
      self.ports = []
    }
  }))

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type PortStoreType = Instance<typeof PortStoreModel>
export interface PortStore extends PortStoreType {}
type PortStoreSnapshotType = SnapshotOut<typeof PortStoreModel>
export interface PortStoreSnapshot extends PortStoreSnapshotType {}
