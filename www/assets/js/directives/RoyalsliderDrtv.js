

angular
	.module(APP_NAME)
	.directive('royalSlider', RoyalSlider);


function RoyalSlider($timeout){
	return {
		restrict: 'E',
		scope: {
			ngModel: '=',
			ngSettings: '='
		},
		template: function(){
			var template = '<div class="royalslider rsDefault">';
					template +='<div ng-repeat="item in ngModel">';
						template +=' <img ng-if="item.type != \'video\'" class="rsImg" ng-src="{{item.image}}" />';
						template +=' <img ng-if="item.type == \'video\'" class="rsImg" ng-src="{{item.image}}" data-rsVideo="{{item.link}}" />';
					template +='</div>';
				template +='</div>';

			return template;		
		},
		link: function(scope, element, attrs){

			function bindUI(){

				console.log(scope.ngModel);
				console.log(scope.ngSettings);
				scope.rSlider = null;
				scope.rsID = null;

				$(document).ready(function($) {
					
					var defaults = {
							imageScaleMode: 'fill',
							controlNavigation: 'none',
							arrowsNav: false,
							loop: true,
							loopRewind: true,
							transitionType: 'move',
							keyboardNavEnabled: true,
							navigateByClick: false
						},
						settings = (angular.isUndefined(scope.ngSettings))? defaults : angular.extend(defaults, scope.ngSettings);
						
					var $slider = $(element).find('.royalslider');

						$slider.css({
							'position': 'absolute',
							'top': 0,
							'right': 0,
							'left': 0,
							'bottom': 0,
							'width': '100%',
							'height': '100%',
							//'z-index': '-1'
						});

						if(!angular.isUndefined(scope.ngModel)){
							$slider.royalSlider(settings);

							scope.rSlider = $slider.data("royalSlider"); 
							scope.rsID = 'player_'+Math.floor(50*Math.random())+""+(new Date).getTime();

							//Assaigning Custom Player
							scope.rSlider.ev.on('rsOnCreateVideoElement', function(e, url){
								//console.log(url);    

								this.videoObj = $('<div id="'+scope.rsID+'" class="rsVideoObj"></div>');
								
								setTimeout(function() {
									fnCreateFlowplayerVideo(scope.rsID, url, scope.rSlider, function(sliderObj){
										//Video end time is comming in with the JSON so no need to handle once the video ends
										//alert('Is here!!')
										
										if (sliderObj.st.autoPlay.enabled){
											sliderObj.next();
											sliderObj.startAutoPlay();
										} 	

									});
								}, 50);
							});

							//http://help.dimsemenov.com/discussions/problems/26298-automatically-start-playing-video
							var playRoyalSliderVideo = function(){ 

								if(scope.rSlider.currSlide && typeof(scope.rSlider.currSlide.videoURL) !== 'undefined'){
									setTimeout(function() {
								    	scope.rSlider.playVideo(); 
									}, 500);
							    }
							}

							scope.rSlider.ev.on('rsAfterSlideChange', playRoyalSliderVideo);

							//Autoplay when slider Loads for First Item
							playRoyalSliderVideo();
						}
				});

			}

			$timeout(function(){
				bindUI();
			}, 50);


			function fnCreateFlowplayerVideo(id, url, sliderObj, callback){
				console.log('Video To Create: '+url)
				var finished = false;
				var randomId = id;
				var video = $("<video autoplay webkit-playsinline type=\"video/mp4\"></video>");
					video .attr('id', 'vp_'+randomId);
					video .attr('src', url);
				var overlay = $('<div></div>');
					overlay.css({
						'position': 'absolute',
			            'top': '0', 'left': '0', 'right': '0', 'bottom': '0',
			            'width': '100%', 'height': '100%',
			            'z-index': '9999'
					})	;


				$("#"+randomId)
					.addClass('rsFlowplayer flowplayer fixed-controls no-mute no-time no-volume no-hover')// is-splash
					.append(video)
					.append(overlay);

				var aud = document.getElementById('vp_'+randomId);
					aud.onended = function() {
					    //alert("The video has ended");
					    if (typeof callback == 'function'){
		  					callback(sliderObj);
		  				} 
					};	

					
				/*	//.append(playBtn)
				$("#"+randomId).flowplayer({
						fullscreen: false,
						ratio: 9/16,
						tooltip: false,
						embed: false
					});


				//https://flowplayer.org/docs/setup.html
				var api = $("#"+randomId).data("flowplayer");
					api.bind('finish', function(e){
						if(!finished){
							finished = true;
			  				alert('video finished');
			  				if (typeof callback == 'function'){
			  					callback(sliderObj);
			  				} 
						}
						return false;
					});	
*/
				return false;
			}

			
		}
	}
}