require 'rubygems'
require 'oauth'
require 'yaml'

# grab oauth creds from yaml files
consumer_keys = YAML.load_file('consumer_keys.yaml')
access_tokens = YAML.load_file('access_tokens.yaml')
api_url_base = YAML.load_file('api_url_base.yaml')

consumer_key = consumer_keys['consumer_key']
consumer_secret = consumer_keys['consumer_secret']

access_token = access_tokens['access_token']
access_secret = access_tokens['access_secret']
url = api_url_base['api_url_base']

# get oauth access token
@consumer = OAuth::Consumer.new(consumer_key, consumer_secret, {:site=>url})
@accesstoken = OAuth::AccessToken.new(@consumer, access_token, access_secret)
