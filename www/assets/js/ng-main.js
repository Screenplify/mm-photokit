
//Initialize Application 
angular
    .module(APP_NAME, APP_MODULES);


//Platform Ready
angular
    .module(APP_NAME)
    .run(function($ionicPlatform) {

        angular.element(document).ready(function () {
            console.log('NG-READY - Macy & Mitch - PhotoKit');
        });


        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if(window.StatusBar) {
                //StatusBar.styleDefault();
                StatusBar.hide();
            }

        });
    })


//http://stackoverflow.com/questions/18095727/limit-the-length-of-a-string-with-angularjs
angular
    .module(APP_NAME)
    .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                  	//Also remove . and , so its gives a cleaner result.
					if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
						lastspace = lastspace - 1;
					}
					value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });




angular
    .module(APP_NAME)
    .config(['$stateProvider', '$urlRouterProvider', RouterConfigurations]);


function RouterConfigurations ($stateProvider, $urlRouterProvider){
    $stateProvider

        .state('dashboard', {
            url: '/dashboard',
            views: {
                'main-content': {
                    templateUrl: 'views/dashboard.html',
                    controller: 'DashboardController'
                }
            }
        })

        .state('products', {
            url: '/products',
            views: {
                'main-content': {
                    templateUrl: 'views/products.html',
                    controller: 'ProductsController'
                }
            }
        })

        .state('form', {
            url: '/form/:productId',
            views: {
                'main-content': {
                    templateUrl: 'views/form.html',
                    controller: 'FormController'
                }
            }
        })

        .state('camera', {
            url: '/camera/?productId?stockCode',
            views: {
                'main-content': {
                    templateUrl: 'views/camera.html',
                    controller: 'CameraController'
                }
            }
        })

    $urlRouterProvider.otherwise('/products');
}
