import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { MessageModel, MessageSnapshot, Message } from "../message/message"
import { withEnvironment } from "../extensions"
import { GetMessagesResult, DeleteMessageResult } from "../../services/api"
var _ = require('underscore');
import database from '@react-native-firebase/database'

/**
 * Model description here for TypeScript hints.
 */
export const MessageStoreModel = types
  .model("MessageStore")
  .props({
    messages: types.optional(types.array(MessageModel), []),
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    saveMessages: (snapshots: MessageSnapshot[]) => {
      // Expected structure from API or from Realtime Database update:
      //
      // "-LzybI3XC4stZQN9KGL6": {
      //   "create_time": 1580627644,
      //   "image_url": "<url>",
      //   "message": "Current danger level is 57%.",
      //   "title": "Level Chex"
      // }, ...

      // Flatten into array and add key to each element
      let result = []
      if (!_.isEmpty(snapshots)) {
        Object.keys(snapshots).map((message_id) => {
          if (snapshots[message_id]) {
            let messageData = snapshots[message_id]
            if (messageData) {
              messageData.id = message_id
            }
            result.push(messageData)
          }
        })
      }
      const sortedResult = result.slice().sort((a, b) => b.create_time - a.create_time)
      const messageModels: Message[] = sortedResult.map(c => MessageModel.create(c))
      self.messages = messageModels
    },
  }))
  .actions(self => ({
    getMessages: flow(function*(user_id: string) {
      const result: GetMessagesResult = yield self.environment.api.getMessages(user_id)
      if (result.kind === "ok") {
        self.saveMessages(result.messages)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    updateMessages: flow(function*(snapshot) {
      self.saveMessages(snapshot.val())
    }),
  }))
  .actions(self => ({
    deleteMessage: flow(function*(user_id: string, id: string) {
      const messageRef = database().ref(`/messages/${user_id}/${id}`).remove()
    }),
  }))
  .actions(self => ({
    reset: flow(function*() {
      self.messages = []
    }),
  }))

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type MessageStoreType = Instance<typeof MessageStoreModel>
export interface MessageStore extends MessageStoreType {}
type MessageStoreSnapshotType = SnapshotOut<typeof MessageStoreModel>
export interface MessageStoreSnapshot extends MessageStoreSnapshotType {}
