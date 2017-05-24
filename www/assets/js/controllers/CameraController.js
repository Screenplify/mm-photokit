

angular
	.module(APP_NAME)
	.controller('CameraController', ['$scope', '$http', '$ionicModal', '$cordovaFile', '$ionicLoading', '$timeout', '$cordovaToast', 'DataFactory', '$stateParams', CameraController]);	


function CameraController($scope, $http, $ionicModal, $cordovaFile, $ionicLoading, $timeout, $cordovaToast, DataFactory, $stateParams){
	
	//Screen Orientation
	if('orientation' in screen) screen.orientation.lock('landscape');	

	$scope.deviceStorage = 00;
	$scope.imageResolutuions = {
		supported: [],
		width: 0,
		height: 0
	}
	
	$scope.imageRaw = '';
	$scope.image = '';
	$scope.imagePath = '';

	$scope.productID = $stateParams.productId;
	$scope.stockCode = $stateParams.stockCode;
	$scope.productDetails = {};

	$scope.camera = {
		enabled: false,
		Toggle: function(){
			if($scope.camera.enabled){
				CameraPreview.hide();
				$scope.camera.enabled = false;
			} else {
				CameraPreview.show();
				$scope.camera.enabled = true;
			}
		}
	}

	$scope.samples = {
		image: {enabled: false, image: ''},
		guide: {enabled: false, image: ''},
		marker: {enabled: false, image: '', left: (window.screen.width / 2) }
	}

	$scope.info = {
		modal: '',
		isOpen: false,
		Open: function(){
			$scope.info.modal.show();
			$scope.info.isOpen = true;		
		},
		Close: function(){
			$scope.info.modal.hide();
			$scope.info.isOpen = false;		
		},
		Toggle: function(){
			if($scope.info.isOpen){
				$scope.info.Close();
			} else {
				$scope.info.Open();
			}
		},
		Init: function(){
			$ionicModal.fromTemplateUrl('mmpk-info.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.info.modal = modal;
			});
		}
	}

	$scope.save = {
		modal: '',
		isOpen: false,
		Open: function(){
			$scope.save.modal.show();
			$scope.save.isOpen = true;		
		},
		Close: function(){
			$scope.save.modal.hide();
			$scope.save.isOpen = false;		
		},
		Toggle: function(){
			if($scope.save.isOpen){
				$scope.save.Close();
			} else {
				$scope.save.Open();
			}
		},
		Init: function(){
			$ionicModal.fromTemplateUrl('mmpk-save.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.save.modal = modal;
			});
		}
	}

	$scope.viewsPanel = {
		enabled: false
	}

	$scope.guideLines = {
		vertical: {
			value: 25,
			options: {
				id: 'slider-v',
				floor: 0,
				ceil: (window.screen.width / 2) + 100,
				step: 1,
				minLimit: 25,
				//maxLimit: (window.screen.width / 2) - 25,
				translate: function(value) {return '';}
			}
		},
		horizontal: {
			value: 25,
			options: {
				id: 'slider-h',
				vertical: true,
				rightToLeft: true,
				floor: 0,
				ceil: (window.screen.width / 3) + 25,
				step: 1,
				minLimit: 25,
				//maxLimit: (window.screen.width / 4) - 25,
				translate: function(value) {return '';}
			}
		}
	}

	$scope.startCamera = function(){
		$scope.screenWidth = window.screen.width;
		$scope.screenHeight = window.screen.height;

		CameraPreview.startCamera({
			x: 0, 
			y: 0, 
			width: $scope.screenWidth, 
			height:$scope.screenHeight, 
			camera: "back", 
			tapPhoto: false, 
			previewDrag: false, 
			toBack: true
		});

		$scope.camera.enabled = true;

		$timeout(function() {
			$scope.getSupportedPictureSizes();
		}, 1000);

		$cordovaToast.show('Camera Started', 'short', 'center');
	}



	$scope.getSupportedPictureSizes = function(){
		
		CameraPreview.getSupportedPictureSizes(function(dimensions){
			for (var i = 0; i < dimensions.length; i++) {
				$scope.imageResolutuions.supported.push(dimensions[i].width + 'x' + dimensions[i].height);

				if(dimensions[i].width > $scope.imageResolutuions.width){
					$scope.imageResolutuions.width = dimensions[i].width;
					$scope.imageResolutuions.height = dimensions[i].height;
				}
			}
		});
	}


	$scope.takePicture = function(){

		$ionicLoading.show({
			content: 'Hold On ...',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		CameraPreview.takePicture({width:$scope.imageResolutuions.width, height:$scope.imageResolutuions.height}, function(imgData){
			
			$scope.imageRaw = imgData;
			$scope.image = 'data:image/jpeg;base64,' + imgData;

			$scope.save.Open();
			
			$timeout(function() {
				$ionicLoading.hide();
			}, 320);
		});
	}


	$scope.saveImage = function(){
		var base64Blob = DataFactory.base64toBlob($scope.imageRaw, 'image/jpeg');
		var fileName = 'mmphotokit_'+$scope.productID+'_'+$scope.productView.type+'_'+$scope.stockCode+'_'+(new Date).getTime()+'.jpg';
	
		$cordovaFile.writeFile(cordova.file.externalDataDirectory+'PhotoKit/', fileName, base64Blob, true)
			.then(function(success){
				$cordovaToast
					.show('Image Saved!', 'long', 'center')
					.then(function(success){
						$scope.save.Close();
						$scope.updateViewPictureCount();
					});
			}, function(error){
				$cordovaToast.show('Saving Error!', 'long', 'center');
		});
	}


	$scope.tapFocus = function(e){
		/*console.log(e.x);
		console.log(e.y);
		CameraPreview.tapToFocus(e.x, e.y, function(success){
			alert('success: '+success)
		}, function(error){
			alert('error '+error)
		});*/
	}


	$scope.getProductDetails = function(){
		DataFactory.getProductDetails($scope.productID)
			.then(function(resp){
				$scope.productDetails = resp;
				$scope.changeView(0);

				$scope.updateViewPictureCount();
			}, function(error){
				alert(error);
			});
	}


	$scope.changeView = function(index){
		$scope.productView = $scope.productDetails.views[index];
		$scope.samples.image.image = $scope.productView.guide.image;
		$scope.samples.guide.image = $scope.productView.guide.lines;
		$scope.samples.guide.marker = $scope.productView.guide.marker;
		//console.log($scope.imagePath+$scope.samples.image.image)
	}


	$scope.updateViewPictureCount = function(){
		//Reset Count
		$scope.resetViewCount();

		DataFactory.getEntries(cordova.file.externalDataDirectory+'PhotoKit/')
			.then(function(resp){
				if(resp.length){
					_.each(resp, function(item){
						var _split = item.name.split('_'),
							_id = _split[1],
							_view = _split[2];

						if(item.isFile && _id == $scope.productID){
							_.each($scope.productDetails.views, function(_item){
								if(_item.type == _view){
									_item['count'] = ('count' in _item)? _item.count + 1 : 1;
								}
							});
						} 
					});
					//console.log(JSON.stringify($scope.productDetails.views, ' ', 4));
				}
			}, function(resp){
				alert(JSON.stringify(resp));
			});
	}


	$scope.resetViewCount = function(){
		_.each($scope.productDetails.views, function(_item){
			_item['count'] = 0;
		});
	}


	$scope.markerDrag = function(e){
		var x = e.gesture.center.pageX - 150;
			x = (x < 1)? 0 : (x > (window.screen.width - 300))? (window.screen.width - 300) : x;

		$timeout(function() {
			$scope.samples.marker.left = x;
		});
	}

	$scope.handleImageToggle = function(mode){
		if(mode){

			if($scope.camera.enabled){
				CameraPreview.hide();
				$scope.camera.enabled = false;
			} else {
				$scope.samples.image.enabled = false;
			
				CameraPreview.show();
				$scope.camera.enabled = true;
			}

		} else {
			$scope.samples.image.enabled = true;
		}
	}


	$scope.$on('$destroy', function() {
		CameraPreview.stopCamera();
		$scope.info.modal.remove();
		$scope.save.modal.remove();
	});


	//Init
	document.addEventListener('deviceready', function (){
		$scope.getProductDetails();
		$scope.info.Init();
		$scope.save.Init();

		$scope.imagePath = cordova.file.externalDataDirectory+'guides/';

		$timeout(function() {
			$scope.startCamera();
		}, 500);

		$cordovaFile.getFreeDiskSpace()
		      .then(function (success) {
		         $scope.deviceStorage = success+' KB'
		      }, function (error) {
		          alert(error);
		      });

		$cordovaFile.createDir(cordova.file.externalDataDirectory, 'PhotoKit', false); 
	});

}

