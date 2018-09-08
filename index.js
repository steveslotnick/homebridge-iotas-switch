var Service, Characteristic;
const request = require('request');
const url = require('url');
const axios = require('axios');

const token = "Bearer eyJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE1MzYzNjU3MDQsInN1YiI6IjU5IiwiZXhwIjoxNTM2MzY2NjA0fQ.s0EIPins02-wAtehALzBT9JFcWBedB66h0h30EutNXsiugijZUb185cfhpFkVBN3JoxohZaBWo9ehcESqJYgOw";
const featureId = "16185";

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
    const me = this;
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
    // console.log("me.featureId: ");
    // console.log(me.featureId);
    getFeature(me.iotasUrl, featureId).then((res) => {
      let value = res.value === 1;
      console.log('returning a value of: ' + value + ' for feature state');
      return next(null, value);
    }).catch((err) => {
      me.log('error turning on');
      me.log(err);
      return next(err);
    });
  },
   
  setSwitchOnCharacteristic: function (on, next) {
    const me = this;
    me.log('setting switch value to: ' + on);
    let value = on ? 1 : 0;
    updateFeature(me.baseUrl, value, featureId).then((res) => {
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
  // this.iotasUrl = url.parse(config['iotasUrl']);
}

function updateFeature(iotasUrl, value, featureId) {
  let body = {
    value: value
  }
  let config = {
    baseURL: "https://staging-api.iotashome.com/v1/api",
    headers: {
      Authorization: token
    }
  }
  return axios.put(`/feature/${featureId}`, body, config).then((response) => {
    return response.data;
  }).catch((error) => {
    console.log('error: ' + error);
  });
}

function getFeature(iotasUrl, featureId) {
  return axios.get(`/feature/${featureId}`, {
    baseURL: "https://staging-api.iotashome.com/v1/api",
    headers: {
      Authorization: token
    }
  }).then((response) => {
    console.log('successful get of feature state');
    return response.data;
  }).catch((error) => {
    console.log('error: ' + error);
  });
}