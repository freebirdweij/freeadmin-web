import request from '@/utils/request'

export function getSupplys(params) {
  return request({
    url: 'api/storeSupply/search',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/storeSupply',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/storeSupply/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/storeSupply',
    method: 'put',
    data
  })
}

export default { add, edit, del, getSupplys }
