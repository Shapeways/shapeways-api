require 'json'
require_relative 'authorize.rb'

# model information
model_id = 1234567 #CHANGEME
 
# put request 
json_response = @accesstoken.put("/models/#{model_id}/info/v1", 
	{'isPublic': 1, 'isForSale': 1}.to_json, 
	{'Content-Type' => 'application/json'}
	)
model = JSON.parse(json_response.body)

puts JSON.pretty_generate(model)
