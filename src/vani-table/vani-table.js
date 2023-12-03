import {getTableColumns} from "./table-columns";


export function createTable(containerId){

    // safety check
    if(!containerId){
        throw new Error("no table container id provided!")
    }
    const tableContainerRef = document.querySelector(`#${containerId}`)
    if(!tableContainerRef){
        throw new Error("table container not found")
    }

    // create table and append to the container
    const table = document.createElement('table');
    table.classList = [
        'w-full',
        'p-8',
    ].join(' ');
    
    
    // initialize column headers
    const headerRow = document.createElement('tr')
    getTableColumns().map(element => {
        const th = document.createElement('th');
        th.innerHTML = element.title;
        th.setAttribute('data-column-header', element.column);
        th.classList = [
            'border'
        ].join(" ");
        headerRow.appendChild(th);
    });
    headerRow.classList = [
        'bg-slate-100',
        'py-4'
    ].join(' ');
    table.appendChild(headerRow)
    
    tableContainerRef.appendChild(table)

}

export function populateTable(refId,data){
    const tableRef = document.querySelector(`#${refId}`)
    let tbody = tableRef.querySelector('tbody');
    
    if(tbody){
        tbody.innerHTML = '';
    } else {
        tbody = document.createElement('tbody');
    }

    const pageData = data;
    const fragment = new DocumentFragment();
    
    pageData.forEach(row => {
        const tr = document.createElement('tr');
        Object.keys(row).forEach(cell => {
            if(cell !== 'id'){

                const td = document.createElement('td');
                td.textContent = row[cell];
                tr.appendChild(td);
                td.classList = [
                    'border',
                    'px-4'
                ].join(' ')
            }
        });
        fragment.appendChild(tr);
    });
    tbody.appendChild(fragment);
    tableRef.appendChild(tbody)
}