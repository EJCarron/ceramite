const f = require("../scripts/mithril_request");
const local_data = require("../scripts/local_data")
const modals = require("../scripts/modals")
const autocomplete = require("../scripts/autocomplete")
const lock = require("../scripts/lock_screen")
const compare_table = require("../scripts/compare_table")

lock.lock_screen_functionality()

let freezeClic = false;

const network_names = local_data.get_network_name_list()

autocomplete.autocomplete(document.getElementById("networkNameInput"), network_names)


function fail_handler(){
    lock.unlock_screen(modals.close_modal)
    modals.error_modal()
}

function search_ol_db_btn_onclick(){
    
    lock.lock_screen(modals.screen_locked_modal)

    const network_name = document.getElementById('networkNameInput').value

    if (network_name == ""){
        modals.show_modal('NEED to select network name', modals.close_modal)
        return false;
    }

    const network = local_data.get_network(network_name)
    
    document.network = network

    f.send_mithril_request(request_body={"network": network}, 
    function_name="find_ol_connections", 
    success_functiopn=display_found_matches, 
    error_function=fail_handler);
    
};

function display_found_matches(data){
    lock.unlock_screen(modals.close_modal)

    document.getElementById('networkNameInput').disabled = true;

    document.matches = data;

    compare_table.render_ranked_match_table(data)

}


function success_handler(data){
    lock.unlock_screen(modals.close_modal)

    var network = JSON.parse(data)

    var success = local_data.update_existing_network(network)

    if (success){
        modals.show_modal("Offshore leaks nodes added to network", modals.close_modal)
    }else{
        modals.show_modal('FAILED TO SAVE NETWORK', modals.close_modal)
    }

    reset_page()

}

function reset_page(){

    document.getElementById("networkNameInput").value = ""
    document.getElementById("networkNameInput").disabled = false

    document.matches = []
    document.network = null

    document.getElementById("compare_tabels_container").innerHTML = "";    

}


function add_selected_matched_btn_onclick(){
    lock.lock_screen(modals.screen_locked_modal)
    const rows = document.getElementsByClassName("compare_table_row")

    var selected_match_ids = []
    for (let i = 0 ; i < rows.length; i++){
        if(rows[i].getAttribute("selected") == 'true'){
            selected_match_ids.push(rows[i].getAttribute('match_id'))
        }
    }

    var matches = document.matches
    var selected_matches = []
    for (let j = 0; j < matches.length; j++){
        if ( selected_match_ids.includes(matches[j]["values"]['id'])){
            selected_matches.push(matches[j])
        }
    }

    var request_body = {"network" : document.network,
                        "matches": selected_matches
}

    f.send_mithril_request(request_body=request_body, 
        function_name="add_offshore_leak_connections_to_network",
        success_function=success_handler, 
        error_function=fail_handler)



}