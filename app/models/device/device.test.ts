import { DeviceModel, Device } from "./device"

test("can be created", () => {
  const instance: Device = DeviceModel.create({})

  expect(instance).toBeTruthy()
})