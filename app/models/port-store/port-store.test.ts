import { PortStoreModel, PortStore } from "./port-store"

test("can be created", () => {
  const instance: PortStore = PortStoreModel.create({})

  expect(instance).toBeTruthy()
})