<?php


$short_connect = new mysqli('localhost', 'root', 'root');
if ($short_connect->connect_errno!=false) 
	{
	exit( "Cannot connect to MySql: (" . $short_connect->connect_errno . ") ");
	}

$short_connect->select_db('olx');


function create_db()
	{
	global $short_connect;
	$qr = "CREATE DATABASE IF NOT EXISTS olx";
	$res = $short_connect->query($qr);
	}


function create_table()
	{
	global $short_connect;
	$qr = "
		CREATE TABLE IF NOT EXISTS `adverts` (
  		  `id` int(11) NOT NULL AUTO_INCREMENT,
  		  `Title` text NOT NULL,
  		  `Category` text NOT NULL,
  		  `Age` text NOT NULL,
  		  `State` text NOT NULL,
  		  `Price` int(11) NOT NULL,
  		  `Date` datetime NOT NULL,
  		  `Description` text NOT NULL,
		  `Status` int NOT NULL,
  		  PRIMARY KEY (`id`)
		)";
	$res = $short_connect->query($qr);
	}


function get_adverts()
	{
	global $short_connect;
	$qr = "SELECT * FROM adverts WHERE Status!=2;";
	
	$res = $short_connect->query($qr);
	$res_arr = array();
	while($row = $res->fetch_array())
		{
		$res_arr[]=$row;
		};
	return json_encode($res_arr);
	};



function insert_advert($obj)
	{
	global $short_connect;
	$qr = "INSERT INTO adverts (Title,Category,Age,State,Price,Date,Description,Status) VALUES
		(
		'".$obj["data"]["Title"]."',
		'".$obj["data"]["Category"]."',
		'".$obj["data"]["Age"]."',
		'".$obj["data"]["State"]."',
		'".$obj["data"]["Price"]."',
		FROM_UNIXTIME(".$obj["data"]["DateTs"]."),
		'".$obj["data"]["Description"]."',
		1
		)";
	$res = $short_connect->query($qr);
	$res = array(
		"id"=>$short_connect->insert_id
		);
	return $res;


	};

function update_advert($obj)
	{
	global $short_connect;

	$qr = "UPDATE adverts SET 
		Title='".$obj["data"]["Title"]."',
		Category = '".$obj["data"]["Category"]."',
		Age = '".$obj["data"]["Age"]."',
		State = '".$obj["data"]["State"]."',
		Price = ".$obj["data"]["Price"].",
		Description = '".$obj["data"]["Description"]."'
		WHERE id=".$obj["data"]["id"]."";

	$res = $short_connect->query($qr);
	
	return $obj["data"];

	}

function remove_advert($obj)
	{
	global $short_connect;

	$qr = "UPDATE adverts SET Status = 2 WHERE id=".$obj["data"]["id"].";";
	$res = $short_connect->query($qr);
	
	return 'OK';

	}

