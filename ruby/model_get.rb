require 'rubygems'
require 'json'
require_relative 'authorize.rb'

# model information
model_id = 1234567 #CHANGEME

# get request
json_response = @accesstoken.get("/models/#{model_id}/info/v1")
model = JSON.parse(json_response.body)

puts JSON.pretty_generate(model)