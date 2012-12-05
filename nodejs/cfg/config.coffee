### Configuration file - Set your Shapeways/App specific variables here ###

# Shapways API Version and server
exports.API_VERSION = process.env.API_VERSION || 'v1'
exports.API_SERVER = process.env.API_SERVER || 'api.shapeways.com'

# Shapeways OAuth URLs
exports.REQUEST_TOKEN_URL = process.env.REQUEST_TOKEN_URL || "http://#{@API_SERVER}/oauth1/request_token/#{@API_VERSION}"
exports.ACCESS_TOKEN_URL = process.env.ACCESS_TOKEN_URL || "http://#{@API_SERVER}/oauth1/access_token/#{@API_VERSION}"

# Tokens from 'My Apps' on Shapeways
exports.CUSTOMER_KEY = process.env.CUSTOMER_KEY || '2c74e97709ac200da02222036df4ec3c5997ba51'
exports.CUSTOMER_SECRET = process.env.CUSTOMER_SECRET || 'dc9bce571e5953db857356240b5e9778c641bd3e'

# Your App's Callback URL
exports.CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:3000/callback'