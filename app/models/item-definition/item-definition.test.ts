import { ItemDefinitionModel, ItemDefinition } from "./item-definition"

test("can be created", () => {
  const instance: ItemDefinition = ItemDefinitionModel.create({})

  expect(instance).toBeTruthy()
})