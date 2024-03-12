const mithril_request = require("../scripts/mithril_request")
const local_data = require("../scripts/local_data")
const modals = require("../scripts/modals")
const lock = require("../scripts/lock_screen")
const autocomplete = require("../scripts/autocomplete")

lock.lock_screen_functionality()

document.node_ids = {}

let freezeClic = false;

function fail_handler(){
    lock.unlock_screen(modals.close_modal)
    modals.error_modal()
}

function success_handler(data){
    lock.unlock_screen(modals.close_modal)

    var network = JSON.parse(data)

    var success = local_data.add_new_network(network)
    
    if (success){
        modals.show_modal('Success', function(){
            modal.style.display = "none"
            window.location.href = '../../public/index.html';
        })
    }else{
        modals.show_modal('FAILED TO SAVE NETWORK', modals.close_modal)
    }
}

function node_input_manual(){
    clear_node_input()
    var node_input = document.getElementById('node_input')
    autocomplete.autocomplete(node_input, [])
}

function get_radio_group_selected_value(radios){
    for (let i = 0 ; i < radios.length; i++){
        if (radios[i].checked == true){
            return radios[i].value
        }
    }

    return 'none selected'
}

function clear_node_input(){
    var node_input = document.getElementById('node_input')
    node_input.value = ''
}

function get_input_type(){
    var radios = document.getElementsByName('input_select')

    return get_radio_group_selected_value(radios)
}

function get_selected_node_type(){

    var radios = document.getElementsByName('node_type')

    return get_radio_group_selected_value(radios)

}

function node_type_change(){
    clear_node_input()
    if (get_input_type() == 'by_name'){
        node_input_lookup()
    }
}
function make_autofill_list(local_node_names_dict){

    var autofill_list = []

    for (const [node_id, node_name] of Object.entries(local_node_names_dict)){
        
        autofill_list.push((node_name + ' - ' + node_id))
    }

    return autofill_list
}

function node_input_lookup(){
    clear_node_input()
    var selected_node_type = get_selected_node_type()

    
    var local_node_names = local_data.get_node_names_of_type(selected_node_type)
    var autofill_list = make_autofill_list(local_node_names)
    
    var node_input = document.getElementById('node_input')

    
    autocomplete.autocomplete(node_input, autofill_list)
    

}

function add_core_node_btn_onclick(){
    var add_node_div = document.getElementById('add_core_node_div')

    add_node_div.style.visibility = 'visible'
}

function add_node_card(node_id, node_type){

    var node_cards_div = document.getElementById('core_nodes_div')

    var node_card = document.createElement('div')
    node_card.id = node_id + '_card'

    node_card.classList.add('card')
    node_card.classList.add('node_card')

    node_card.setAttribute('node_id', node_id)
    node_card.setAttribute('node_type', node_type)


    var node_card_container = document.createElement('div')
    node_card_container.classList.add('container')

    var id_text = document.createElement('p')
    id_text.innerText = node_id

    node_card_container.appendChild(id_text)

    var delete_btn = document.createElement('button')
    delete_btn.innerText = 'x'
    delete_btn.onclick = function(){
        document.getElementById(node_id + '_card').remove()
    }

    node_card_container.appendChild(delete_btn)

    node_card.appendChild(node_card_container)

    node_cards_div.appendChild(node_card)

}

function get_core_nodes(){

    var node_cards = document.getElementsByClassName('node_card')

    var core_nodes = []

    for (let i = 0; i < node_cards.length; i++){
        var node_card = node_cards[i]
        core_nodes.push({'node_type': node_card.getAttribute('node_type'), 'node_id': node_card.getAttribute('node_id')})
    }

    return core_nodes
}


function node_has_already_been_added(node_id){

    var core_nodes = get_core_nodes()


    for (const node of core_nodes){
        if(node['node_id'] === node_id){
            return true;
        }
    }

    return false;

}

function cancel_add_btn_onclick() {
    
    var add_node_div = document.getElementById('add_core_node_div')

    add_node_div.style.visibility = 'hidden'
    

}

function confirm_add_btn_onclick(){
    var node_input_value = document.getElementById('node_input').value

    if (node_input_value == ''){
        return
    }

    var node_type = get_selected_node_type()

    if (get_input_type() == 'by_name'){
        var node_id = node_input_value.split(' - ')[1]
    }else{
        var node_id = node_input_value
    }

    if (node_has_already_been_added(node_id)){
        return;
    }


    clear_node_input()
    add_node_card(node_id, node_type)
    
}


function create_network_submit_btn_onclick(){
    lock.lock_screen(modals.screen_locked_modal)

    const network_name = document.getElementById("name_input").value


    if (local_data.name_in_library(network_name)){
        lock.unlock_screen()
        modals.show_modal("Name already in use", modals.close_modal)
        return null;
    }

    const expands = countNum
    
    const save_csvs_path = document.getElementById("save_csvs_input").value
    const save_xlsx_path = document.getElementById("save_xlsx_input").value

    const save_neo4j = document.getElementById("save_neo4j_switch").checked
    const overwrite_neo4j = document.getElementById("overwrite_neo4j_switch").checked

    var request_body = {}

    if (network_name != "") {request_body['network_name'] = network_name}
    if (expands > 0){ request_body['expand'] = expands}
    if (save_csvs_path != "") {request_body['save_csvs_path'] = csvs_path}
    if (save_xlsx_path != "") {request_body['save_xlsx_path'] = xlsx_json_path}
    if (save_neo4j) {request_body['save_neo4j'] = save_neo4j}
    if (overwrite_neo4j) {request_body['overwrite_neo4j'] = overwrite_neo4j}

    request_body['core_nodes'] = get_core_nodes();

    mithril_request.send_mithril_request(request_body,"createnetwork", success_handler, fail_handler)
}