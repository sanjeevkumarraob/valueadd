valaddsApp.factory('PropertyService',function(Restangular){
    console.log('in PropertyService');
    var baseProperty = Restangular.all("properties");
    return{
        getList: function() {
                return baseProperty.getList();
            }
    }

    });

valaddsApp.factory('ProjectService',function(Restangular){
    console.log('in ProjectService');
    var list = Restangular.all("projects");
    return{
        getList: function() {
                return list.getList();
            }
    }

    });

valaddsApp.factory('LocationService',function(Restangular){
    console.log('in location service');
    var locations = Restangular.all("locations");
    return{
        getList: function() {
                return locations.getList();
            }
    }

    });

valaddsApp.factory('AmenitiesService',function(Restangular){
    console.log('in Amenities service');
    var amenities = Restangular.all("amenities");
    return{
        getList: function() {
                return amenities.getList();
            }
    }

    });

valaddsApp.factory('ImageService',function(Restangular){
    console.log('in image service');

     return{
        getList: function(id) {
            var baseImages=Restangular.one("images",id);
                return baseImages.get();
            }
    }

    });



valaddsApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

valaddsApp.directive("itinerary", function () {
    return {
        restrict: "E",
        scope: {
            done: "&"
        },
        template: '<div class="control-group">' + '<label class="control-label">itinerary_overview_description</label>' + '<div class="controls">' + '<input type="text" placeholder="" ng-model="itineries.itinerary_overview_description">' + '</div></div>' +
            ' {{itinerary}}' +
            ' <div class="btn btn-success" ng-click="done({itinerary:itinerary})">Add Itinerary</div>'
    }
})


valaddsApp.directive("ngPortlet", function ($compile) {
    return {
        template: '<div><itinerary done="saveItinerary(itinerary)"></itinerary></div>   ',
        restrict: 'E',

        link: function (scope, elm) {
            scope.add = function () {
                console.log(elm);
                elm.after($compile('<ng-portlet></ng-portlet>')(scope));
            }
        }
    };
});


valaddsApp.directive("delete", function() {
    return function(scope, element, attrs) {
        element.bind("click", function() {
            scope.$apply(attrs.delete)
        })
    }
})
