import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/articles',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: `/article/${id}`,
    method: 'get',
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: `/article/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: `/article/${id}`,
    method: 'delete'
  })
}

export function getCate() {
  return request({
    url: '/categories',
    method: 'get',
  })
}