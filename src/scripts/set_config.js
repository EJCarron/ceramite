const mithril_request = require("../scripts/mithril_request")

function set_config_submit_btn_onclick(){
    const inputs = document.getElementsByClassName("set_config_input")

    var request_body = {}

    for (let i = 0; i < inputs.length; i++){
        request_body[inputs[i].id] = inputs[i].value != "" ?  inputs[i].value : inputs[i].placeholder 
    }

    response = mithril_request.send_mithril_request(request_body, "setconfig", mithril_request.handle_success)

}