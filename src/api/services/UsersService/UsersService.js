import BaseService from '../BaseService/BaseService'

import User from '../../models/UserModel/UserModel'

export default class UsersService extends BaseService {
  get resource() {
    return 'users'
  }

  get Model() {
    return User
  }

  resolveResponse = ({ data }, { resource = this.resource, Model = this.Model } = {}) => {
    const list = data.data

    // paginated results
    if (Array.isArray(list)) {
      // eslint-disable-next-line camelcase
      const { page, total_pages, total } = data
      return {
        [resource]: this.resolveItemList({ list, Model }),
        page,
        pages: total_pages,
        total,
      }
    }

    return Array.isArray(data)
      ? { [resource]: this.resolveItemList({ list: data, Model }) }
      : this.resolveItem({ item: data, Model })
  }
}
