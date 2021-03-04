import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/storeBuy',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/storeBuy/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/storeBuy',
    method: 'put',
    data
  })
}

export function inGoods(data) {
  return request({
    url: 'api/storeBuy/ingood',
    method: 'put',
    data
  })
}

export function outGoods(data) {
  return request({
    url: 'api/storeBuy/outgood',
    method: 'put',
    data
  })
}

export default { add, edit, del, inGoods, outGoods }
