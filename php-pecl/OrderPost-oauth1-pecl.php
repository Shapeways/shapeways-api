#!/usr/bin/php
<?php

// NOTE - You must have special access to use this endoint. Please request access from the Business Development Team here - https://www.shapeways.com/contact/contact-form

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

     $items = array(
       array(
        'modelId' => 1234, // CHANGEME
        'materialId' => 95, // CHANGEME
        'quantity' => 1, 
        'productDimensionChoiceCombo' => 0
       )
    );

    $data = array(
      "firstName" => "John", // CHANGEME
      "lastName"  => "Doe", //CHANGEME
      "country"   => "United States", //CHEANGEME
      "state"     => "NY", //CHANGEME 
      "city"      => "New York", //CHANGEME
      "address1"  => "123 Street Name", //CHANGEME
      "address2"  => "Apt 1", //CHANGEME
      "address3"  => "Company Name", //CHANGEME
      "zipCode"   => "11111", //CHANGEME
      "phoneNumber" => "11111111111", //CHANGEME
      "items" => $items,
      "paymentVerificationId" => "ABCD", //CHANGEME - this id will be provided by Shapeways
      "paymentMethod" => "credit_card", 
      "shippingOption" => "Cheapest"
    );

    $data_string = json_encode($data);
    $oauth->fetch($api_url_base ."/orders/v1", $data_string, OAUTH_HTTP_METHOD_POST, array("Accept" => "application/json"));
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

