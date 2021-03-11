import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/storeModify',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/storeModify/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/storeModify',
    method: 'put',
    data
  })
}

export function moveGoods(data) {
  return request({
    url: 'api/storeModify/movegood',
    method: 'put',
    data
  })
}

export function modifyGoods(data) {
  return request({
    url: 'api/storeModify/modifygood',
    method: 'put',
    data
  })
}

export default { add, edit, del, moveGoods, modifyGoods }
