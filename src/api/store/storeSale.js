import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/storeSale',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/storeSale/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/storeSale',
    method: 'put',
    data
  })
}

export function takeGoods(data) {
  return request({
    url: 'api/storeSale/takegood',
    method: 'put',
    data
  })
}

export function refundGoods(data) {
  return request({
    url: 'api/storeSale/refundgood',
    method: 'put',
    data
  })
}

export default { add, edit, del, takeGoods, refundGoods }
