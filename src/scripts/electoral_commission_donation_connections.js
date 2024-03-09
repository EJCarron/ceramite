const f = require("../scripts/mithril_request");
const local_data = require("../scripts/local_data")
const modals = require("../scripts/modals")
const autocomplete = require("../scripts/autocomplete")
const lock = require("../scripts/lock_screen")

lock.lock_screen_functionality()

const network_names = local_data.get_network_name_list()

autocomplete.autocomplete(document.getElementById("networkNameInput"), network_names)


function fail_handler(){
    lock.unlock_screen(modals.close_modal)
    modals.error_modal()
}

function search_btn_onclick(){
    lock.lock_screen(modals.screen_locked_modal)

    const network_name = document.getElementById('networkNameInput').value

    if (network_name == ""){
        modals.show_modal('NEED to select network name', modals.close_modal)
        return false;
    }

    const network = local_data.get_network(network_name)
    
    document.network = network

    f.send_mithril_request(request_body={"network": network}, 
    function_name="find_electoral_commission_donation_connections", 
    success_functiopn=display_found_matches, 
    error_function=fail_handler);
    
};

function create_compare_table(node_id, instructions, table_caption){
    var compare_tables_div = document.getElementById("compare_tabels_container");
        
    var new_table = document.createElement("table");


    new_table.setAttribute("class", "compare-table")

    let caption = new_table.createCaption();
    caption.textContent = table_caption;


    new_table.id = (node_id + "_table");
    new_table.class = "compare_table";

    const header_row = new_table.insertRow();
    const matched_to_cell = header_row.insertCell();
    matched_to_cell.innerText = "Your network node search term"
    const potential_match_cell = header_row.insertCell();
    potential_match_cell.innerText = "Potential Match"
    

    for (let i = 0; i < instructions["hits"].length; i++){
        var hit = instructions["hits"][i]

        const tr = new_table.insertRow();
        tr.setAttribute('selected', false)
        tr.setAttribute('match_id', hit["id"])
        
        tr.classList.add("compare_table_row")

        tr.onclick = function(){
            tr.classList.toggle("active-row")

            if (tr.getAttribute('selected') == "true"){
                tr.setAttribute('selected', false)
            }else{
                tr.setAttribute('selected', true)
            }
        }
        const td_match_attr = tr.insertCell();
        td_match_attr.innerText = instructions['matched_to'] 

        const td_potential = tr.insertCell();

        const cell_div = document.createElement('div')
        cell_div.classList.add('tooltip')
        cell_div.innerText = hit["name"];
        const tool_tip = document.createElement('span')
        tool_tip.classList.add('tooltiptext')
        tool_tip.innerText = JSON.stringify(hit)

        cell_div.appendChild(tool_tip)


        td_potential.appendChild(cell_div)

    };


    compare_tables_div.appendChild(new_table)


};




function display_found_matches(data){

    lock.unlock_screen(modals.close_modal)

    document.getElementById('networkNameInput').disabled = true;

    document.matches = data;

    var create_tables_instructions = {};
    for (let i = 0; i < data.length; i++){
        var db_match = data[i]

        var table_name = db_match["info"]["compare_node_name"] +"_"+ db_match["info"]["searched_by"] + "_"+ db_match["info"]["collection"]

        if (!Object.keys(create_tables_instructions).includes(table_name)){
            create_tables_instructions[table_name] = {
                "compare_node_id": db_match["info"]["compare_node_id"],
                "compare_node_name": db_match["info"]["compare_node_name"],
                "matched_to": db_match["info"]["matched_to"],
                "match_attribute": db_match["info"]['searched_by'],
                "hits" : []
            };
        };
        create_tables_instructions[table_name]['hits'].push(db_match["values"]);
    }


    for (const [key, value] of Object.entries(create_tables_instructions)){
        create_compare_table(node_id=key, instructions=value, table_caption=key.replaceAll("_", " "));
    };
    

}


function success_handler(data){

    lock.unlock_screen(modals.close_modal)

    var network = JSON.parse(data)

    var success = local_data.update_existing_network(network)

    if (success){
        modals.show_modal("Electoral Commission Donations added to network", modals.close_modal)
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
                        "matches": selected_matches}

    f.send_mithril_request(request_body=request_body, 
        function_name="add_electoral_commission_donation_connections_to_network",
        success_function=success_handler, 
        error_function=modals.fail_handler)



}