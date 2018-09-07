var Service, Characteristic;
const request = require('request');
const url = require('url');
const axios = require('axios');

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-light-iotas", "MyAwesomeSwitch", mySwitch);
};

mySwitch.prototype = {
  getServices: function () {
    console.log('here!');
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "My switch manufacturer")
      .setCharacteristic(Characteristic.Model, "My switch model")
      .setCharacteristic(Characteristic.SerialNumber, "123-456-789");
      // .setCharacteristic(Characteristic.DisplayName, "MyCoolSwitch");;
 
    let switchService = new Service.Switch("My switch");
    switchService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getSwitchOnCharacteristic.bind(this))
        .on('set', this.setSwitchOnCharacteristic.bind(this));
 
    this.informationService = informationService;
    this.switchService = switchService;
    return [informationService, switchService];
  },

  getSwitchOnCharacteristic: function (next) {
    // const me = this;
    // request({
    //     url: me.getUrl,
    //     method: 'GET',
    // }, 
    // function (error, response, body) {
    //   if (error) {
    //     me.log('STATUS: ' + response.statusCode);
    //     me.log(error.message);
    //     return next(error);
    //   }
    //   return next(null, body.currentState);
    // });
    console.log("query state");
    return next(null, 0);
  },
   
  setSwitchOnCharacteristic: function (on, next) {
    const me = this;
    me.log('value: ' + on);
    let value = on ? 1 : 0;
    me.log("turning on");
    updateFeature(value).then((res) => {
      return next();
    }).catch((err) => {
      me.log('error turning on');
      me.log(err);
      return next(err);
    });
  }
};
 
function mySwitch(log, config) {
  this.log = log;
  this.getUrl = url.parse(config['getUrl']);
  this.postUrl = url.parse(config['postUrl']);
}

function updateFeature(value) {
  let body = {
    value: value
  }
  let config = {
    baseURL: "https://staging-api.iotashome.com/v1/api",
    headers: {
      Authorization: "Bearer eyJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE1MzYzNjMwOTYsInN1YiI6IjU5IiwiZXhwIjoxNTM2MzYzOTk2fQ.lUZVtexqa80vcj3Wk8T9QeJhu5Rdr2KzSvCFNolZ14HdYJjxQ__g0h2qOZEZIQK8ob4ufv-1ftT9YgdeZtj2EA"
    }
  }
  return axios.put(`/feature/16185`, body, config).then((response) => {
    return response.data;
  }).catch((error) => {
    processError('updateFeature()', error);
  });
}