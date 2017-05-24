


angular
	.module(APP_NAME)
	.controller('ProductsController', ['$scope', 'DataFactory', '$timeout', ProductsController]);	


function ProductsController($scope, DataFactory, $timeout){

	//Screen Orientation
	if('orientation' in screen) screen.orientation.lock('portrait');

	$scope.productsList = [];

	$scope.getProducts = function(){
		DataFactory.getProducts()
			.then(function(resp){
				$scope.productsList = resp;
			}, function(error){
				alert(error);
			});
	}


	//Init
	document.addEventListener('deviceready', function (){
		$scope.getProducts();
	});

}
