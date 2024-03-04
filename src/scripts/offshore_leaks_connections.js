const f = require("../scripts/mithril_request");

function search_ol_db_btn_onclick(){

    const json_path = document.getElementById("json_path_input").value;
    
    if (json_path != ""){
        f.send_mithril_request({"json_path": json_path}, "find_ol_connections", display_found_matches);
    };
};

// function compare_table_row_onclick (){
//     if(this.style.background-color == "" || this.style.background-color =="#f3f3f3") {
//         $(this).css('background', '#00987');
//     }
//     else {
//         $(this).css('background', "");
//     }

// };

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
    matched_to_cell.innerText = "Search Term"
    const potential_match_cell = header_row.insertCell();
    potential_match_cell.innerText = "Potential Match" 


    for (let i = 0; i < instructions["potentially_matched_nodes"].length; i++){
        var potentially_matched_node = instructions["potentially_matched_nodes"][i]

        const tr = new_table.insertRow();
        tr.setAttribute('selected', false)
        tr.setAttribute('match_id', potentially_matched_node["id"])
        
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
        cell_div.innerText = potentially_matched_node[instructions["match_attribute"]];
        const tool_tip = document.createElement('span')
        tool_tip.classList.add('tooltiptext')
        tool_tip.innerText = JSON.stringify(potentially_matched_node)
        

        cell_div.appendChild(tool_tip)


        td_potential.appendChild(cell_div)

    };


    compare_tables_div.appendChild(new_table)


};




function display_found_matches(data){
    document.getElementById("json_path_input").disabled = true


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
                "potentially_matched_nodes" : []
            };
        };
        create_tables_instructions[table_name]["potentially_matched_nodes"].push(db_match["values"]);
    }


    for (const [key, value] of Object.entries(create_tables_instructions)){
        create_compare_table(node_id=key, instructions=value, table_caption=key.replaceAll("_", " "));
    };
    

}


function success_handler(data){
    var modal = document.getElementById("modal")
    var modal_btn = document.getElementById("modal_btn")
    var modal_message = document.getElementById("modal_message")


    modal_btn.onclick = function(){
        modal.style.display = "none"
    }

    modal_message.innerText = "Offshore leaks nodes added to network"

    modal.style.display = "block"

    reset_page()

}

function reset_page(){

    document.getElementById("json_path_input").value = ""
    document.getElementById("json_path_input").disabled = false

    document.matches = []

    document.getElementById("compare_tabels_container").innerHTML = "";    

}


function add_selected_matched_btn_onclick(){
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

    var request_body = {"json_path" : document.getElementById("json_path_input").value,
                        "matches": selected_matches
}

    f.send_mithril_request(request_body=request_body, function_name="add_offshore_leak_connections_to_network",success_function=success_handler)



}