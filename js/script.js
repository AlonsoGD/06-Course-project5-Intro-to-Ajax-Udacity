$(document).ready(function() {
    var $dataToggletTooltip = $('[data-toggle="tooltip"]');
    
    function loadData() {

        var $body = $('body');
        var $wikiElem = $('#wikipedia-links');
        var $nytHeaderElem = $('#nytimes-header');
        var $nytElem = $('#nytimes-articles');
        var $greeting = $('#greeting');
        var nytUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
        var wikipediaUrl = 'https://en.wikipedia.org/w/api.php';
        var streetStr = $('#street').val();
        var cityStr = $('#city').val();
        var bgImgSize = '1920x1024';
        //var googleApiKey = 'AIzaSyC2fXiIK0d8mr0kncekHzSJSDnQMW8sv6Y';
        
        //var bgImgUrl = 'https://maps.googleapis.com/maps/api/streetview?key=' + googleApiKey + '&size=' + bgImgSize + '&location=' + streetStr + ', ' + cityStr;

        // clear out old data before new request
        $wikiElem.text("");
        $nytElem.text("");
        
        // Google streetview image background 
        //$body.append('<img src="' + bgImgUrl + '">');
        //$body.css('background-image', 'url("' + bgImgUrl + '")'); 
        $greeting.text('So, you want to live at ' + streetStr + ', ' + cityStr + '?');
        
        //Loading icons while waiting for the resquest resonse
        $wikiElem.html('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class=""> Loading...</span>');
        $nytElem.html('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class=""> Loading...</span>');

        //NYT API request for the articles with the location keyword
        $.getJSON(nytUrl, 
            {
            'api-key': 'c6XCqtyiQoxeUbCan4vvWxmmG5poEX7E',
            'q': cityStr,
            'fl': 'web_url,snippet,headline,document_type',
            'sort': 'newest'
            },            
            function(data) {
                $nytElem.html(""); //removes the loading icon
                $nytHeaderElem.text('New York Times Articles About ' + cityStr);
                var allArticles = data.response.docs;
                for (var i = 0; i < allArticles.length; i++) {
                    documentType = allArticles[i].document_type
                    if (documentType === 'article') {                  
                        $nytElem.hide().append('<li class="list-group-item article"><a target="_blank" href="' + allArticles[i].web_url + '">' + allArticles[i].headline.main + '</a><p>' + allArticles[i].snippet + '</p></li>').slideDown('slow');
                    };
                }
            }
        //NYT API Error handler
        ).fail(function() { 
            $nytHeaderElem.addClass('alert alert-danger');
            $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
        });

        //Wikipedia API error handler
        var wikipediaRequestTimeout = setTimeout(function() { 
            $wikiElem.addClass('alert alert-danger');
            $wikiElem.text("Failed to get Wikipedia resources");
        }, 4000);

        //Wikipedia API request for articles with the location keyword
        $.ajax({
            method: 'GET',
            url: wikipediaUrl,
            dataType: 'jsonp',
            data: {
                format: 'json',
                action: 'opensearch',
                search: cityStr,
                limit: 20,
            },
            success: function(data) {
                $wikiElem.html(""); //removes the loading icon
                var allWikipediaLinks = data[3];
                var allWikipediaLinksTitles = data[1];
                for (var i = 0; i < allWikipediaLinks.length; i++) {
                    $wikiElem.hide().append('<li class="list-group-item"><i class="fa fa-caret-right" aria-hidden="true"></i><a target="_blank" href="' + allWikipediaLinks[i] + '"> ' + allWikipediaLinksTitles[i] + '</a>').slideDown('slow');
                };
                
            clearTimeout(wikipediaRequestTimeout);
            }
        });

        return false;
    };
        
    $('#form-container').submit(loadData);
    $dataToggletTooltip.tooltip();
});