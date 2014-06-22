'use strict';


function loginController($scope, Restangular,$location) {
  $scope.master = {};
    $scope.isUnchanged = function(user) {
    return angular.equals(user, $scope.master);
  };
  $scope.signIn = function () {
    Restangular.all('login').post($scope.user).then(function (user) {
      if(user == 'false'){
          $scope.errorMessage = "Please check the username and password"
      }else{
        sessionStorage.setItem("userData",JSON.stringify(user));
        $location.path('/');
      }


    });


  }//sign in ends
    $scope.reset = function() {
    $scope.user.username = '';
    $scope.user.password = '';

  };


  $scope.close = function () {
    $scope.reset();
    $(".alert").alert('close');
  }


}

function logoutController($scope, Restangular,$location) {

    sessionStorage.clear();
    $location.path("/login");

}



function defaultCtrl($scope, Restangular,$location) {

 $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

 if($scope.userData == null || $scope.userData == 'undefined' ){
  $location.path('/login');
 }

}

function LeadsController($scope, Restangular,$location) {

  $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

  if($scope.userData == null || $scope.userData == 'undefined' ){
   $location.path('/login');
  }
    var leadsList = Restangular.all("leads");
    leadsList.getList().then(function (leads) {
        $scope.leads = leads;
    });
}



function ContactsController($scope, Restangular,$location) {
  $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

  if($scope.userData == null || $scope.userData == 'undefined' ){
   $location.path('/login');
  }
    var contactsList = Restangular.all("contacts");
    contactsList.getList().then(function (contacts) {
        $scope.contacts = contacts;
    });
}



valaddsApp.controller('headerController', ['$scope', '$route', '$location', '$controller',
    function ($scope, $route, $location, $controller) {

$scope.userData = JSON.parse(sessionStorage.getItem("userData"));


}]);

valaddsApp.controller('footerController', ['$scope', '$route', '$location', '$controller',
    function ($scope, $route, $location, $controller) {


        $scope.$on('$includeContentLoaded', function (event) {
            $('#myCarousel').oneCarousel({
                easeIn: 'rotateIn',
                interval: 6000,
                pause: 'hover'
            });

            $('.flickr').jflickrfeed({
                flickrbase: 'http://api.flickr.com/services/feeds/',
                feedapi: 'photos_public.gne',
                limit: 8,
                qstrings: {
                    id: '75006109@N07'
                },
                itemTemplate: '<li class="span1">' +
                    '<a href="{{image_b}}"><img src="{{image_s}}" alt="{{title}}" /></a>' +
                    '</li>'
            });

        });
}]);

valaddsApp.controller('carouselController', ['$scope', '$route', '$location', '$controller',
    function ($scope, $route, $location, $controller) {


        $scope.$on('$includeContentLoaded', function (event) {
            $('#myCarousel').oneCarousel({
                easeIn: 'rotateIn',
                interval: 6000,
                pause: 'hover'
            });


        });
}]);


function viewpropertiesListController($scope, Restangular, PropertyService,$location) {
  $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

  if($scope.userData == null || $scope.userData == 'undefined' ){
   $location.path('/login');
  }
    PropertyService.getList().then(function (properties) {
        $scope.properties = properties;
    });
}

function viewLocationsListController($scope, Restangular, LocationService,$location) {
  $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

  if($scope.userData == null || $scope.userData == 'undefined' ){
   $location.path('/login');
  }
    LocationService.getList().then(function (locations) {
        $scope.locationslist = locations;
    });
}

function addLocationsController($scope, $location, Restangular) {

  $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

  if($scope.userData == null || $scope.userData == 'undefined' ){
   $location.path('/login');
  }

    $scope.save = function () {

        Restangular.all('locations').post($scope.location).then(function (location) {
            $location.path('/admin/locations/view');
        });
    }
}

