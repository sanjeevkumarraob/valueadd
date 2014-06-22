<?php

require 'Slim/Slim.php';
//\Slim\Slim::registerAutoloader();
//require 'vendor/autoload.php';

$app = new Slim();

$app->get('/properties', 'getProperties');
$app->get('/properties/:id',	'getProperty');
$app->post('/searchproperties',	'searchProperty');
//$app->get('/searchproperties',	'searchProperty');


$app->get('/projects', 'getProjects');
$app->get('/projects/:id',	'getProject');
$app->post('/projects', 'addProject');
$app->put('/projects/:id', 'updateProject');
$app->delete('/projects/:id', 'deleteProject');

$app->get('/users/:id',	'getUser');
$app->post('/users', 'addUser');
$app->put('/users/:id', 'updateUser');
$app->delete('/users/:id', 'deleteUser');

$app->get('/leads', 'getLeads');

$app->get('/contacts', 'getContacts');

$app->get('/locations', 'getLocations');
$app->get('/locations/:id',	'getLocation');
$app->post('/locations', 'addLocation');
$app->put('/locations/:id', 'updateLocation');
$app->delete('/locations/:id', 'deleteLocation');

$app->get('/amenities', 'getAmenities');
$app->post('/amenities', 'addAmenities');
$app->delete('/amenities/:id', 'deleteAmenities');

$app->get('/propertyAmenities', 'getPropertyAmenities');

$app->get('/hello/:name', function ($name) {
    echo "Hello, $name";
});

$app->run();

