import axios from 'axios';
import moment from 'moment';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title : 'ovo';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://localhost:3000' :
    env === 'production' ?
    '/api' :
    '/api';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

util.formatDate = (date) => {
  return new moment(date).format('YYYY-MM-DD HH:mm:ss');
};

util.dateSort = (a, b, order) => {
  const am = new moment(a);
  const bm = new moment(b);
  return order === 'asc' ? (am.unix() - bm.unix()) : (bm.unix() - am.unix());
};

export default util;