import { ItemModel, Item } from "./item"

test("can be created", () => {
  const instance: Item = ItemModel.create({})

  expect(instance).toBeTruthy()
})