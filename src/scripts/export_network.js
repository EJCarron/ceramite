const mithril_request = require("../scripts/mithril_request")
const autocomplete = require("../scripts/autocomplete")
const local_data = require("../scripts/local_data")
const modals = require("../scripts/modals")
const lock = require("../scripts/lock_screen")

lock.lock_screen_functionality()

const network_names = local_data.get_network_name_list()

autocomplete.autocomplete(document.getElementById("networkNameInput"), network_names)


function fail_handler(){
    lock.unlock_screen(modals.close_modal)
    modals.error_modal()
}

function success_handler(data){
    lock.unlock_screen(modals.close_modal)

    modals.show_modal('export complete', function(){
        modal.style.display = "none"
        window.location.href = '../../public/index.html';
    })
}

function export_network_submit_btn_onclick(){

    lock.lock_screen(modals.screen_locked_modal)

    const network_name = document.getElementById('networkNameInput').value

    if (network_name == ""){
        modals.show_modal('NEED to select network name', modals.close_modal)
        return false;
    }

    const network = local_data.get_network(network_name)

    const save_csvs_path = document.getElementById("save_csvs_input").value
    const save_xlsx_path = document.getElementById("save_xlsx_input").value

    const save_neo4j = document.getElementById("save_neo4j_switch").checked
    const overwrite_neo4j = document.getElementById("overwrite_neo4j_switch").checked

    var request_body = {'network': network}

    
    if (save_csvs_path != "") {request_body['save_csvs_path'] = save_csvs_path}
    if (save_xlsx_path != "") {request_body['save_xlsx_path'] = save_xlsx_path}
    if (save_neo4j) {request_body['save_neo4j'] = save_neo4j}
    if (overwrite_neo4j) {request_body['overwrite_neo4j'] = overwrite_neo4j}

    mithril_request.send_mithril_request(
        request_body=request_body,
         function_name="export_network",
         success_function=success_handler,
         error_function=fail_handler
         )

}

