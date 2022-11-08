let currentTime; // set global var
let postsLoaded = []; // set global array that contains all ads url to prevent an ads to appear multiple time
let automatic = true; // set global automatic scrapping feature
const urlParam = getUrlParameter('p');
const profile = (urlParam != null && profiles[urlParam] != null) ? profiles[urlParam] : profiles["jip"];
const excludedTermsInTitle = profile.excludedTermsInTitle; // terms to exclude, if one terms is found in the title, skip it
const excludedTermsInDescription = profile.excludedTermsInDescription; // terms to exlcude, if one terms is found in the description, skip it

const checkTimeAgo = (timestamp) => {
    let text = "Il y a "
    const timeDiff = (currentTime - new Date(timestamp));
    const diffMins = Math.floor((timeDiff / 60000));
    if(diffMins <= 1){
        return text += "environ une minute";
    } else {
        const diffHrs = Math.floor((diffMins / 60));
        if(diffHrs <= 0) {
            return text += diffMins + " minutes";
        } else {
            if(diffHrs == 1) {
                text += diffHrs + " heure";
            } else {
                text += diffHrs + " heures";
            }
            return text;
        }
    }
}

const generateFeedCheckboxes = (url, keyword, checked) => {
    const checkedString = (checked) ? "checked=\"checked\"" : "";
    return '<div class="checkbox-wrapper"><input type="checkbox" ' + checkedString + ' id="checkbox-' + keyword + '" class="search-checkbox" data-value="' + url + '" /><label title="' + url + '" for="checkbox-' + keyword + '" class="search-checkbox-label">' + keyword + '</label></div>';
}

const contains = (target, pattern) => {
    let hasBannedWord = false;
    pattern.forEach((word) => {
        if(target.includes(word)) hasBannedWord = true;
    });
    return hasBannedWord
}

