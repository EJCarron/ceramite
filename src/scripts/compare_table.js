
function get_same_as_relationships(){

    var relationships = document.network['relationships']

    var same_as_relationships = []

    for (let i = 0; i < relationships.length ; i++){

        if (relationships[i]['relationship_type'] == 'SameAs'){
            same_as_relationships.push(relationships[i])
        }

    }

    return same_as_relationships;

}


function is_match_already_in_network(match){

    var same_as_relationships = get_same_as_relationships()


    for (let i = 0; i < same_as_relationships.length; i++){

        var relationship = same_as_relationships[i]

        if ((match['info']['node_id'] == relationship['parent_id'] && match['values']['node_id'] == relationship['child_id']) ||
        (match['info']['node_id'] == relationship['child_id'] && match['values']['node_id'] == relationship['parent_id'])
        ){
            return true;
        }


    }

    return false;



}


function render_ranked_match_table(matches){
    var compare_tables_div = document.getElementById("compare_tabels_container");
        
    var new_table = document.createElement("table");


    new_table.setAttribute("class", "compare-table")

    new_table.id = ("compare_table");
    new_table.class = "compare_table";

    const header_row = new_table.insertRow();
    const node_name_cell = header_row.insertCell();
    node_name_cell.innerText = 'Node Name'
    const node_type_cell = header_row.insertCell();
    node_type_cell.innerText = 'Node Type'
    const node_search_attr_cell = header_row.insertCell();
    node_search_attr_cell.innerText = "Node Search Attribute"
    const potential_match_cell = header_row.insertCell();
    potential_match_cell.innerText = "Potential Match" 


    for (let i = 0; i < matches.length; i++){
        var potentially_matched_node = matches[i]

        const tr = new_table.insertRow();
        tr.setAttribute('selected', false)
        tr.setAttribute('match_id', potentially_matched_node['values']["id"])
        
        tr.classList.add("compare_table_row")

        if (is_match_already_in_network(potentially_matched_node)){
            tr.classList.toggle("disabled-row")
        }else{

            tr.onclick = function(){
                tr.classList.toggle("active-row")

                if (tr.getAttribute('selected') == "true"){
                    tr.setAttribute('selected', false)
                }else{
                    tr.setAttribute('selected', true)
                }
            }
        }

        const td_node_name = tr.insertCell();
        td_node_name.innerText = potentially_matched_node['info']['node_name']


        const td_node_type = tr.insertCell();
        td_node_type.innerText = potentially_matched_node['info']['node_type']

        const td_node_search_attr = tr.insertCell();
        td_node_search_attr.innerText = potentially_matched_node['info']['params']['q']

        const td_potential = tr.insertCell();

        const cell_div = document.createElement('div')
        cell_div.classList.add('tooltip')
        cell_div.innerText = potentially_matched_node['values'][potentially_matched_node['info']['params']['query_by']];
        const tool_tip = document.createElement('span')
        tool_tip.classList.add('tooltiptext')
        tool_tip.innerText = JSON.stringify(potentially_matched_node)
        

        cell_div.appendChild(tool_tip)


        td_potential.appendChild(cell_div)

    };


    compare_tables_div.appendChild(new_table)   
}
module.exports = {render_ranked_match_table}