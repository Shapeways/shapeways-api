#!/usr/bin/php
<?php

require "consumer_key.php";
require "access_token.php";
require "api_url_base.php";
require "error.php";

try {
    $oauth = new Oauth($consumer_key, $consumer_secret, OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_AUTHORIZATION);
    $oauth->enableDebug();
    $oauth->setToken($access_token, $access_secret);
} catch(OAuthException $E) {
    Error("setup exception", $E->getMessage(), null, null, $E->debugInfo);
}

try {
    $filename = "cube-1cm3-centered_in_meter.stl";
    $file = file_get_contents("../models/". $filename);
    $data = array("fileName" => "$filename",
                  "file" => base64_encode($file),
                  "ownOrAuthorizedModel" => 1,
                  "acceptTermsAndConditions" => 1,
                  );
    $data_string = json_encode($data);
    $oauth->fetch($api_url_base ."/model/v1", $data_string, OAUTH_HTTP_METHOD_POST);
    $response = $oauth->getLastResponse();
    $json = json_decode($response);    
    if (null == $json) {
        PrintJsonLastError();
        var_dump($response);
    } else {
        print_r($json);
    }
} catch(OAuthException $E) {
    Error("fetch exception", $E->getMessage(), null, $oauth->getLastResponseInfo(), $E->debugInfo);
}

?>

