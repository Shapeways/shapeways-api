Shapeways REST API sample PHP/PECL applications
===============================================

Sample applications for the Shapeways REST API in PHP/PECL

## Installation

1. install php
2. install php-pear
3. pecl install oauth

## Configuration

1. Get an oauth1 `Consumer Key` at <http://www.shapeways.com/myapps> and store the `Consumer Key` in `consumer_key.php`
2. Run `Authorize-oauth1-pecl.php` to :
  - get temporary credentials (aka a `Request Token`)
  - authorize the `Consumer Key` with the `Request Token` via the presented URL to get the `Verifier` code
  - enter the `Verifier code` to request an `Access Token`
  - store the `Access Token` in `access_token.php`.

## Sample scripts

- ApiList-oauth1-pecl.php Shows your rate limiting data in JSON format.
- CartAddModel-oauth1-pecl.php Add a model to your shopping cart.
- CartList-oauth1-pecl.php Show your cart contents.
- MaterialList-oauth1-pecl.php Show the list of all material properties.
- MaterialInfo-oauth1-pecl.php Show material properties.
- ModelDownload-oauth1-pecl.php Download a model.
- ModelGet-oauth1-pecl.php Show model properties.
- ModelUpload-oauth1-pecl.php Upload a model.
- PrinterList-oauth1-pecl.php Show a list of all properties of all printers.
- PrinterGet-oauth1-pecl.php Show all properties of a printer.

## TODO

- 