const generatePosts = (jsondata, url) => {
    let html = '';
    if (/^[\],:{}\s]*$/.test(jsondata.replace(/\\["\\\/bfnrtu]/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
    //the json is ok
        console.log('json is ok');
        const json = JSON.parse(jsondata);
        const posts = json.channel.item;
        currentTime = new Date(json.channel.pubDate);
        for (let i = 0; i < json.channel.item.length; i++) {
            const jsonpost = json.channel.item[i];
            if(jsonpost.hasOwnProperty('guid')){
                if(postsLoaded.indexOf(jsonpost.guid) > -1) {// if the ads url is present in the array (so is the page already), stop the loop because it means that all ads below are already fetched
                    //
                } else if(contains(jsonpost.title.toLowerCase(), excludedTermsInTitle) || contains(jsonpost.description.toLowerCase(), excludedTermsInDescription)) {// if the ads title contains excluded terms, return
                    postsLoaded.push(jsonpost.guid);
                } else {
                    postsLoaded.push(jsonpost.guid);
                    html += '<a class="post new-post" target="_blank" href="' + jsonpost.guid + '" data-url="' + json.channel.feedurl["@attributes"].href + '" data-pubdate="' + (jsonpost.hasOwnProperty('pubDate') ? jsonpost.pubDate : 0) + '">';
                    html += '<picture class="post-img-wrapper">';
                    if(jsonpost.hasOwnProperty('enclosure')){
                        html += '<img class="post-img" src="' + jsonpost.enclosure["@attributes"].url + '" alt="thumbnail" />';
                    } else {
                        html += '<img class="post-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACgBAMAAAC70T6aAAAAJFBMVEXi5Of////q6+709fb4+Pn8/f3m5+r6+vvv8PLy8/Ts7vDo6uwrtZmBAAABQklEQVRo3u3XLU8DQRSF4WmB8mV6ge0CNRTJGjatwUHaBMsKfDENSQ0k1IODVWxqWgcEsZJWIPh1LAMhaci4uScpOY8Y+yYz5owhIiIiIiIiIiIiIj9K4rQ1b5Fzh8RjJDQOF4wwMv+RyzTSjzREEJEAcF1ZqB2xByAyQUQam4DI8w4isg2I3CEi2S4gEm8gInVA5KQGiFxXAZEEEZEzRORKP1KRY/3IOiJSlkP9yJo8IiK3+pEVRGRVnvQjC7KHiLzpRxalqx9ZFuMlEjQd4iKyJIAvdilARELjQ3nfKbLvom+CiBRTWJudwr68tsdp1DN/2JXqSyZfgpv2KI26WpFYvv20mqOXd9uyU9iXyjR/aJ0mMtPqHBWtYgp71pvm49ZAZtSNjv5HPvxt1Yyq/sH9sDOoGiIiIiIiIiIiIqL/7xO0DVmbxS8ErQAAAABJRU5ErkJggg==" alt="thumbnail" />';
                    }
                    html += '</picture>';
                    html += '<div class="post-text">';
                    if(jsonpost.hasOwnProperty('price')){
                        html += '<span class="post-price">' + parseInt(jsonpost.price, 10) + '$</span>';
                    }
                    if(jsonpost.hasOwnProperty('title')){
                        html += '<h2 class="post-title">' + jsonpost.title + '</h2>';
                    }
                    if(jsonpost.hasOwnProperty('pubDate')){
                        html += '<time class="post-date" data-pubdate="' + jsonpost.pubDate + '">' + checkTimeAgo(jsonpost.pubDate) + '</time>';
                    }
                    if(jsonpost.hasOwnProperty('description')){
                        html += '<p class="post-desc">' + jsonpost.description + '</p>';
                    }
                    html += '</div>';
                    html += '</a>';
                }
            }
        }
    } else {
        //the json is not ok
        console.log('json is NOT ok');
    }
    console.log('wwwww');
    $('#feed').removeClass('loading').prepend(html);
    setTimeout(() => { $('.post').removeClass('new-post') }, 100)
}
const gatherUrls = (nbPage = 0) => {
    let urls = [];
    if($('.search-field').val().includes("kijiji.ca/rss")) {
        urls.push($('.search-field').val());
    }
    $('.search-checkbox:checked').each(function(){
        urls.push($(this).attr('data-value'));
    });
    if(nbPage > 0) { // si on load un feed rss de page 2,3,4,...etc
        console.log('not 0');
        for(let i = 0; i < urls.length; i++){
            const urlValue = urls[i];
            const urlValueTrimmed = removeCharacter('https://', urlValue);
            let urlArray = urlValueTrimmed.split("/");
            urlArray.splice((urlArray.length-1), 0, ("page-"+nbPage));
            const urlsRebuild = 'https://';
            let urlsPaged = [];
            for(var k=0; k<urlArray.length; k++){
                urlsRebuild += urlArray[k] + "/";
            }
            console.log(urlsRebuild);
            urlsPaged.push(urlsRebuild);
        }
        urls = urlsPaged;
    }
    return urls;
}

const refreshPosts = (nbPage = 0) => {
    $('#feed').addClass('loading');
    const urls = gatherUrls(nbPage);
    for(let i = 0; i < urls.length; i++) {
        $.ajax({ // ajax call to load aditional ads to the feed
            cache: false,
            url: "fetchposts.php?rssurl=" + encodeURI(urls[i]),
            success: function(data) {
                generatePosts(data);
            }
        });
    }
    $('.post-date').each(function(){ // update time ago for each post
        $(this).html(checkTimeAgo($(this).attr('data-pubdate')));
    });
}

const sortPosts = () => {
    let posts = $('a.post');
    posts.sort(SortByPubDate);
    posts.each(function(index){
        $(this).css('order', index);
    })
}

const SortByPubDate = (a, b) => {
    const aName = new Date(a.getAttribute('data-pubdate')).getTime();
    const bName = new Date(b.getAttribute('data-pubdate')).getTime();
    return ((bName < aName) ? -1 : ((bName > aName) ? 1 : 0));
}

const writeCookie = (url, keyword, checked) => {
    if( Cookies.get('custom-rss-urls') == undefined ) {
        Cookies.set('custom-rss-urls', {"feed": []}, {expires: 365})
    }
    const customRssFeed = Cookies.getJSON('custom-rss-urls');
    customRssFeed.feed.push({"url":url, "keyword":keyword, "checked":true});
    console.log(customRssFeed);
    Cookies.set('custom-rss-urls', customRssFeed, {expires: 365});
}

const generateCustomRssUrls = () => {
    if( Cookies.get('custom-rss-urls') != undefined ) {
        const customRssFeed = Cookies.getJSON('custom-rss-urls');
        for(let i = 0; i < customRssFeed.feed.length; i++) {
            prependCheckboxes(customRssFeed.feed[i].url, customRssFeed.feed[i].keyword, customRssFeed.feed[i].checked);
        }
    }
}

const prependCheckboxes = (url, keyword, checked) => {
    $('#checkboxes').prepend( generateFeedCheckboxes(url, keyword, checked) );
}

$( document ).ready(function() {
    /*
        Append search checkboxes
    */
    let checkboxesMarkup = "";
    const feed = profile.feed;
    for(let i = 0; i < feed.length; i++) {
        let checked = false;
        if(feed[i].checked) checked = true;
        checkboxesMarkup += generateFeedCheckboxes(feed[i].url, feed[i].keyword, checked);
    }
    document.getElementById('checkboxes').innerHTML = checkboxesMarkup;
    
    $('.search-field').on('input', function() {
        $this = $(this);
        $searchFieldWrapper = $('.search-field-wrapper');
        if($this.val() != "") {
            $searchFieldWrapper.addClass('input-filled');
        } else {
            $searchFieldWrapper.removeClass('input-filled');
        }
    });
    $('.search-field-add').on('click', function() { // ajouter un feed rss dans les options et crée un cookie
        $this = $(this);
        $searchField = $('.search-field');
        $searchFieldsearchError = $('.search-field-error');
        const searchFieldldValueTrimmed = removeCharacter('https://', $searchField.val());
        if(searchFieldldValueTrimmed.includes("kijiji.ca/rss")) { // basic kijiji rss url validation
            const searchFieldldArray = searchFieldldValueTrimmed.split("/");
            const feedKeyword = decodeURIComponent(searchFieldldArray[3]);
            const feedUrl = decodeURI($searchField.val()).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            prependCheckboxes(feedUrl, feedKeyword, true); // ajoute le checkbox dans le DOM
            $searchField.val('');
            writeCookie(feedUrl, feedKeyword, true);
        } else {
            $searchFieldsearchError.addClass('show');
            setTimeout(() => { $searchFieldsearchError.removeClass('show'); }, 3000);
        }
    });
    $('.search-btn').click(function() {
        refreshPosts();
    });
    $('.sort-btn').click(function() {
        sortPosts();
    });
    generateCustomRssUrls();
    $('.search-btn').click(); // Init ads list
    setInterval(function(){ // call every 60sec
        if(automatic) $('.search-btn').click();
    }, 60000);
    $('.parameters-toggler').click(function() { // Open parameters options block
        $('#parameters, .parameters-toggler').toggleClass('opened');
    });
    $('#toggleCheckboxes').click(function() {
        $this = $(this);
        if($this.attr('data-toggle') == "on") {
            $this.attr('data-toggle', "off");
            $('.search-checkbox, #toggle-all').prop('checked', true);
        } else {
            $this.attr('data-toggle', "on");
            $('.search-checkbox, #toggle-all').prop('checked', false);
        }
    });
    $('.auto-toggler-btn').on('click', (function(){ // toggle automatic research
        automatic = !automatic;
        $(this).find('.light').toggleClass('active');
    }));

});