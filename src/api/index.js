import request from '../utils/request';

export const getTopics = (params = {}) => {
  const defaultParams = {
    page: 1,
    tab: 'ask',
    limit: 10,
    mdrender: false
  };
  return request({
    method: 'get',
    url: '/topics',
    params: {
      ...defaultParams,
      ...params
    }
  });
};
