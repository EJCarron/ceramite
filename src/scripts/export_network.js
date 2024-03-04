const mithril_request = require("../scripts/mithril_request")

function success_handler(data){
    var modal = document.getElementById("modal")
    var modal_btn = document.getElementById("modal_btn")
    var modal_message = document.getElementById("modal_message")


    modal_btn.onclick = function(){
        modal.style.display = "none"
    }

    modal_message.innerText = "export complete"

    modal.style.display = "block"

    window.location.href = '../../public/index.html';
}


function export_network_submit_btn_onclick(){

    const json_path = document.getElementById("json_path_input").value

    const save_csvs_path = document.getElementById("save_csvs_input").value
    const save_xlsx_path = document.getElementById("save_xlsx_input").value

    const save_neo4j = document.getElementById("save_neo4j_switch").checked
    const overwrite_neo4j = document.getElementById("overwrite_neo4j_switch").checked

    var request_body = {}

    if (json_path != "") {request_body['json_path'] = json_path}
    if (save_csvs_path != "") {request_body['save_csvs_path'] = save_csvs_path}
    if (save_xlsx_path != "") {request_body['save_xlsx_path'] = save_xlsx_path}
    if (save_neo4j) {request_body['save_neo4j'] = save_neo4j}
    if (overwrite_neo4j) {request_body['overwrite_neo4j'] = overwrite_neo4j}

    mithril_request.send_mithril_request(request_body=request_body, function_name="export_network", success_function=success_handler)

}

