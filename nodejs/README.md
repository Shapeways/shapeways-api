shapeways-node
==============

Sample application for the new Shapeways API in NodeJS


## Installation

```
1) Download NodeJS - http://nodejs.org/
2) Download npm - http://nodejs.org/download/
3) Run `npm install` from the base directory to install necessary modules
```

## Configuration

This sample app allows you to set configuration variables in one of two ways. The variables made available can be see in `cfg/config.cofee` which will compile to `cfg/config.js`.

**Environment Variables (preferred)** - Node can easily read variables from your local environment, which allows you to securely set configuration variables like Consumer Key, etc locally rather than in the code.

In your *nix console:
```
Run export CALLBACK_URL = 'http://localhost:3000/callback'
```

**Configuration File** - The file `cfg/config.coffee` contains a number of variables that by default pull from your environment but also fall back to defaults specified in the file.

_Note: If you modify the configuration file you will need to recompile the coffee-script files into javascript by running `coffee -c .` in the base directory._


**Variables**
```
# Tokens from 'My Apps' on Shapeways
exports.CUSTOMER_KEY = process.env.CUSTOMER_KEY || '0c4d90e3d93a690d1287086d066eb64c4c15914f'
exports.CUSTOMER_SECRET = process.env.CUSTOMER_SECRET || '647939e8935d986413a83c6e428fd64fb7f668d5'

# Your App's Callback URL
exports.CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:3000/callback'
```


## Usage

```
1) Run `node app.js`
2) Load up http://localhost:3000/ in your browser to access the app (Note: must be connected to SW VPN)
```



## TODO
* Edit a model's information
* View a list of Materials
* Get pricing information for a model
* Add links to documentation