let $ = require('jquery');
Window.$ = $;

function handle_success(response){

    var modal = document.getElementById("modal")
    var modal_btn = document.getElementById("modal_btn")
    var modal_message = document.getElementById("modal_message")


    modal_btn.onclick = function(){
        modal.style.display = "none"
    }

    modal_message.innerText = "SUCCESS"

    modal.style.display = "block"

}
function handl_error(reponse){
    var modal = document.getElementById("modal")
    var modal_btn = document.getElementById("modal_btn")
    var modal_message = document.getElementById("modal_message")

    modal_btn.onclick = function(){
        modal.style.display = "none"
    }

        modal_message.innerText = "Fail"

        modal.style.display = "block"

    
}

function send_mithril_request(request_body, function_name, success_function=handle_success){
    var request_url = "http://127.0.0.1:5000/" + function_name

    $.ajax({type:"POST", url: request_url, contentType: "application/json; charset=utf-8"
    , data: JSON.stringify(request_body), success: success_function, error: handl_error})

}


module.exports = {
    send_mithril_request,
    handl_error,
    handle_success
};







