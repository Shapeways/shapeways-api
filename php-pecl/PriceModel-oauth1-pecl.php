#!/usr/bin/php
<?php

require "consumer_key.php";
require "access_token.php";
require "api_url_base.php";
require "error.php";
$verbose_debug = false;

try {
    $oauth = new Oauth($consumer_key, $consumer_secret, OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_AUTHORIZATION);
    $oauth->enableDebug();
    $oauth->setToken($access_token, $access_secret);
} catch(OAuthException $E) {
    Error("setup exception", $E->getMessage(), null, null, $E->debugInfo);
}

try {
    $volume = 1 / (100*100*100); # 1 cm^3 in m^2
    $area = 600 / (1000*1000); # 600 mm^2 (6 cm^2) in m^2
    $xBoundMin = 0;
    $yBoundMin = 0;
    $zBoundMin = 0;
    $xBoundMax = 0.01; # 1 cm in m
    $yBoundMax = 0.01;
    $zBoundMax = 0.01;
    $data = array("volume" => "$volume",
                  "area" => $area,
                  "xBoundMin" => $xBoundMin,
                  "xBoundMax" => $xBoundMax,
                  "yBoundMin" => $yBoundMin,
                  "yBoundMax" => $yBoundMax,
                  "zBoundMin" => $zBoundMin,
                  "zBoundMax" => $zBoundMax,
                  );
    $data_string = json_encode($data);

    $oauth->fetch($api_url_base ."/price/v1", $data_string, OAUTH_HTTP_METHOD_POST, array("Accept" => "application/json"));
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

