$(function () {
	$('#name').on('keydown keyup change', function () {
		var newref = '/battle/?key=' + $('#name').val();
		$('#lin').attr('href', newref);
		console.log('lad');
	});
});