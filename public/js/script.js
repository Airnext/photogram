$(function(){

	// $('.bs-example-modal-sm').modal('show');

	var remove;

	$('#login_submit').click(function(){

		var error = $(this).data('content');
		console.log(error);

		if(error){
			$('#login_submit').popover('show')
		}
	})

	$('#search').keyup(function(){
		$("#type").text("You are searching...")
	})
	$('#search').keydown(function(){
		$("#type").text("")
	})

	setTimeout(function(){
		$('#login_submit').popover('destroy');
	},10000);

	var user = $('#user').data('id');
	var image_user = $('#img').data('user_id');

	if(user == image_user){
		$('#btn-delete').removeAttr('disabled');
	}

	setTimeout(function(){
		$('.alert-success').fadeOut(1000);
	}, 5000)

	$('#post-comment').hide();
	
	$('#btn-comment').click(function(){
		$('#post-comment').slideToggle(1000);
	});
	
	// $('#btn-like').click(function(event){
	// 	event.preventDefault();
		
	// 	var imgId = $(this).data('id');
		
	// 	$.post('/image/' + imgId + '/like').done(function(data){
	// 		$('.likes-count').text(data.likes);
	// 	});
	// });

	$('#btn-delete').click(function(event){
		event.preventDefault();
		var $this = $(this);
		
		var imgId = $(this).data('id');

		$('#bs-example-modal-lg').modal('show')

		$('#modal-response').click(function(){
			remove = true;
		
		 if(remove){
			console.log('This is Remove value: ' + remove);
			$.ajax({
				url:'/image/' + imgId,
				type:'DELETE'
			}).done(function(result){
				if(result){
					$this.removeClass('btn-danger').addClass('btn-success');
					$('#delete').removeClass('glyphicon-remove').addClass('glyphicon-ok');
					$('#delete').html('&nbsp;Deleted!');
					setTimeout(function(){
						location.href = '/logged';
					},2000);
				}
			});
		 }

		});
		
	});
});