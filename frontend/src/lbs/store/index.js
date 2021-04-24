import * as mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

export const lbs = {
  namespaced: true,
  state: () => ({
    tabUrl: ''
  }),
  mutations,
  actions,
  getters
}
