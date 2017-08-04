(function(){
	var a = document.getElementsByTagName('body'),
			b = document.createElement('p');
	b.className = "item";
	b.innerHTML = 'some text';
	a[0].appendChild(b);

	console.log(a);
}());

$(function(){
	//$('body').fadeOut();
});