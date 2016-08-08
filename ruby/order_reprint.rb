require 'bundler/setup'
Bundler.require
require_relative 'authorize.rb'

# NOTE - You must have special access to use this endpoint. Please request access from the Business Development Team here - https://www.shapeways.com/contact/contact-form

# order information
order_id = 1234567 #CHANGEME

# post request
json_response = @accesstoken.post("/orders/#{order_id}/reprint/v1",
	{
		'orderProductId' => 1234567, #CHANGEME
		'reprintReasonId' => 503, #CHANGEME
		'reprintComment' => 'This should be at least 10 characters', #CHANGEME
		'quantity' => 1 #CHANGEME
	}.to_json,
	{'Content-Type' => 'application/json'})
order = JSON.parse(json_response.body)

puts JSON.pretty_generate(order)
