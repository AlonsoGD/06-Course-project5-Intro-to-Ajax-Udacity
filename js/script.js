$(document).ready(function() {
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
        var bgImgUrl = 'https://maps.googleapis.com/maps/api/streetview?size=' + bgImgSize + '&location=' + streetStr + ', ' + cityStr;

        // clear out old data before new request
        $wikiElem.text("");
        $nytElem.text("");
        
        // load streetview    
        $body.css('background-image', 'url("' + bgImgUrl + '")');
        
        $greeting.text('So, you want to live at ' + streetStr + ', ' + cityStr + '?');

        $.getJSON(nytUrl, 
            {
            'api-key': '027ce0de69ca4bb38a3a6192d9ea78ac',
            'q': cityStr,
            'fl': 'web_url,snippet,headline,document_type',
            'sort': 'newest'
            },            
            function(data) {
                $nytHeaderElem.text('New York Times Articles About ' + cityStr);
                var allArticles = data.response.docs;
                for (var i = 0; i < allArticles.length; i++) {
                    documentType = allArticles[i].document_type
                    if (documentType === 'article') {                  
                        $nytElem.append('<li class="list-group-item article"><a target="_blank" href="' + allArticles[i].web_url + '">' + allArticles[i].headline.main + '</a><p>' + allArticles[i].snippet + '</p></li>');
                    };
                }
            }
        ).fail(function() {
            $nytHeaderElem.addClass('alert alert-danger');
            $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
        });

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
                var allWikipediaLinks = data[3];
                var allWikipediaLinksTitles = data[1];
                for (var i = 0; i < allWikipediaLinks.length; i++) {
                    $wikiElem.append('<li class="list-group-item"><i class="fa fa-caret-right" aria-hidden="true"></i><a target="_blank" href="' + allWikipediaLinks[i] + '"> ' + allWikipediaLinksTitles[i] + '</a>');
                }
            }
        });

        // $.each(allArticles, function(index, web_url) {
            //     console.log(web_url);
            // });
        return false;
    };


$('#form-container').submit(loadData);
});