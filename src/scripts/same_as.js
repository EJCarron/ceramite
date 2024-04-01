const mithril_request = require("../scripts/mithril_request")
const autocomplete = require("../scripts/autocomplete")
const local_data = require("../scripts/local_data")
const modals = require("../scripts/modals")
const render_network = require("../scripts/render_network_selectable")
const lock = require("../scripts/lock_screen")

lock.lock_screen_functionality()

const network_names = local_data.get_network_name_list()

autocomplete.autocomplete(document.getElementById("networkNameInput"), network_names)

let freezeClic = false;

function fail_handler(){
    lock.unlock_screen(modals.close_modal)
    modals.error_modal()
}

function fail_handler(){
    lock.unlock_screen(modals.close_modal)
    modals.error_modal()
}

function select_network_btn_onclick(){

    var network_name = document.getElementById('networkNameInput').value;

    if (network_name != ""){
        var network = local_data.get_network(network_name)
        document.network = network
        if (network == null){
            modals.show_modal("No such network in library", modals.close_modal)
        }else{
            render_network.render_network_selectable(network, document.getElementById('network_div'), disable_expanded=false)
        }
    }
}

function reset_page (){
    document.network = null;
    document.getElementById('network_div').innerHTML = '';
}

function success_handler(data){
    lock.unlock_screen(modals.close_modal)
    reset_page()

    var network = JSON.parse(data)

    var success = local_data.update_existing_network(network)

    if (success){
        modals.show_modal("Connections made", modals.close_modal)
    }else{
        modals.show_modal('FAILED TO SAVE NETWORK', modals.close_modal)
    }
}


function make_connection_btn_onclick(){
    lock.lock_screen(modals.screen_locked_modal)

    const rows = document.getElementsByClassName("node_table_row")

    var selected_node_ids = []
    for (let i = 0 ; i < rows.length; i++){
        if(rows[i].getAttribute("selected") == 'true'){
            selected_node_ids.push(rows[i].getAttribute('node_id'))
        }
    }

    mithril_request.send_mithril_request(request_body = 
        {'network': document.network, 'node_ids': selected_node_ids}, function_name = 'make_same_as_connections',
    success_function = success_handler, error_function = fail_handler
    )
}