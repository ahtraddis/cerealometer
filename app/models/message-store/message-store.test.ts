import { MessageStoreModel, MessageStore } from "./message-store"

test("can be created", () => {
  const instance: MessageStore = MessageStoreModel.create({})

  expect(instance).toBeTruthy()
})