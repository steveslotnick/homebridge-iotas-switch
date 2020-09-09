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
            "iotasUrl": "https://api.iotashome.com/api/v1",
            "name": "Desk entry light",
            "featureId": "1234",
            "username": "YOUR IOTAS USERNAME",
            "password": "YOUR IOTAS PASSWORD"
        }
    ]
```

# Finding your featureId

Use basic auth to authenticate at:
https://api.iotashome.com/api/v1/auth/tokenwithrefresh

From there, including your token as a header you can call the account/me endpoint to get your account id
curl --location --request GET 'http://api.iotashome.com/api/v1/account/me' \
--header 'Authorization: Bearer {your_token_here}'

Next use your account id to view your residency
curl --location --request GET 'http://api.iotashome.com/api/v1/account/{your_account_id}/residency' \
--header 'Authorization: Bearer {your_token_here}'

Next call the unit endpoint to view all available features
curl --location --request GET 'http://api.iotashome.com/api/v1/unit/{your_unit_id}/rooms' \
--header 'Authorization: Bearer {your_token_here}'

From there grab the feature id of any feature you want to turn on/off. The event type will need to be "On/Off".

# License
See LICENSE file
