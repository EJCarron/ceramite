const f = require("../scripts/mithril_request");
const local_data = require("../scripts/local_data")
const modals = require("../scripts/modals")
const autocomplete = require("../scripts/autocomplete")

const network_names = local_data.get_network_name_list()

autocomplete.autocomplete(document.getElementById("networkNameInput"), network_names)

function search_btn_onclick(){

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
    error_function=modals.error_modal);
    
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
    potential_match_cell.innerText = "Potential Donor Match"
    const num_donations_cell = header_row.insertCell();
    num_donations_cell.innerText = "Number of Donations" 


    for (let i = 0; i < instructions["potentially_matched_groups"].length; i++){
        var potentially_matched_group = instructions["potentially_matched_groups"][i]

        const tr = new_table.insertRow();
        tr.setAttribute('selected', false)
        tr.setAttribute('group_key', potentially_matched_group["group_key"])
        
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
        cell_div.innerText = potentially_matched_group["group_key"];
        const tool_tip = document.createElement('span')
        tool_tip.classList.add('tooltiptext')
        tool_tip.innerText = JSON.stringify(potentially_matched_group)
        
        const td_num_hits = tr.insertCell();
        td_num_hits.innerText = potentially_matched_group['hits'].length 


        cell_div.appendChild(tool_tip)


        td_potential.appendChild(cell_div)

    };


    compare_tables_div.appendChild(new_table)


};




function display_found_matches(data){

    document.getElementById('networkNameInput').disabled = true;

    document.matches = data;

    var create_tables_instructions = {};
    for (let i = 0; i < data.length; i++){
        var db_match = data[i]

        var table_name = db_match["info"]["compare_node_id"] +"_"+ db_match["info"]["searched_by"] + "_"+ db_match["info"]["collection"]

        if (!Object.keys(create_tables_instructions).includes(table_name)){
            create_tables_instructions[table_name] = {
                "compare_node_id": db_match["info"]["compare_node_id"],
                "compare_node_name": db_match["info"]["compare_node_name"],
                "matched_to": db_match["info"]["matched_to"],
                "match_attribute": db_match["info"]['searched_by'],
                "potentially_matched_groups" : []
            };
        };
        create_tables_instructions[table_name]["potentially_matched_groups"].push(db_match["values"]);
    }


    for (const [key, value] of Object.entries(create_tables_instructions)){
        create_compare_table(node_id=key, instructions=value, table_caption=key.replaceAll("_", " "));
    };
    

}


function success_handler(data){

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
    const rows = document.getElementsByClassName("compare_table_row")

    var selected_group_keys = []
    for (let i = 0 ; i < rows.length; i++){
        if(rows[i].getAttribute("selected") == 'true'){
            selected_group_keys.push(rows[i].getAttribute('group_key'))
        }
    }

    var matches = document.matches
    var selected_matches = []
    for (let j = 0; j < matches.length; j++){
        if ( selected_group_keys.includes(matches[j]["values"]['group_key'])){
            var hits = matches[j]['values']['hits']
            for (let y = 0; y < hits.length; y++){

                var match = {'info': matches[j]['info'],
                'values': hits[y]['document']}
                selected_matches.push(match)
            }
        }
    }
    

    var request_body = {"network" : document.network,
                        "matches": selected_matches}


    f.send_mithril_request(request_body=request_body, function_name="add_electoral_commission_donation_connections_to_network",success_function=success_handler, error_function=modals.error_modal)



}