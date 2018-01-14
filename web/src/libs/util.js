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
    '/api' :
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

export default util;