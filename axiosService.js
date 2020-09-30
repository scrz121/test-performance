const axios = require('axios');

class AxiosService {
  constructor() {
    const instance = axios.create({
      baseURL: "http://localhost:3000"
    });
    instance.interceptors.request.use(this.handleRequest);
    instance.interceptors.response.use(this.handleSuccess, this.handleError);
    this.instance = instance;
  }

  handleRequest = config => {
    config.meta = config.meta || {};
    config.meta.requestStartedAt = new Date().getTime();
    return config;
  };

  handleSuccess = response => {
    response.config.meta.responseTime = new Date().getTime() - response.config.meta.requestStartedAt;
    return response;
  };

  handleError = error => {
    // console.log(`Execution time for: ${error.config.url} - ${ new Date().getTime() - error.config.meta.requestStartedAt} ms`);
    return Promise.reject(error);
  };

  get(url, body) {
    return this.instance.get(url, body);
  }

  post(url, body) {
    return this.instance.post(url, body);
  }
}

module.exports = new AxiosService();
