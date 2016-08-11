<?php

$verbose_debug = false; // set to true to print out extra debug information

function Error($component, $exception, $lastResponse, $lastResponseInfo, $debugInfo = NULL, $file = NULL, $line= NULL) {
    global $verbose_debug;

    echo "A fatal error occurred during $component";
    if(!is_null($file) && !is_null($line)) {
      echo "in file <$file> on line <$line>";
    }
    echo "\n";

    if ($exception) {
        echo "Exception : $exception\n";
    }

    if($lastResponse) {
      echo "Error : ";
      $json = json_decode($lastResponse);
      if (null == $json) {
        PrintJsonLastError();
        var_dump($lastResponse);
      } else {
        print_r($json);
      }
    }

    if ($verbose_debug && $lastResponseInfo) {
        echo "\nQuery response headers :\n";
        var_dump($lastResponseInfo);
    }

    if ($verbose_debug && $debugInfo) {
        echo "\nOauth debugInfo :\n";
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

