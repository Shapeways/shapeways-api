require 'json'
require 'base64'
require 'uri'
require_relative 'authorize.rb'

# file information
file_name = 'cube-1cm3-centered_in_meter.stl' #CHANGEME
file = File.read('../models/' + file_name) #CHANGEME

# post request
json_response = @accesstoken.post('/models/v1',
	{'fileName' => file_name, 'file' => URI.escape(Base64.encode64(file), Regexp.new('[^#{URI::PATTERN::UNRESERVED}]')), 'hasRightsToModel' => 1, 'acceptTermsAndConditions' => 1}.to_json,
	{'Content-Type' => 'application/json'})
model = JSON.parse(json_response.body)

puts JSON.pretty_generate(model)
