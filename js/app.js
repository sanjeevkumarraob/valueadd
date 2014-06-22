'use strict';

// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
var valaddsApp = angular.module('angularvaladds', ['ngSanitize','ngRoute','restangular','ui.bootstrap','angularFileUpload']);
  valaddsApp.config(function($routeProvider,$locationProvider,RestangularProvider) {

  $routeProvider.
  when('/', {
templateUrl:'partials/default.html',
controller: defaultCtrl
      }).
      when('/login', {
           templateUrl:'partials/login.html',
           controller: loginController
         }).
      when('/logout', {
        templateUrl:'partials/login.html',
           controller: logoutController
         }).
   when('/leads', {
        templateUrl:'partials/leads.html',
        controller: LeadsController
      }).
  when('/contacts', {
        templateUrl:'partials/contacts.html',
        controller: ContactsController
      }).
   when('/admin/projects/add', {
        templateUrl: 'partials/addprojects.html',
        controller: AddProjectsController
      }).
   when('/admin/projects/view', {
        templateUrl: 'partials/viewprojects.html',
        controller: ViewProjectsController
      }).
      when('/admin/properties/add', {
        templateUrl: 'partials/addproperties.html',
        controller: addPropertiesController
      }).
      when('/admin/properties/sliderimage/:id', {
        templateUrl: 'partials/slider-image.html',
        controller: ImageController
      }).
      when('/admin/properties/imageupload/:id', {
        templateUrl: 'partials/image-upload.html',
        controller: ImageUploadController
      }).
      when('/admin/properties/amenities/:id', {
        templateUrl: 'partials/addamenties.html',
        controller: AmenitiesController
      }).
  when('/admin/properties/view', {
        templateUrl: 'partials/viewproperties.html',
        controller: viewpropertiesListController
      }).
  when('/admin/locations/view', {
        templateUrl: 'partials/locations.html',
        controller: viewLocationsListController
      }).
   when('/admin/locations/add', {
        templateUrl: 'partials/addlocations.html',
        controller: addLocationsController
      }).
   when('/admin/locations/edit/:id', {
        templateUrl: 'partials/addlocations.html',
        controller: editLocationsController,
      resolve: {
          location: function(Restangular, $route){
            return Restangular.one('locations', $route.current.params.id).get();
          }
        }
      }).
  when('/properties/', {
        templateUrl: 'partials/properties.html',
        controller: viewpropertiesListController
      }).
  when('admin/new', {
        templateUrl: 'partials/addproperties.html',
        controller: addPropertiesController
      }).
  when('/admin/properties/edit/:propertiesId', {
        templateUrl: 'partials/addproperties.html',
        controller: editPropertiesController,
      resolve: {
          property: function(Restangular, $route){
            return Restangular.one('properties', $route.current.params.propertiesId).get();
          }
        }
      }).
  when('/admin/projects/edit/:projectsId', {
        templateUrl: 'partials/addprojects.html',
        controller: EditProjectsController,
      resolve: {
          project: function(Restangular, $route){
            return Restangular.one('projects', $route.current.params.projectsId).get();
          }
        }
      }).
      otherwise({
        redirectTo: '/'
      });

//Restangular Configuration

     RestangularProvider.setBaseUrl('api/admin');
     RestangularProvider.setRequestInterceptor(function(elem, operation, what) {

        if (operation === 'put') {
          elem._id = undefined;
          return elem;
        }
        return elem;
      })
  });
