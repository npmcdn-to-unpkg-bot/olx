<?php





use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require './vendor/autoload.php';


$short_connect = new mysqli('localhost', 'root', 'root', 'mysql', '3306');

$app = new \Slim\App;

//below code only to remember general skeleton of callback
$app->get('/test/{name}', function (Request $request, Response $response)
	{
    	$name = $request->getAttribute('name');
    	$response->getBody()->write("Hello, $name");

    	Return $response;
	});



//here START POINT FOR CLIENT APP
$app->get('/',function(Request $request, Response $response)
	{
	
	$html = file_get_contents('./index.html');

	$response->getBody()->write($html);
	});



$app->run();
