slideNum = 0;
var audioPlayer = new Audio(),
	loadCocktail = '',
	percentage = 0,
	_shakeTimer = null;

$('#choose').live('pagecreate', function(){
	audioPlayer.src="audio/shake.mp3";
	audioPlayer.load();
	audioPlayer.addEventListener('canplaythrough',function(){
		audioPlayer.loaded = true;
	},false)

	$('.slider-inner', this).slideCarousel({
		duration:500,
		btn_prev:'.btn-prev',
		btn_next:'.btn-next'
	});
	$('#choose-link, .slider-inner a', this).click(function(){
		if (audioPlayer.loaded) audioPlayer.pause();
		loadCocktail = $('.slider-inner a').eq(slideNum).attr('rel');
	});
});

$('#shake').live('pageshow', function(){
	var shaker = document.getElementById('shaker');
	var percentageObj = $('.percentage').text('0%');
	var context = shaker.getContext('2d');
	
	context.clearRect(0,0,320,300);
	drawBackground(context);
	drawShaker(context);
	drawForeground(context);
	
	percentage = 0;
	
	//create a new instance of WKShake.
	var myShakeEvent = new WKShake();
	myShakeEvent.start();
	myShakeEvent.inert = 0;
	myShakeEvent.shakeEventDidOccur = shake;

	function shake(){
		if (percentage >= 100) return false;
		
		if (audioPlayer.loaded) {
			if (audioPlayer.currentTime > 5 ) {
				audioPlayer.pause();
				audioPlayer.currentTime = 0;
			}
			audioPlayer.play();
		}
		
		myShakeEvent.inert = 0;
		
		if (_shakeTimer) return false;
		
		_shakeTimer = setTimeout(function(){
			percentage += 5;
			percentageObj.text(percentage+'%');
			if (percentage >= 100) {
				percentageObj.text('100%');
				if (audioPlayer.loaded) audioPlayer.pause();
				myShakeEvent.stop();
				$.mobile.changePage(loadCocktail);
			}
			myShakeEvent.inert = myShakeEvent.inert + 1;
			if ( myShakeEvent.inert < 3 ) setTimeout(arguments.callee, 500);
			else {
				if (audioPlayer.loaded) {
					audioPlayer.pause();
					audioPlayer.currentTime = 0;
				}
				_shakeTimer = null;
			}
		},500);
	}
});

(function() {
	function WKShake(threshold) {
		//default velocity threshold for shake to register
		this.threshold = 10;
		//use date to prevent multiple shakes firing			
		this.lastTime = new Date();		
		//user defined threshold option
		if (typeof threshold == 'object') {
			this.threshold = threshold;
		}
	}
	//start listening for devicemotion
	WKShake.prototype.start = function() {
		this.lastTime = new Date();
		this.lastX = null;
		this.lastY = null;
		this.lastZ = null;
		var self = this;
		if (('ondevicemotion' in window)) {
			window.addEventListener('devicemotion', function(event){ self.devicemotion.call(self, event)}, false);
		}
	};
	//stop listening for devicemotion
	WKShake.prototype.stop = function() {
		if (('ondevicemotion' in window)) {
			window.removeEventListener('devicemotion', this, false);
		}
		this.lastTime = new Date();
		this.lastX = null;
		this.lastY = null;
		this.lastZ = null;
	};

	//calculates if shake did occur
	WKShake.prototype.devicemotion = function(e) {
		var current = e.accelerationIncludingGravity;
		if((this.lastX !== null) || (this.lastY !== null) || (this.lastZ !== null)) {
			var deltaX = Math.abs(this.lastX - current.x),
				deltaY = Math.abs(this.lastY - current.y),
				deltaZ = Math.abs(this.lastZ - current.z);	
			if(((deltaX > this.threshold) && (deltaY > this.threshold)) || 
		   	((deltaX > this.threshold) && (deltaZ > this.threshold)) || 
		   	((deltaY > this.threshold) && (deltaZ > this.threshold))) {
				//calculate time in milliseconds since last shake registered
				var currentTime = new Date(),
					timeDifference = currentTime.getTime() - this.lastTime.getTime();
				if (timeDifference > 150) {
					this.shakeEventDidOccur();	
					this.lastTime = new Date();		
				}
			}
		}
		this.lastX = current.x;
		this.lastY = current.y;
		this.lastZ = current.z;	
	};
	//callback method will be implemented by user
	WKShake.prototype.shakeEventDidOccur = function() {
	};
	//event handler
	WKShake.prototype.handleEvent = function(e) {
		if (typeof(this[e.type]) === 'function' ) {
			return this[e.type](e);
		}
	};
	//public function
	window.WKShake = WKShake;
})();

