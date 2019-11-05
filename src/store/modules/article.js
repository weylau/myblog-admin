import { createArticle } from '@/api/article'

const state = {
}

const mutations = {
}

const actions = {
  create({ commit }, postForm) {
    console.log('postForm',postForm)
    return new Promise((resolve, reject) => {
      createArticle(postForm).then(response => {
        const { data } = response
        console.log('article-create', data)
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
