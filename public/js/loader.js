var socket = io.connect('/');

socket.on('message', function (data) {

	data = JSON.parse(data);

	$('.likes-count').text(data.likes);
	
});

$(function(){

	$('#btn-like').click(function(){

		var imgId = $('#btn-like').data('id');
			
		$.post('/image/' + imgId + '/like').done(function(data){
			var packet = {
				likes: data.likes,
				type:'userLikes'
			}

			socket.send(JSON.stringify(packet));
		});
	
	});
	
});

