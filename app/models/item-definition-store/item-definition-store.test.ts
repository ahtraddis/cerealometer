import { ItemDefinitionStoreModel, ItemDefinitionStore } from "./item-definition-store"

test("can be created", () => {
  const instance: ItemDefinitionStore = ItemDefinitionStoreModel.create({})

  expect(instance).toBeTruthy()
})