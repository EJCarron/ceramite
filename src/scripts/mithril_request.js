let $ = require('jquery');
Window.$ = $;

function handle_success(response){

    var modal = document.getElementById("modal")
var modal_btn = document.getElementById("modal_btn")
var modal_message = document.getElementById("modal_message")
}

modal_btn.onclick = function(){
    modal.style.display = "none"
}

    modal_message.innerText = "SUCCESS"

    modal.style.display = "block"


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

function send_mithril_request(request_body, function_name, success_function){
    var request_url = "http://127.0.0.1:5000/" + function_name

    $.ajax({type:"POST", url: request_url, contentType: "application/json; charset=utf-8"
    , data: JSON.stringify(request_body), success: success_function, error: handl_error})

}

function search_ol_db_btn_onclick(){

    const json_path = document.getElementById("json_path_input").value

    function display_found_matches(data){

    }


    if (json_path != ""){

        send_mithril_request({"json_path": json_path}, "find_ol_connections", display_found_matches)
    }
    


}

function create_network_submit_btn_onclick(){
    const choid_inputs = document.getElementsByClassName("choid_input")
    const chcn_inputs = document.getElementsByClassName("chcn_input")
    const olnid_inputs = document.getElementsByClassName("olnid_input")
    const same_as_inputs = document.getElementsByClassName("same_as_input")

    const expands = countNum

    const save_json_path = document.getElementById("save_json_input").value
    const save_csvs_path = document.getElementById("save_csvs_input").value
    const save_xlsx_path = document.getElementById("save_xlsx_input").value

    const save_neo4j = document.getElementById("save_neo4j_switch").checked
    const overwrite_neo4j = document.getElementById("overwrite_neo4j_switch").checked

    var request_body = {}

    if (expands > 0){ request_body['expand'] = expands}
    if (save_json_path != "") {request_body['save_json_path'] = save_json_path}
    if (save_csvs_path != "") {request_body['save_csvs_path'] = csvs_path}
    if (save_xlsx_path != "") {request_body['save_xlsx_path'] = xlsx_json_path}
    if (save_neo4j) {request_body['save_neo4j'] = save_neo4j}
    if (overwrite_neo4j) {request_body['overwrite_neo4j'] = overwrite_neo4j}

    function add_inputs_data_to_body(key, inputs){

        ids = []

        for (let i = 0; i < inputs.length; i++){
            if(inputs[i].value != ""){
                ids.push(inputs[i].value)
            }
        }

        if (ids.length > 0){
            request_body[key] = ids
        }
    }

    function add_same_as_relationships_data_to_body(inputs){

        relationships = []

        for (let i = 0; i < inputs.length; i++){
            if(inputs[i].value != ""){

                ids = inputs[i].value.split(",")

                if (ids.length = 2){
                    relationships.push({
                        "parent_node_id" : ids[0].trim(),
                        "child_node_id" : ids[1].trim()
                    })
                }

                
            }
        }

        if (relationships.length > 0){
            request_body['same_as'] = relationships
        }

    }

    add_inputs_data_to_body("ch_officer_ids", choid_inputs)
    add_inputs_data_to_body("ch_company_numbers", chcn_inputs)
    add_inputs_data_to_body("ol_node_ids", olnid_inputs)
    add_same_as_relationships_data_to_body(same_as_inputs)


    

    send_mithril_request(request_body,"createnetwork", handle_success)
}



function set_config_submit_btn_onclick(){
    const inputs = document.getElementsByClassName("set_config_input")

    var request_body = {}

    for (let i = 0; i < inputs.length; i++){
        request_body[inputs[i].id] = inputs[i].value != "" ?  inputs[i].value : inputs[i].placeholder 
    }

    


    


    response = send_mithril_request(request_body, "setconfig", handle_success)

}