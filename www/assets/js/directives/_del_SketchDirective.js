//http://perfectionkills.com/exploring-canvas-drawing-techniques/
//http://www.html5canvastutorials.com/tutorials/html5-canvas-lines/
//http://stackoverflow.com/questions/8461716/adding-ids-to-raphael-objects
//http://stackoverflow.com/questions/9047600/how-to-determine-the-direction-on-onmousemove-event

angular
	.module(APP_NAME)
	.directive('sketch', ['$timeout', fnSketch]);


function fnSketch($timeout){
	return {
		restrict: 'A',
		scope: {
			width: '=',
			height: '=',
			color: '=',
			returnPaths: '=syncPaths'
		},
		link: function(scope, element, attrs){
			var _guid = 'ui-sketch-'+Math.floor(50*Math.random())+""+(new Date).getTime();
			var guideStyle = {
					'stroke': '#000',
					'stroke-width': '1.5',
					'stroke-opacity':.5,
					'stroke-dasharray': '5,5' 
				}


			function bindSketch(){
				$(document).ready(function($) {

					element.attr('id', _guid);

					var offset = $(element).offset();
					var paper = Raphael(_guid);
					/*var isDrawing,
						isStraight,
						isDirection;
					var startX,
						startY,
						endX,
						endY,
						direction,
						helpLine;
					var last_position = {}	

					var guideH = paper.path(["M", 0, 10, "L", parseInt(scope.width), 10 ]);
						guideH.attr(guideStyle);	
						guideH.attr('class', 'guideLines glH');	
					
					var guideV = paper.path(["M", 10, 0, "L", 10, parseInt(scope.height) ]);
						guideV.attr(guideStyle);		
						guideV.attr('class', 'guideLines glV');*/


					if(scope.returnPaths.length){
						for (var i = 0; i < scope.returnPaths.length; i++) {
							var _pdata = scope.returnPaths[i];
							drawPath(_pdata);
						}
					}			


					/*element.on('touchdown', function(e){
						if(isDrawing){
							//endX = (e.clientX - offset.left);
							//endY = (e.clientY - offset.top);

							var _pid = 'ui-path-'+Math.floor(50*Math.random())+""+(new Date).getTime(),
								_obj = {sx: startX, sy: startY, ex: endX, ey: endY, color: scope.color, id: _pid};

							$timeout(function() {
								drawPath(_obj);	
								scope.returnPaths.push(_obj);
							});	

							if(!angular.isUndefined(helpLine)) helpLine.remove(); 	

							isDrawing = false;	
						} else {
							startX = (e.clientX - offset.left);
							startY = (e.clientY - offset.top);

							// var circle = paper.circle(startX, startY, 5);
							// 	circle.attr(dotStyle);

							isDrawing = true;	
						}	
					});*/


					/*lement.on('mousemove', function(e){
						endX = (e.clientX - offset.left);
						endY = (e.clientY - offset.top);
						isStraight = e.shiftKey;

						//Trigger Direction Process
						processDirection(e);

						//Set Direction
						isDirection = (isStraight)? isDirection : direction;
						
						if(isDrawing){
							//Remove is Exist
							if(!angular.isUndefined(helpLine)) helpLine.remove();

							//Set to Straighten
							if(isStraight && (isDirection == 'right' || isDirection == 'left')) endY = startY;
							if(isStraight && (isDirection == 'up' || isDirection == 'down')) endX = startX;

							//Draw the Helpline
							helpLine = paper.path(["M", startX, startY, "L", endX, endY ]); 
							helpLine.attr('stroke', scope.color);
							helpLine.attr('stroke-width', '2');
						}

						//Move the Guidelines
						moveGuideV(endX);
						moveGuideH(endY); 
					});*/


					/*scope.$on('ACTION-UNDO', function(e){
						var _last = scope.returnPaths.pop();

						if(_last){
							var _path = paper.getById(_last.id);
								_path.remove();
						}
					});


					scope.$on('ACTION-HIGHLIGHT', function(e, data){
						var _class = (data.mode == 'start')? 'path-anim' : '';
						var _path = paper.getById(data.id);
							_path.attr('class', _class);
					});*/


					function drawPath(data){
						var newLine = paper.path(["M", data.sx, data.sy, "L", data.ex, data.ey ]);
							newLine.attr('stroke', data.color);
							newLine.attr('stroke-width', '2');
							newLine.id = data.id;
					}
/*
					function processDirection(event) {
						if (typeof(last_position.x) != 'undefined') {

							var deltaX = last_position.x - event.clientX,
								deltaY = last_position.y - event.clientY;

							if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
								direction = 'left';
							} else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
								direction = 'right';
							} else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
								direction = 'up';
							} else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
								direction = 'down';
							}
						}

						last_position = {
							x : event.clientX,
							y : event.clientY
						};
					}*/

					/*function moveGuideV(x){
						guideV.animate({path: [["M", x, 0], ["L", x, parseInt(scope.height)]]}, 0);
					}

					function moveGuideH(y){
						guideH.animate({path: [["M", 0, y], ["L", parseInt(scope.width), y]]}, 0);
					}*/

				});
			}

			$timeout(function(){
				bindSketch();
			}, 0);
			
		}
	}
}