(function($) {

    function getLocation(position) {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        const coords = [lat, lng];
        $.ajax({
            url: 'https://api.yelp.com/v3/businesses/search',
            type: 'GET',
            beforeSend: function(xhr){xhr.setRequestHeader('Bearer', 'xdxekdQFNmWtSJak4pjq30yjNyydowXC-KaJ4FUw1H4MqdYU7RDaQpb5Oj3mfkMzuYq9AUa2-f794VztEYhFt9uwsGZQoqLmStfyutlyLAfwJhAyAiI1F5jPp6kEXHYx');},
            success: function() { alert('Success!') }
        });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLocation);
    } else {
        console.log('forbidden')
    }

})(window.jQuery);