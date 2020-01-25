import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { PortModel, PortSnapshot, Port } from "../port/port"
import { GetPortsResult, SetPortItemResult, ClearPortItemResult } from "../../services/api"
var _ = require('underscore');
import { withEnvironment } from "../extensions"

/**
 * Model description here for TypeScript hints.
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
      //console.log("port-store: savePorts(): portSnapshots:", JSON.stringify(portSnapshots, null, 2))

      // Expected structure from API or from Realtime Database update:
      // "-LxNyE47HCaN9ojmR3D2": {
      //   "0": {
      //     "status": "VACANT",
      //     "weight_kg": 0.05069,
      //     "item_id": "-LymVh8HGJJ0RabGJ0Rj"
      //   }
      //   ...

      // flatten into array, adding device_id and slot keys
      let result = []
      if (!_.isEmpty(portSnapshots)) {
        Object.keys(portSnapshots).map((device_id) => {
          let deviceData = portSnapshots[device_id]
          Object.keys(deviceData).map((slot) => {
            let portData = deviceData[slot]
            portData.device_id = device_id
            portData.slot = parseInt(slot)
            // On init of a new device, 'status' and 'item_id' will be momentarily
            // unpopulated before portCreated() cloud function runs. Fill them in
            // here to ensure valid models.
            if (!('status' in portData)) portData.status = 'UNKNOWN'
            if (!('item_id' in portData)) portData.item_id = ''
            result.push(portData)
          })
        })
      }
      const portsModels: Port[] = result.map(c => PortModel.create(c))
      self.ports = portsModels
    },
  }))
  .actions(self => ({
    getPorts: flow(function*(user_id: string) {
      // [eschwartz-TODO] Send user_id to getPorts() (retrieving all ports for now)
      const result: GetPortsResult = yield self.environment.api.getPorts()
      //console.log("port-store: getPorts(): result:", JSON.stringify(result, null, 2))
      if (result.kind === "ok") {
        self.savePorts(result.ports)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    updatePorts: flow(function*(snapshot) {
      //console.log("port-store: updatePorts(): snapshot.val(): ", JSON.stringify(snapshot.val(), null, 2))
      //console.log("port-store: updatePorts(): self.ports:", JSON.stringify(self.ports, null, 2))
      self.savePorts(snapshot.val())
    }),
  }))
  .actions(self => ({
    setPortItem: flow(function*(device_id: string, slot: number, item_id: string) {
      const result: SetPortItemResult = yield self.environment.api.setPortItem(device_id, slot, item_id)
      console.log("port-store: setPortItem(): result: ", JSON.stringify(result, null, 2))

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
      console.log("port-store: clearPortItem(): result: ", result)
      if (result.kind === "ok") {
        return result.port
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

type PortStoreType = Instance<typeof PortStoreModel>
export interface PortStore extends PortStoreType {}
type PortStoreSnapshotType = SnapshotOut<typeof PortStoreModel>
export interface PortStoreSnapshot extends PortStoreSnapshotType {}
