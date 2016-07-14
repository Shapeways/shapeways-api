require 'json'
require_relative 'authorize.rb'

# model information
model_id = 1234567 #CHANGEME
model_version = 0 #CHANGEME

# get request
json_response = @accesstoken.get("/models/#{model_id}/files/#{model_version}/v1?file=1")
model = JSON.parse(json_response.body)

puts JSON.pretty_generate(model)
