// API at http://dev.markitondemand.com/#stockquote

$.ajax({
    dataType:'jsonp',
    url:'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=MSFT',
    success:function(data) {
        $('h1').html(data.Name);
    }
});