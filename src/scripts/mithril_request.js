

let $ = require('jquery');
Window.$ = $;


function send_mithril_request(request_body, function_name, success_function, error_function){
    var request_url = "http://127.0.0.1:5000/" + function_name

    $.ajax({type:"POST", url: request_url, contentType: "application/json; charset=utf-8"
    , data: JSON.stringify(request_body), success: success_function, error: error_function})

}

module.exports = {
    send_mithril_request
};







