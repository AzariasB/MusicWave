/* 
 Created on : 12 déc. 2015, 10:58:27
 Author     : boutina
 */
import $ from 'jquery';
import './less/style.less';

$(document).ready(function() {
	//Genearl configs
	var fps = 60;

	//Audio var
	var audioElem = document.getElementById('audio');
	var audioCtx = new AudioContext();
	var analyser = audioCtx.createAnalyser();
	var source, frequenceData;

	//Canvas var
	var canvas = document.getElementById('c');
	var run = true;

	var w = (canvas.width = window.innerWidth);
	var h = (canvas.height = window.innerHeight);

	var ctx = canvas.getContext('2d');

	var pxls = [];
	var fov = 100;

	function init() {
		//Init array
		for (var x = -160; x < 160; x += 5) {
			for (var z = -250; z < 250; z += 5) {
				pxls.push({ x: x, y: 60, z: z });
			}
		}

		//Init audio listener
		loadAudio();

		//Init loop
		//        render();
	}

	function loadAudio() {
		audioElem.addEventListener('canplay', function() {
			source = audioCtx.createMediaElementSource(audioElem);
			source.connect(analyser);
			analyser.connect(audioCtx.destination);

			analyser.fftSize = 128;

			frequenceData = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(frequenceData);

			//Launch rendering
			render();
		});
	}

	function render() {
		schedule(render);
		if (run) {
			//Audio processing
			analyser.getByteFrequencyData(frequenceData);

			//Canvas rendering
			ctx.clearRect(0, 0, w, h);
			var imgData = ctx.getImageData(0, 0, w, h);
			var l = pxls.length;
			while (l--) {
				var px = pxls[l];

				var freqY = Math.round((pxls.length - l) / 100) - 1;
				px.y = frequenceData[freqY - 1];

				var scale = fov / (fov + px.z);

				var x2d = px.x * scale + w / 2;
				var y2d = px.y * scale + h / 2;

				if (x2d >= 0 && x2d <= w && y2d >= 0 && y2d <= h) {
					var c = (Math.round(y2d) * imgData.width + Math.round(x2d)) * 4;

					imgData.data[c] = imgData.data[c + 2] = 0;
					imgData.data[c + 1] = imgData.data[c + 3] = 255;
				}

				px.z--;
				if (px.z < -fov) px.z += 2 * fov;
			}

			ctx.putImageData(imgData, 0, 0);
		}
	}

	function schedule(callback) {
		setTimeout(function() {
			requestAnimationFrame(callback);
		}, 1000 / fps);
	}

	init();
});
