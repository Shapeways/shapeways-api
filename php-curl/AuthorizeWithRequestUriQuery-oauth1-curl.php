#!/usr/bin/php
<?php

require "../php-pecl/consumer_key.php";
require "../php-pecl/api_url_base.php";
require "../php-pecl/error.php";

function buildBaseString($baseURI, $method, $params) {
    $r = array();
    ksort($params);
    foreach($params as $consumer_key=>$value){
        $r[] = "$consumer_key=" . rawurlencode($value);
    }
    return $method .'&'. rawurlencode($baseURI) .'&'. rawurlencode(implode('&', $r));
}

function buildAuthorizationHeader($oauth) {
    $r = 'Authorization: OAuth ';
    $values = array();
    foreach($oauth as $consumer_key=>$value)
        $values[] = "$consumer_key=\"" . rawurlencode($value) . "\"";
    $r .= implode(', ', $values);
    return $r;
}

# Use http://tools.ietf.org/html/rfc5849#section-3.5.3

echo "Using consumer key :\n";
echo "Consumer Key         : ".$consumer_key."\n";
echo "Consumer Key  secret : ".$consumer_secret."\n";
echo "To request a temporary request token.\n";
echo "\n";

# Get a request token
$link = "/oauth1/request_token/v1";
$timestamp = time();
$signature_method="HMAC-SHA1";
$oauth = array(
    'oauth_consumer_key' => $consumer_key,
    'oauth_nonce' => time(),
    'oauth_signature_method' => $signature_method,
    'oauth_timestamp' => $timestamp,
    'oauth_version' => '1.0',
    );
$url = $api_url_base . $link;
$base_info = buildBaseString($url, 'GET', $oauth);
$composite_key = rawurlencode($consumer_secret) . '&' . rawurlencode(null);
$oauth_signature = base64_encode(hash_hmac('sha1', $base_info, $composite_key, true));
$oauth['oauth_signature'] = $oauth_signature;

$oauthString = "";
foreach($oauth as $key=>$value) {
    $stringKey = rawurlencode($key);
    $stringValue = rawurlencode($value);
    if (strlen($oauthString) == 0) {
        $oauthString .= "?";
    } else {
        $oauthString .= "&";
    }
    $oauthString .= "$stringKey=$stringValue";
}

$url .= $oauthString;

$options = array(
    CURLOPT_HEADER => false,
    CURLOPT_URL => $url,
    CURLOPT_PORT => 80,
    CURLOPT_RETURNTRANSFER => true);
$ch = curl_init();
curl_setopt_array($ch, $options);
$result = curl_exec($ch);
if ( ! $result ) {
    echo "Curl error :\n". curl_error($ch) . "\n";
    exit(1);
} else {
    $oauth_token="";
    $oauth_token_secret="";
    $resultArray=parse_url(rawurldecode($result));
    parse_str($resultArray["path"]);
    parse_str($resultArray["query"]);

    echo "Received a temporary request token :\n";
    echo "Request token        : ".$oauth_token."\n";
    echo "Request token secret : ".$oauth_token_secret."\n";
    echo "\n";
    echo "Next please authenticate yourself at ".$authentication_url."?oauth_token=".$oauth_token." and collect the PIN for the next step.\n";
    echo "\n";
}
curl_close($ch);

$pin = readline("Pin: ");

# Get an access token
echo "\nRequesting an access token.\n";
$link = "/oauth1/access_token/v1";

$timestamp = time();
$signature_method="HMAC-SHA1";
unset($oauth);
$oauth = array(
    'oauth_consumer_key' => $consumer_key,
    'oauth_signature_method' => $signature_method,
    'oauth_nonce' => time(),
    'oauth_timestamp' => $timestamp,
    'oauth_version' => '1.0',
    'oauth_token' => $oauth_token,
    'oauth_verifier' => $pin,
    );
$url = $api_url_base . $link;
$base_info = buildBaseString($url, 'GET', $oauth);
$composite_key = rawurlencode($consumer_secret) . '&' . rawurlencode($oauth_token_secret);
$oauth_signature = base64_encode(hash_hmac('sha1', $base_info, $composite_key, true));
$oauth['oauth_signature'] = $oauth_signature;

$oauthString = "";
foreach($oauth as $key=>$value) {
    $stringKey = rawurlencode($key);
    $stringValue = rawurlencode($value);
    if (strlen($oauthString) == 0) {
        $oauthString .= "?";
    } else {
        $oauthString .= "&";
    }
    $oauthString .= "$stringKey=$stringValue";
}

$url .= $oauthString;

$options = array(
    CURLOPT_HEADER => false,
    CURLOPT_URL => $url,
    CURLOPT_PORT => 80,
    CURLOPT_RETURNTRANSFER => true);
$ch = curl_init();
curl_setopt_array($ch, $options);
$result = curl_exec($ch);
if ( ! $result ) {
    echo "Curl error :\n". curl_error($ch) . "\n";
} else {
    $oauth_token="";
    $oauth_token_secret="";
    $resultArray=parse_url(rawurldecode($result));
    parse_str($resultArray["path"]);
    parse_str($resultArray["query"]);
    echo "\nReceived an access token :\n";
    echo "Access token         : ".$oauth_token."\n";
    echo "Access token secret  : ".$oauth_token_secret."\n";
    echo "\nYou can store these access token values in access_token.php for the other scripts to use.\n";
}
curl_close($ch);