function getProperties() {
	$sql = "select * FROM properties where status= 'Active' ORDER BY createdon desc";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$properties = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($properties);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getProperty($id) {
	$sql = "SELECT * FROM properties WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$property = $stmt->fetchObject();  
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function searchPropertyByGet() {
	error_log('addProperty\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
    $type = $request->params('type');
    $location = $request->params('location');
    $size = $request->params('size');
    $bedroom = $request->params('bedroom');
    $completiondate = $request->params('completiondate');
    $pricerange = $request->params('pricerange');
    //$property = json_decode($request->getBody());
	$sql = "SELECT * FROM properties where type=:type and (location=:location or totalarea=:totalarea or bedroom=:bedroom or possession=:possession or price <=:price)";
    
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("location", $location);
		$stmt->bindParam("totalarea", $size);
		$stmt->bindParam("bedroom", $bedroom);
        $stmt->bindParam("possession", $completiondate);
		$stmt->bindParam("price", $pricerange);
		$stmt->bindParam("type", $type);
		$stmt->execute();
        $properties = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($properties); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function searchProperty() {
	error_log('addProperty\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
    $property = json_decode($request->getBody());
	$sql = "SELECT * FROM properties where location=:location and (type=:type or totalarea=:totalarea or bedroom=:bedroom or possession=:possession or price <=:price)";
    
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("location", $property->location);
		$stmt->bindParam("totalarea", $property->size);
		$stmt->bindParam("bedroom", $property->bedroom);
        $stmt->bindParam("possession", $property->completiondate);
		$stmt->bindParam("price", $property->pricerange);
		$stmt->bindParam("type", $property->type);
		$stmt->execute();
        $properties = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($properties); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function updateProperty($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$property = json_decode($body);
	$sql = "UPDATE properties SET name = :name, description = :description, location =:location ,
  sqftcost = :sqftcost, totalarea = :totalarea, image1 = :image1, 
  image2 = :image2, image3 = :image3, 
  type = :type, bedroom = :bedroom , status = :status, hotproperty = :hotproperty WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $property->name);
		$stmt->bindParam("description", $property->description);
		$stmt->bindParam("location", $property->location);
		$stmt->bindParam("sqftcost", $property->sqftcost);
		$stmt->bindParam("totalarea", $property->totalarea);
		$stmt->bindParam("image1", $property->image1);
        $stmt->bindParam("image2", $property->image2);
		$stmt->bindParam("image3", $property->image3);
		$stmt->bindParam("bedroom", $property->bedroom);
		$stmt->bindParam("type", $property->type);
		$stmt->bindParam("status", $property->status);
		$stmt->bindParam("hotproperty", $property->hotproperty);
		$stmt->bindParam("id", $id);
		
        $stmt->execute();
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteProperty($id) {
	$sql = "DELETE FROM properties WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getProjects() {
	$sql = "select * FROM projects ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$properties = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($properties);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getProject($id) {
	$sql = "SELECT * FROM projects WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$property = $stmt->fetchObject();  
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addProject() {
	error_log('addProperty\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$property = json_decode($request->getBody());
	$sql = "INSERT INTO projects ( name, description, logo, propertyid, status, hotproject, createdon) VALUES (:name,:description,:logo,:propertyid,:status,:hotproject,CURRENT_DATE)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $property->name);
		$stmt->bindParam("description", $property->description);
		$stmt->bindParam("logo", $property->logo);
		$stmt->bindParam("propertyid", $property->propertyid);
		$stmt->bindParam("status", $property->status);
		$stmt->bindParam("hotproject", $property->hotproject);
		$stmt->execute();
		$property->id = $db->lastInsertId();
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateProject($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$property = json_decode($body);
	$sql = "UPDATE projects SET name = :name, description = :description, logo =:logo ,
  propertyid = :propertyid, status = :status, hotproject = :hotproject WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $property->name);
		$stmt->bindParam("description", $property->description);
		$stmt->bindParam("logo", $property->logo);
		$stmt->bindParam("propertyid", $property->propertyid);
		$stmt->bindParam("status", $property->status);
		$stmt->bindParam("hotproject", $property->hotproject);
		$stmt->bindParam("id", $id);
		
        $stmt->execute();
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteProject($id) {
	$sql = "DELETE FROM projects WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getUser($id) {
	$sql = "SELECT * FROM users WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$property = $stmt->fetchObject();  
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addUser() {
	error_log('addProperty\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$property = json_decode($request->getBody());
	$sql = "INSERT INTO users ( username, password) VALUES (:username,:password)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("username", $property->name);
		$stmt->bindParam("password", $property->description);
		$stmt->execute();
		$property->id = $db->lastInsertId();
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateUser($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$property = json_decode($body);
	$sql = "UPDATE users SET password = :password WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("password", $property->password);
		$stmt->bindParam("id", $id);
		
        $stmt->execute();
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteUser($id) {
	$sql = "DELETE FROM users WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getLeads() {
	$sql = "select * FROM leads ORDER BY propertyname";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$properties = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($properties);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getContacts() {
	$sql = "select * FROM contacts ORDER BY firstname";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$properties = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($properties);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getLocations() {
	$sql = "select * FROM location ORDER BY location";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$properties = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($properties);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getLocation($id) {
	$sql = "SELECT * FROM location WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$property = $stmt->fetchObject();  
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function addLocation() {
	error_log('addProperty\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$property = json_decode($request->getBody());
	$sql = "INSERT INTO location (location) VALUES (:location)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("location", $property->location);
		$stmt->execute();
		$property->id = $db->lastInsertId();
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateLocation($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$property = json_decode($body);
	$sql = "UPDATE location SET location = :location WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("location", $property->location);
		$stmt->bindParam("id", $id);
		
        $stmt->execute();
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function deleteLocation($id) {
	$sql = "DELETE FROM location WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getAmenities() {
	$sql = "select * FROM amenities ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$properties = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($properties);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addAmenities() {
	error_log('addProperty\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$property = json_decode($request->getBody());
	$sql = "INSERT INTO amenities (name) VALUES (:name)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $property->name);
		$stmt->execute();
		$property->id = $db->lastInsertId();
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteAmenities($id) {
	$sql = "DELETE FROM amenities WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getPropertyAmenities($id) {
	$sql = "SELECT * FROM amenities a,property_amenities b WHERE  a.id=b.id and b.property_id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$property = $stmt->fetchObject();  
		$db = null;
		echo json_encode($property); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}



function getConnection() {
	$dbhost="localhost";
	$dbuser="govalxui_admin";
	$dbpass="admin@appedge123";
    //$dbuser="root";
	//$dbpass="";
	$dbname="govalxui_properties";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>