function editLocationsController($scope, $location, Restangular, location) {

    $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

    if($scope.userData == null || $scope.userData == 'undefined' ){
     $location.path('/login');
    }

    var original = location;

    $scope.location = Restangular.copy(original);


    $scope.isClean = function () {
        return angular.equals(original, $scope.location);
    }

    $scope.destroy = function () {
        original.remove().then(function () {
            $location.path('/admin/locations/view');
        });
    };

    $scope.save = function () {
        $scope.location.put().then(function () {
            $location.path('/admin/locations/view');
        });
    };
}




function addPropertiesController($scope, $location, Restangular, LocationService) {

  $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

  if($scope.userData == null || $scope.userData == 'undefined' ){
   $location.path('/login');
  }


    LocationService.getList().then(function (locations) {
        $scope.locationsListArray = locations;
    });

    $scope.save = function () {
        Restangular.all('properties').post($scope.property).then(function (property) {
           $location.path('/admin/properties/sliderimage/'+property.id);
        });
    }


    $("input.uniform").uniform();
}


function editPropertiesController($scope, $location, Restangular, property,ImageService, LocationService) {

    $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

    if($scope.userData == null || $scope.userData == 'undefined' ){
     $location.path('/login');
    }

    var scope = $scope;

    LocationService.getList().then(function (locations) {

        $scope.locationsListArray = locations;
    });
    
    var original = property;

    $scope.property = Restangular.copy(original);


    $scope.isClean = function () {
        return angular.equals(original, $scope.property);
    }

    $scope.destroy = function () {
        original.remove().then(function () {
            $location.path('/admin/properties/view');
        });
    };

     ImageService.getList(property.id).then(function(images) {
        $scope.imageList = images;
         //console.log($scope.imageList)
    });

   
    $scope.deleteImage = function(imageId){
        Restangular.one('properties',property.id).one('images',imageId).get().then(function(images){
        var image = images;
           image.remove().then(function () {
            ImageService.getList(property.id).then(function(images) {
                $scope.imageList = images;

            });
        });

       });
    }


    $scope.save = function () {
        $scope.property.put().then(function () {
            $location.path('/admin/properties/view');
        });
    };

           ImageService.getList(property.id).then(function(images) {
              $scope.imageList = images;
              //scope.$digest();
    });
    $("input.uniform").uniform();
}

function AddProjectsController($scope, $location, Restangular, PropertyService) {
    $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

    if($scope.userData == null || $scope.userData == 'undefined' ){
     $location.path('/login');
    }

    PropertyService.getList().then(function (properties) {
        $scope.propertieslist = properties;
    });


    $scope.save = function () {
        Restangular.all('projects').post($scope.project).then(function (project) {
            $location.path('/admin/projects/view');
        });
    }
}

function ViewProjectsController($scope, Restangular, ProjectService,$location) {

    $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

    if($scope.userData == null || $scope.userData == 'undefined' ){
     $location.path('/login');
    }

    ProjectService.getList().then(function (projects) {
        $scope.projects = projects;
    });
}


