# homebridge-iotas-switch

IOTAS Home plugin for the [Homebridge](https://github.com/nfarina/homebridge) project.

## Currently supports
- Switch
- Outlet

# Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-iotas-switch`
3. Update your configuration file. See the sample below.

# Configuration

Configuration sample:

 ```javascript
    "accessories": [
        {
            "accessory": "IotasSwitch",
            "iotasUrl": "https://api.iotashome.com/v1/api",
            "name": "Desk entry light",
            "featureId": "1234",
            "username": "YOUR IOTAS USERNAME",
            "password": "YOUR IOTAS PASSWORD"
        }
    ]
```
