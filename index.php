<?php





use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require './vendor/autoload.php';
// INIT DB, TABLES if  not existed
include './mysql_db.php';
create_db();
create_table();


$app = new \Slim\App;






//here START POINT FOR CLIENT APP
$app->get('/',function(Request $request, Response $response)
	{
	
	$html = file_get_contents('./index.html');

	$response->getBody()->write($html);
	});



$app->get('/api/advert/get',function(Request $request, Response $response)
	{
	$res = get_adverts();	
	$response->getBody()->write($res);
	});

$app->post('/api/advert/remove',function(Request $request, Response $response)
	{
	$res = $request->getParsedBody();
	$res = remove_advert($res);	
	$response->getBody()->write(json_encode($res));
	});


$app->post('/api/advert/add',function(Request $request, Response $response)
	{

	$res = $request->getParsedBody();
	$res = insert_advert($res);	
	$response->getBody()->write(json_encode($res));
	});



$app->get('/test',function(Request $request, Response $response)
	{
	$res = update_advert();	
	$response->getBody()->write($res);
	});




$app->run();

