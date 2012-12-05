<?php

$verbose_debug = false;

function Error($component, $exception, $info, $LastResponseInfo, $debugInfo) {
    global $verbose_debug;
    echo "A fatal error occurred during $component\n";
    if ($exception) {
        echo "Exception : $exception\n";
    }
    if ($info) {
        if (array_key_exists('oauth_problem', $info)) {
            echo "oauth_problem : [". $info['oauth_problem'] . "]\n";
        }
        if ($verbose_debug) {
            echo "Query response body :\n";
            var_dump($info);
        }
    } 
    if ($verbose_debug && $LastResponseInfo) {
        echo "Query response headers :\n";
        var_dump($LastResponseInfo);
    }
    if ($verbose_debug && $debugInfo) {
        echo "Oauth debugInfo :\n";
        var_dump($debugInfo);
    }
    exit(1);
}

function PrintJsonLastError() {
    switch (json_last_error()) {
        case JSON_ERROR_NONE:
            echo ' - No errors';
        break;
        case JSON_ERROR_DEPTH:
            echo ' - Maximum stack depth exceeded';
        break;
        case JSON_ERROR_STATE_MISMATCH:
            echo ' - Underflow or the modes mismatch';
        break;
        case JSON_ERROR_CTRL_CHAR:
            echo ' - Unexpected control character found';
        break;
        case JSON_ERROR_SYNTAX:
            echo ' - Syntax error, malformed JSON';
        break;
        case JSON_ERROR_UTF8:
            echo ' - Malformed UTF-8 characters, possibly incorrectly encoded';
        break;
        default:
            echo ' - Unknown error';
        break;
    }
    echo PHP_EOL;
}

