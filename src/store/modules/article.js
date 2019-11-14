import { createArticle,updateArticle } from '@/api/article'

const state = {
}

const mutations = {
}

const actions = {
  create({ commit }, postForm) {
    return new Promise((resolve, reject) => {
      createArticle(postForm).then(response => {
        const { data } = response
        resolve()
      }).catch(error => {
        console.log('error',error)
        reject(error)
      })
    })
  },
  update({ commit }, postForm) {
    console.log("postForm",postForm)
    return new Promise((resolve, reject) => {
      updateArticle(postForm).then(response => {
        const { data } = response
        resolve()
      }).catch(error => {
        console.log('error',error)
        reject(error)
      })
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
