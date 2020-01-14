import { ItemStoreModel, ItemStore } from "./item-store"

test("can be created", () => {
  const instance: ItemStore = ItemStoreModel.create({})

  expect(instance).toBeTruthy()
})