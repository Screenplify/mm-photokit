

angular
	.module(APP_NAME)
	.controller('FormController', ['$scope', 'DataFactory', '$stateParams', '$state', '$ionicPopup', '$timeout', FormController]);	


function FormController($scope, DataFactory, $stateParams, $state, $ionicPopup, $timeout){
		
	//Screen Orientation
	if('orientation' in screen) screen.orientation.lock('portrait');	

	//console.log($stateParams.productId);

	$scope.productDetails = {}
	$scope.form = {
		stockCode: '',
		supplierCode: '',
		remark: ''
	}

	$scope.getProductDetails = function(){
		DataFactory.getProductDetails($stateParams.productId)
			.then(function(resp){
				$scope.productDetails = resp;
			}, function(error){
				alert(error);
			});
	}

	$scope.processForm = function(){
			
		if($scope.form.stockCode != ''){

			$state.go('camera', {productId: $stateParams.productId, stockCode:$scope.form.stockCode});

		} else {
			var alertPopup = $ionicPopup.alert({
				title: 'Oops!',
				template: 'StockCode cannot be empty'
			});

			// alertPopup.then(function(res) {
			// 	console.log('Thank you for not eating my delicious ice cream cone');
			// });
		}
	}


	//Init
	document.addEventListener('deviceready', function (){
		$scope.getProductDetails();
	});
}
