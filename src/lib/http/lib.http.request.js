import axios from 'axios';

export default async(link, method, data, path, headers = {}, query) => axios({
  method, url: `${link}${path}`, data, headers, query,
});