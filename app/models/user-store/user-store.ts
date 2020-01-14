import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { UserModel, UserSnapshot, User } from "../user/user"
import { withEnvironment } from "../extensions"
import { GetUserResult } from "../../services/api"

/**
 * Model description here for TypeScript hints.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    user: types.optional(UserModel, {}),
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    saveUser: (userSnapshot: UserSnapshot) => {
      //console.log("userSnapshot: ", userSnapshot);
      // create model instances from the plain objects
      const userModel: User = UserModel.create(userSnapshot)
      self.user = userModel
    },
  }))
  .actions(self => ({
    getUser: flow(function*(user_id) {
      const result: GetUserResult = yield self.environment.api.getUser(user_id)
      console.log(`getUser: result for user_id '${user_id}': `, result)
      if (result.kind === "ok") {
        self.saveUser(result.user)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  //.actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
