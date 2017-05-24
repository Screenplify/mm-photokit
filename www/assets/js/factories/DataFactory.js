


angular
	.module(APP_NAME)
	.factory('DataFactory', ['$http', '$q', '$cordovaFile', '$rootScope', DataFactory]);


function DataFactory($http, $q, $cordovaFile, $rootScope){

	var factory = {};

		factory.getProducts = function(){
			var deferred = $q.defer();

			$cordovaFile
				.readAsText(cordova.file.externalDataDirectory, 'data.json')
				.then(function(data){
					deferred.resolve(JSON.parse(data));
				}, function (error) {
					deferred.reject('Error Reading "data.json"');
				}); 
			
			return deferred.promise;	
		}

		factory.getProductDetails = function(id){
			var deferred = $q.defer();

			$cordovaFile
				.readAsText(cordova.file.externalDataDirectory, 'data.json')
				.then(function(data){
					var item = _.find(JSON.parse(data), function(it){ return it.id == id; });
						deferred.resolve(item);
				}, function (error) {
					deferred.reject('Error Reading "data.json"');
				});

			return deferred.promise;
		}

		//https://www.airpair.com/ionic-framework/posts/ionic-file-browser-app -> deprecated:: resolveLocalFileSystemURI
		factory.getEntries = function(path){
			var deferred = $q.defer();
				
				window.resolveLocalFileSystemURL(path, function(fileSystem) {
					var directoryReader = fileSystem.createReader();
						directoryReader.readEntries(function(entries) {
							deferred.resolve(entries);
						}, function(error) {
							deferred.reject(error);
						});
				}, function(error) {
					deferred.reject(error);
				});

			return deferred.promise;
		}



		//https://forum.ionicframework.com/t/save-base64-jpg-to-file/53648/2
		factory.base64toBlob = function(base64Data, contentType) {
			contentType = contentType || '';

			var sliceSize = 1024;
			var byteCharacters = atob(base64Data);
			var bytesLength = byteCharacters.length;
			var slicesCount = Math.ceil(bytesLength / sliceSize);
			var byteArrays = new Array(slicesCount);

			for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
				var begin = sliceIndex * sliceSize;
				var end = Math.min(begin + sliceSize, bytesLength);

				var bytes = new Array(end - begin);
				
				for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
					bytes[i] = byteCharacters[offset].charCodeAt(0);
				}

				byteArrays[sliceIndex] = new Uint8Array(bytes);
			}

			return new Blob(byteArrays, { type: contentType });
		}

	return factory;
}