#!/usr/bin/php
<?php

// NOTE - You must have special access to use this endpoint. Please request access from the Business Development Team here - https://www.shapeways.com/contact/contact-form

require "consumer_key.php";
require "access_token.php";
require "api_url_base.php";
require "error.php";

try {
    $oauth = new Oauth($consumer_key, $consumer_secret, OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_AUTHORIZATION);
    $oauth->enableDebug();
    $oauth->setToken($access_token, $access_secret);
} catch(OAuthException $E) {
  Error("setup exception", $E->getMessage(), null, null, $E->debugInfo, $E->getFile(), $E->getLine());
}

try {
    $orderId = 1234567; //CHANGEME

    $data = array(
        "orderProductId" => 1234567, //CHANGEME
        "reprintReasonId" => 503, //CHANGEME
        "reprintComment" => "This needs to be at least 10 chars", //CHANGEME
        "quantity" => 1, //CHANGEME
    );
    $data_string = json_encode($data);

    $oauth->fetch($api_url_base . "/orders/$orderId/reprint/v1", $data_string, OAUTH_HTTP_METHOD_POST, array("Accept" => "application/json", "Content-Type" => "application/json"));
    $response = $oauth->getLastResponse();
    $json = json_decode($response);

    if (null == $json) {
        PrintJsonLastError();
        var_dump($response);
    } else {
        print_r($json);
    }
} catch(OAuthException $E) {
    echo($E->lastResponse . "\n");
  Error("fetch exception", $E->getMessage(), $oauth->getLastResponse(), $oauth->getLastResponseInfo(), $E->debugInfo, $E->getFile(), $E->getLine());
}

?>