var gradArr = ['#a4a4a6', '#afafaf', '#a4a4a4', '#6c6c6b', '#181918', '#0f100f', '#2e2720', '#4a3c2f', '#585144', '#64635e', '#757776', '#7d7e7c', '#626364', '#555757', '#4c4d4c', '#494b49', '#494b49', '#949391', '#eeedeb', '#f9f8f6', '#f4f3f1', '#f9faf8', '#e6e7e5', '#dededb', '#f9f8f5', '#f4f2f3', '#ebe9ea', '#eff0ef', '#dadbd7', '#f5f4f2', '#f7f6f4', '#f3f2f0', '#dadad9', '#c9c9ca', '#bdbfc0', '#cbcdce', '#dfdede', '#d6d5d6', '#d2d0d2', '#a0a2a6', '#656b6e', '#818685', '#8e8e8e', '#7b7b7b', '#686a68', '#454746', '#373a38', '#2c2d2c', '#272827', '#191919', '#101010', '#181818', '#161617', '#191b1d', '#343537', '#4d5052', '#626766', '#a8a9aa', '#fcf9fa', '#f9f6f5', '#f7f7f4', '#f8f7f5', '#f8f7f5', '#f8f7f5', '#f8f7f5', '#f8f7f5', '#f8f7f5', '#f7f6f4', '#f7f5f2', '#ffffff', '#9e9f9f', '#242526', '#191919', '#191918', '#1b1b1b', '#191919', '#1a1a1a', '#505051', '#a4a4a4', '#a9a9a7', '#afafad', '#b5b5b3', '#b5b5b3', '#bdbdbb', '#c1c1bf', '#c4c4c2', '#c2c2c0', '#c1c1bf', '#c8c8c6', '#81807e', '#313130', '#363737', '#9ea2a1', '#e9edec', '#717373', '#171717', '#121313', '#3b3f3e', '#393d3c', '#34383f', '#34383f'];
function createGrad(grad){
	for (var i in gradArr){
		grad.addColorStop(i/100, gradArr[i]);
	}
}
function drawShaker(context){
	var topGrad = context.createLinearGradient(110, 20, 210, 20);
	topGrad.addColorStop(0, '#c1c3c3');
	topGrad.addColorStop(1, '#dfe0e2');
	context.fillStyle = topGrad;
	context.lineWidth = 1;

	context.beginPath();
	context.moveTo(110, 20);
	context.bezierCurveTo(120, 10, 200, 10, 210, 20);
	context.bezierCurveTo(200, 30, 120, 30, 110, 20);
	context.fill();

	context.strokeStyle = 'rgba(0, 0, 0, 0.6)';

	context.beginPath();
	context.moveTo(210, 20);
	context.bezierCurveTo(200, 30, 120, 30, 110, 20);
	context.stroke();

	var addGrad = context.createLinearGradient(112, 85, 208, 85);
	createGrad(addGrad);

	context.fillStyle = addGrad;
	context.beginPath();
	context.rect(112, 85, 96, 15);
	context.fill();

	var mainGrad = context.createLinearGradient(110, 20, 210, 20);
	createGrad(mainGrad);
	context.fillStyle = mainGrad;

	context.beginPath();
	context.moveTo(110, 20);
	context.bezierCurveTo(120, 30, 200, 30, 210, 20);
	context.lineTo(210, 85);
	context.bezierCurveTo(200, 95, 120, 95, 110, 85);
	context.fill();

	context.beginPath();
	context.moveTo(110, 90);
	context.bezierCurveTo(120, 100, 200, 100, 210, 90);
	context.lineTo(210, 280);
	context.bezierCurveTo(200, 290, 120, 290, 110, 280);
	context.fill();

	context.strokeStyle = 'rgba(0, 0, 0, 0.5)';

	context.beginPath();
	context.moveTo(110, 85);
	context.bezierCurveTo(120, 95, 200, 95, 210, 85);
	context.stroke();

	context.strokeStyle = 'rgba(0, 0, 0, 0.2)';

	context.beginPath();
	context.moveTo(110, 90);
	context.bezierCurveTo(120, 100, 200, 100, 210, 90);
	context.stroke();

	context.strokeStyle = 'rgba(0, 0, 0, 1)';

	context.beginPath();
	context.moveTo(110, 280);
	context.bezierCurveTo(120, 290, 200, 290, 210, 280);
	context.stroke();
}
function drawForeground(context){
	context.beginPath();
	context.fillStyle = "#299751";
	context.moveTo(37,32);
	context.bezierCurveTo(45,30,67,36,72,44);  
	context.bezierCurveTo(69,48,45,43,37,35);  
	context.fill();

	context.strokeStyle = '#45f885';
	context.lineWidth = 9;
	context.lineCap = 'round';

	context.beginPath();
	context.moveTo(38, 50);
	context.lineTo(71, 65);
	context.stroke();

	context.lineWidth = 8;

	context.beginPath();
	context.moveTo(71, 65);
	context.lineTo(100, 95);
	context.stroke();

	context.lineWidth = 7;

	context.beginPath();
	context.moveTo(100, 95);
	context.lineTo(118, 100);
	context.stroke();

	context.fillStyle = '#f2efec';

	context.beginPath();
	context.moveTo(31, 63);
	context.lineTo(39, 80);
	context.lineTo(33, 100);
	context.lineTo(18, 102);
	context.lineTo(31, 63);
	context.lineTo(31, 74);
	context.lineTo(24, 96);
	context.lineTo(32, 97);
	context.lineTo(37, 82);
	context.lineTo(31, 75);
	context.fill();

	context.fillStyle = '#fd3850';

	context.beginPath();
	context.moveTo(64,123);
	context.bezierCurveTo(66, 117, 78, 117, 80, 123);
	context.bezierCurveTo(78, 129, 66, 129, 64, 123);
	context.fill();

	context.fillStyle = '#fe4c61';

	context.beginPath();
	context.moveTo(72, 137);
	context.lineTo(95, 152);
	context.lineTo(89, 156);
	context.lineTo(65, 139);
	context.fill();

	context.beginPath();
	context.moveTo(105, 156);
	context.lineTo(136, 159);
	context.lineTo(138, 166);
	context.lineTo(105, 162);
	context.fill();

	var greenPinkGrad = context.createLinearGradient(78, 165, 78, 194);
	greenPinkGrad.addColorStop(0, '#48f487');
	greenPinkGrad.addColorStop(1, '#f024e5');
	context.fillStyle = greenPinkGrad;

	context.beginPath();
	context.moveTo(78, 165);
	context.lineTo(96, 167);
	context.quadraticCurveTo(99, 168, 96, 170);
	context.lineTo(34, 194);
	context.quadraticCurveTo(29, 194, 32, 191);
	context.fill();

	context.fillStyle = '#6d78b2';

	context.beginPath();
	context.moveTo(45, 226);
	context.lineTo(75, 218);
	context.lineTo(85, 222);
	context.fill();

	context.strokeStyle = '#6372a9';
	context.lineWidth = 2;

	context.beginPath();
	context.moveTo(216, 27);
	context.bezierCurveTo(244, 28, 258, 65, 240, 73);
	context.stroke();

	context.strokeStyle = '#fd3850';
	context.lineWidth = 2;

	context.beginPath();
	context.moveTo(170, 78);
	context.lineTo(289, 26);
	context.stroke();

	context.strokeStyle = '#9dbfff';

	context.beginPath();
	context.moveTo(274, 43);
	context.lineTo(280, 62);
	context.stroke();

	context.lineWidth = 1;

	context.beginPath();
	context.moveTo(280, 62);
	context.lineTo(247, 102);
	context.stroke();

	var yellowOrangeGrad = context.createLinearGradient(259, 100, 259, 124);
	yellowOrangeGrad.addColorStop(0, '#ffd400');
	yellowOrangeGrad.addColorStop(0.5, '#ffd400');
	yellowOrangeGrad.addColorStop(1, '#ff8800');
	context.fillStyle = yellowOrangeGrad;

	context.beginPath();
	context.arc(259, 117, 7, 0, Math.PI * 2, true);
	context.fill();

	context.fillStyle = '#f2efec';

	context.beginPath();
	context.moveTo(250, 135);
	context.lineTo(267, 143);
	context.lineTo(230, 166);
	context.lineTo(234, 145);
	context.lineTo(250, 135);
	context.lineTo(250, 139);
	context.lineTo(237, 146);
	context.lineTo(237, 156);
	context.lineTo(257, 144);
	context.lineTo(250, 139);
	context.fill();

	var pinkOrangeGrad = context.createLinearGradient(237, 129, 237, 149);
	pinkOrangeGrad.addColorStop(0, '#fe4bf2');
	pinkOrangeGrad.addColorStop(1, '#ffb107');
	context.fillStyle = pinkOrangeGrad;

	context.beginPath();
	context.arc(237, 139, 10, 0, Math.PI * 2, true);
	context.fill();

	context.strokeStyle = '#004e7f';
	context.lineWidth = 10;
	context.lineCap = 'butt';

	context.beginPath();
	context.arc(246, 182, 18, Math.PI / -4, 5 * Math.PI / -4, false);
	context.stroke();

	context.fillStyle = '#62ecea';

	context.beginPath();
	context.moveTo(229, 207);
	context.lineTo(242, 214);
	context.lineTo(251, 223);
	context.lineTo(239, 221);
	context.lineTo(226, 211);
	context.quadraticCurveTo(223, 205, 229, 207);
	context.fill();

	context.fillStyle = '#fd3850';

	context.beginPath();
	context.moveTo(222, 230);
	context.lineTo(278, 276);
	context.lineTo(273, 280);
	context.fill();
}
function drawBackground(context){
	context.fillStyle = '#bdbfca';

	context.beginPath();
	context.moveTo(92, 38);
	context.lineTo(103, 57);
	context.lineTo(84, 46);
	context.fill();

	var orangeGrad = context.createLinearGradient(79, 21, 75, 52);
	orangeGrad.addColorStop(0, '#ffd500');
	orangeGrad.addColorStop(1, '#fc8401');
	context.fillStyle = orangeGrad;

	context.beginPath();
	context.moveTo(92, 38);
	context.lineTo(94, 48);
	context.lineTo(84, 46);
	context.lineTo(75, 52);
	context.lineTo(74, 41);
	context.lineTo(66, 36);
	context.lineTo(75, 31);
	context.lineTo(78, 21);
	context.lineTo(85, 29);
	context.lineTo(96, 29);
	context.fill();

	context.fillStyle = '#ff9d00';

	context.beginPath();
	context.moveTo(17, 120);
	context.lineTo(56, 94);
	context.lineTo(97, 112);
	context.lineTo(110, 100);
	context.lineTo(112, 108);
	context.lineTo(100, 122);
	context.lineTo(66, 111);
	context.lineTo(36, 139);
	context.lineTo(17, 126);
	context.fill();

	context.fillStyle = '#fff331';

	context.beginPath();
	context.moveTo(17, 120);
	context.lineTo(56, 94);
	context.lineTo(97, 112);
	context.lineTo(110, 100);
	context.lineTo(112, 108);
	context.lineTo(100, 119);
	context.lineTo(66, 108);
	context.lineTo(36, 133);
	context.fill();

	context.fillStyle = '#2a9ea8';

	context.beginPath();
	context.moveTo(49, 104);
	context.lineTo(142, 171);
	context.lineTo(48, 113);
	context.fill();

	context.fillStyle = '#ffd544';

	context.beginPath();
	context.moveTo(75, 187);
	context.lineTo(148, 205);
	context.lineTo(145, 216);
	context.lineTo(73, 198);
	context.fill();

	context.strokeStyle = '#ff4a5e';
	context.lineWidth = 2;

	context.beginPath();
	context.moveTo(190, 207);
	context.lineTo(52, 274);
	context.stroke();

	context.strokeStyle = '#bdbfca';
	context.lineWidth = 4;

	context.beginPath();
	context.moveTo(91, 269);
	context.quadraticCurveTo(55, 280, 60, 239);
	context.stroke();

	context.fillStyle = '#62ecea';

	context.beginPath();
	context.moveTo(256, 51);
	context.lineTo(261, 62);
	context.lineTo(241, 96);
	context.lineTo(220, 95);
	context.lineTo(215, 111);
	context.lineTo(212, 107);
	context.lineTo(217, 90);
	context.lineTo(237, 89);
	context.fill();

	context.fillStyle = '#3eff83';

	context.beginPath();
	context.moveTo(206, 159);
	context.lineTo(289, 182);
	context.lineTo(282, 199);
	context.fill();

	context.fillStyle = '#28ca62';

	context.beginPath();
	context.moveTo(206, 159);
	context.lineTo(279, 187);
	context.lineTo(282, 199);
	context.fill();

	context.fillStyle = '#e5fffb';

	context.beginPath();
	context.moveTo(289, 182);
	context.lineTo(279, 187);
	context.lineTo(282, 199);
	context.lineTo(291, 192);
	context.fill();

	context.fillStyle = '#b6fff4';

	context.beginPath();
	context.moveTo(279, 187);
	context.lineTo(282, 199);
	context.lineTo(291, 192);
	context.fill();

	context.fillStyle = '#fd3850';

	context.beginPath();
	context.moveTo(199, 216);
	context.lineTo(207, 223);
	context.lineTo(225, 246);
	context.fill();
}


