import request from '@/utils/request'

export function login(data) {
  console.log('login_data',data)
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
