


angular
	.module(APP_NAME)
	.controller('DashboardController', ['$scope', '$cordovaFile', '$timeout', DashboardController]);	


function DashboardController($scope, $cordovaFile, $timeout){

	$scope.updateData = function(){
		/*$cordovaFile
			.readAsText(cordova.file.externalDataDirectory, 'data.json')
			.then(function(data){

				$cordovaFile
					//.writeExistingFile(cordova.file.applicationDirectory+'www/', "data.json", data)
					.writeFile(cordova.file.applicationStorageDirectory, 'data2.json', data, true)
					.then(function (success) {
						alert('Success "data.json"');
					}, function (error) {
						console.log(JSON.stringify(error));
						alert('Error Writing "data.json" -> '+JSON.stringify(error));
					});

			}, function (error) {
				alert('Error Reading "data.json"');
			}); */
	}


}
