import axios from 'axios';
import OSS from 'ali-oss';
import moment from 'moment';
import env from '../config/env';
moment.locale('zh-cn');

let util = {};
util.title = function(title) {
  title = title ? title : 'ovo';
  window.document.title = title;
};

const ajaxUrl =
  env === 'development'
    ? 'http://localhost/api'
    : env === 'production' ? '/api' : '/api';

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000,
  withCredentials: true
});

util.formatDate = date => {
  return new moment(date).format('YYYY-MM-DD HH:mm:ss');
};

util.dateSort = (a, b, order) => {
  const am = new moment(a);
  const bm = new moment(b);
  return order === 'asc' ? am.unix() - bm.unix() : bm.unix() - am.unix();
};

util.getOSSClient = () =>
  new Promise(function(resolve, reject) {
    util.ajax
      .get('/token')
      .then(({ data }) => {
        resolve(new OSS.Wrapper(data));
      })
      .catch(err => reject(err));
  });

export default util;
