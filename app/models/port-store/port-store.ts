import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { PortModel, PortSnapshot, Port } from "../port/port"
import { GetPortsResult } from "../../services/api"
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
      // create model instances from the plain objects

      // Expected structure from API or from Realtime Database update:
      // "-LxNyE47HCaN9ojmR3D2": {
      //   "0": {
      //     "status": "presentx",
      //     "weight_kg": 0.05069,
      //     "item_id": "-LymVh8HGJJ0RabGJ0Rj"
      //   }
      //   ...

      // flatten into array
      let result = []
      Object.keys(portSnapshots).map((device_id) => {
        let deviceData = portSnapshots[device_id]
        Object.keys(deviceData).map((slot) => {
          let portData = deviceData[slot]
          portData.device_id = device_id
          portData.slot = parseInt(slot)
          result.push(portData)
        })
      })
      // const convertedPorts: PortSnapshot[] = result.map(p => {
      //   return p
      // })



      const portsModels: Port[] = result.map(c => PortModel.create(c))
      console.log("portsModels: ", JSON.stringify(portsModels, null, 2))
      self.ports = portsModels
      //self.ports.replace(portsModels)
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
      console.log("port-store: updatePorts(): snapshot.val(): ", JSON.stringify(snapshot.val(), null, 2))
      console.log("port-store: updatePorts(): self.ports:", JSON.stringify(self.ports, null, 2))
      self.savePorts(snapshot.val())
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