function EditProjectsController($scope, $location, Restangular, project, LocationService) {

    $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

    if($scope.userData == null || $scope.userData == 'undefined' ){
     $location.path('/login');
    }

    LocationService.getList().then(function (locations) {
        $scope.locationslist = locations;
    });

    var original = project;

    $scope.project = Restangular.copy(original);


    $scope.isClean = function () {
        return angular.equals(original, $scope.project);
    }

    $scope.destroy = function () {
        original.remove().then(function () {
            $location.path('/admin/projects/view');
        });
    };

    $scope.save = function () {
        $scope.project.put().then(function () {
            $location.path('/admin/projects/view');
        });
    };
}

 function ImageController ($scope, $fileUploader,$routeParams,$location,Restangular) {
     
     $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

    if($scope.userData == null || $scope.userData == 'undefined' ){
     $location.path('/login');
    }
     
     console.log("property id >> "+$routeParams.id);
        // Creates a uploader
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,
            url: 'image-upload/upload.php'
        });


        // ADDING FILTERS

        // Images only
        uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
            var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
            type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        });


        // REGISTER HANDLERS

        uploader.bind('afteraddingfile', function (event, item) {
            console.info('After adding a file', item);
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            console.info('When adding a file failed', item);
        });

        uploader.bind('afteraddingall', function (event, items) {
            console.info('After adding all files', items);
        });

        uploader.bind('beforeupload', function (event, item) {
            console.info('Before upload', item);
        });

        uploader.bind('progress', function (event, item, progress) {
            console.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function (event, xhr, item, response) {
            console.info('Success', xhr, item, response);
           
            $scope.dataString = {id:$routeParams.id,url:response.answer}
            Restangular.all('sliderimages').post($scope.dataString).then(function (images) {
                console.info("response text ",images );
            $location.path('/admin/properties/imageupload/'+$routeParams.id);
        }); 
            
        });

        uploader.bind('cancel', function (event, xhr, item) {
            console.info('Cancel', xhr, item);
        });

        uploader.bind('error', function (event, xhr, item, response) {
            console.info('Error', xhr, item, response);
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            console.info('Complete', xhr, item, response);
        });

        uploader.bind('progressall', function (event, progress) {
            console.info('Total progress: ' + progress);
        });

        uploader.bind('completeall', function (event, items) {
            console.info('Complete all', items);
        });
    };


 function ImageUploadController ($scope, $fileUploader,$routeParams,$location,Restangular) {
     
     $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

    if($scope.userData == null || $scope.userData == 'undefined' ){
     $location.path('/login');
    }
     
     console.log("property id >> "+$routeParams.id);
        // Creates a uploader
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,
            url: 'image-upload/upload.php'
        });


        // ADDING FILTERS

        // Images only
        uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
            var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
            type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        });


        // REGISTER HANDLERS

        uploader.bind('afteraddingfile', function (event, item) {
            console.info('After adding a file', item);
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            console.info('When adding a file failed', item);
        });

        uploader.bind('afteraddingall', function (event, items) {
            console.info('After adding all files', items);
        });

        uploader.bind('beforeupload', function (event, item) {
            console.info('Before upload', item);
        });

        uploader.bind('progress', function (event, item, progress) {
            console.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function (event, xhr, item, response) {
            console.info('Success', xhr, item, response);
           
            $scope.dataString = {propertyid:$routeParams.id,imageurl:response.answer}
            Restangular.all('images').post($scope.dataString).then(function (images) {
            $location.path('/admin/properties/view');
        });
            
        });

        uploader.bind('cancel', function (event, xhr, item) {
            console.info('Cancel', xhr, item);
        });

        uploader.bind('error', function (event, xhr, item, response) {
            console.info('Error', xhr, item, response);
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            console.info('Complete', xhr, item, response);
        });

        uploader.bind('progressall', function (event, progress) {
            console.info('Total progress: ' + progress);
        });

        uploader.bind('completeall', function (event, items) {
            console.info('Complete all', items);
        });
    };



valaddsApp.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);

function AmenitiesController($scope, $location, Restangular, property,AmenitiesService) {

    $scope.userData = JSON.parse(sessionStorage.getItem("userData"));

    if($scope.userData == null || $scope.userData == 'undefined' ){
     $location.path('/login');
    }

    var scope = $scope;

    AmenitiesService.getList().then(function (amenities) {

        $scope.amenitiesListArray = amenities;
    });
    
    var original = property;

    $scope.property = Restangular.copy(original);


    $scope.isClean = function () {
        return angular.equals(original, $scope.property);
    }

    $scope.destroy = function () {
        original.remove().then(function () {
            $location.path('/admin/properties/view');
        });
    };

     ImageService.getList(property.id).then(function(images) {
        $scope.imageList = images;
         //console.log($scope.imageList)
    });

   
    $scope.deleteImage = function(imageId){
        Restangular.one('properties',property.id).one('images',imageId).get().then(function(images){
        var image = images;
           image.remove().then(function () {
            ImageService.getList(property.id).then(function(images) {
                $scope.imageList = images;

            });
        });

       });
    }


    $scope.save = function () {
        $scope.property.put().then(function () {
            $location.path('/admin/properties/view');
        });
    };

           ImageService.getList(property.id).then(function(images) {
              $scope.imageList = images;
              //scope.$digest();
    });
    $("input.uniform").uniform();
}
