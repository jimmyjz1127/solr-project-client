var server_url = "http://localhost:5050/solr"


onloadFunctions = async () => {
    await getAllCores();
}

/**
 * Obtains all the cores from Solr server
 */
getAllCores = () => {
    let requestString = '/admin/cores?action=STATUS&wt=json';
    
    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', server_url + requestString);
    // xhr.onload = function() {
    //     if (xhr.status == 200) {
    //         console.log(xhr.responseText);
    //     } else {
    //         console.error(xhr.status);
    //     }
    // }

    // xhr.send();

    $.ajax({
        url:server_url + requestString,
        dataType:'jsonp',
        jsonp:'json.wrf',
        success: function(res){
            console.log(res)
        },
        error : function(err) {
            console.error(err)
        }
    });
}
    


/**
 * Sends Solr query to server for result retrieval 
 * @param {*} strUrl : the Solr query url 
 */
function xmlHttpPost(strUrl){
    var xmlHttpReq = false;
    var self = this;

    if (window.XMLHttpRequest) { // Mozilla/Safari
        self.xmlHttpReq = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) { // IE
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }

    self.xmlHttpReq.open('POST', strURL, true);
    self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    self.xmlHttpReq.onreadystatechange = function() {
        if (self.xmlHttpReq.readyState == 4) {
            updatepage(self.xmlHttpReq.responseText);
        }
    }

    var params = getstandardargs().concat(getquerystring());
    var strData = params.join('&');
    self.xmlHttpReq.send(strData);

    console.log(strData)
}

function getstandardargs() {
    var params = [
        'wt=json'
        , 'indent=on'
        , 'hl=true'
        , 'hl.fl=name,features'
        ];

    return params;
}
function getquerystring() {
    var form = document.forms['f1'];
    var query = form.query.value;
    qstr = 'q=' + escape(query);
    return qstr;
}

// this function does all the work of parsing the solr response and updating the page.
function updatepage(str){
    document.getElementById("raw").innerHTML = str;
    var rsp = eval("("+str+")"); // use eval to parse Solr's JSON response
    var html= "<br>numFound=" + rsp.response.numFound;
    var first = rsp.response.docs[0];
    html += "<br>product name="+ first.name;
    var hl=rsp.highlighting[first.id];
    if (hl.name != null) { html += "<br>name highlighted: " + hl.name[0]; }
    if (hl.features != null) { html += "<br>features highligted: " + hl.features[0]; }
    document.getElementById("result").innerHTML = html;
}