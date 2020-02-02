import { MessageModel, Message } from "./message"

test("can be created", () => {
  const instance: Message = MessageModel.create({})

  expect(instance).toBeTruthy()
})