import { DeviceStoreModel, DeviceStore } from "./device-store"

test("can be created", () => {
  const instance: DeviceStore = DeviceStoreModel.create({})

  expect(instance).toBeTruthy()
})