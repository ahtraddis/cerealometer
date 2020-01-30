import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { UserModel, UserSnapshot, User, UserMetricsModel } from "../user/user"
import { withEnvironment } from "../extensions"
import { GetUserResult } from "../../services/api"
import * as env from "../../environment-variables"

/**
 * UserStoreModel description
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
      const userModel: User = UserModel.create(userSnapshot)
      self.user = userModel
      //__DEV__ && console.tron.log(userModel)
    },
  }))
  .actions(self => ({
    getUser: flow(function*(user_id) {
      const result: GetUserResult = yield self.environment.api.getUser(user_id)
      if (result.kind === "ok") {
        self.saveUser(result.user)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
  .actions(self => ({
    setUser: flow(function*(user) {
      //__DEV__ && console.tron.log(user)
      self.user = UserModel.create({
        // [eschwartz-TODO] Hardcoded user id
        id: env.HARDCODED_TEST_USER_ID,
        name: user.name,
        metrics: UserMetricsModel.create(user.metrics),
        email: user.email,
      })
    }),
  }))
  .actions(self => ({
    reset: flow(function*() {
      self.user = {}
    })
  }))
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
