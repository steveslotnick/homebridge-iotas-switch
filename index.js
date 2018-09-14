const request = require('request');
const url = require('url');
const axios = require('axios');

var Service, Characteristic;

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-light-iotas", "IotasSwitch", iotasSwitch);
};

iotasSwitch.prototype = {

  getServices: function () {
    console.log('getServices');
    const self = this;
    
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "My switch manufacturer")
      .setCharacteristic(Characteristic.Model, "My switch model")
      .setCharacteristic(Characteristic.SerialNumber, "123-456-789");
 
    let switchService = new Service.Switch(self.accessoryName);
    switchService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getSwitchOnCharacteristic.bind(this))
        .on('set', this.setSwitchOnCharacteristic.bind(this));
 
    this.informationService = informationService;
    this.switchService = switchService;

    console.log('authing');

    authenticate(self.iotasUrl, self.username, self.password).then((response) => {
      console.log('setting auth token');
      this.token = response.jwt;
      this.refreshToken = response.refresh;
    }).catch((error) => {
      console.error('error authenticating');
    });

    return [informationService, switchService];
  },

  getSwitchOnCharacteristic: function (next) {
    const self = this;
    console.log("request to query state");

    getFeature(self.iotasUrl, self.token, self.featureId).then((res) => {
      let value = res.value === 1;
      console.log('returning a value of: ' + value + ' for feature state');
      return next(null, value);
    }).catch((err) => {
      self.log('error turning on');
      self.log(err);
      return next(err);
    });
  },
   
  setSwitchOnCharacteristic: function (on, next) {
    const self = this;
    self.log('setting switch value to: ' + on);
    let value = on ? 1 : 0;
    updateFeature(self.iotasUrl, self.token, value, self.featureId).then((res) => {
      return next();
    }).catch((err) => {
      self.log('error turning on');
      self.log(err);
      return next(err);
    });
  }
};
 
function iotasSwitch(log, config) {
  this.log = log;
  this.iotasUrl = config.iotasUrl;
  this.accessoryName = config.name;
  this.featureId = config.featureId;
  this.username = config.username;
  this.password = config.password;
}

function updateFeature(iotasUrl, token, value, featureId) {
  let body = {
    value: value
  }
  let config = {
    baseURL: iotasUrl,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  return axios.put(`/feature/${featureId}`, body, config).then((response) => {
    return response.data;
  }).catch((error) => {
    console.log('error: ' + error);
  });
}

function getFeature(iotasUrl, token, featureId) {
  return axios.get(`/feature/${featureId}`, {
    baseURL: iotasUrl,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((response) => {
    console.log('successful get of feature state');
    return response.data;
  }).catch((error) => {
    console.log('error');
    console.log(error);
  });
}

function authenticate(iotasUrl, username, password) {
  let config = {
    baseURL: iotasUrl,
    auth: {
      username: username,
      password: password
    }
  }
  return axios.post(`/auth/tokenwithrefresh`, {}, config).then((response) => {
    console.log('authentication response');
    console.log(response);
    return response.data;
  }).catch((error) => {
    console.log('error: ');
    console.log(error);
  });
}
