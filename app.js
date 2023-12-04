import { createTable, populateTable } from './src/vani-table/vani-table';
import DataSource from './src/dataSource/dataSource';

import './style.css'
import { addToArray, debounce, readURLData, writeURLData } from './src/core/utilities';

const ITEMS_PER_PAGE = 10;
const TABLE_CONTAINER_ID = 'vani-table';
const JSON_FILE_LOCATION = './assets/records.json';

const dataSource = new DataSource(JSON_FILE_LOCATION, ITEMS_PER_PAGE);
const totalNumberOfItemsContainer = document.querySelector("#total-items-container");
const totalPagesContainer = document.querySelector("#total-page-number-container");

let currentPage = Number(sessionStorage.getItem("pageNumber")) ?? 1;
let isDescending = true;

createTable(TABLE_CONTAINER_ID);

setCurrentPage(currentPage)

updateTable()

const sortBtn = document.querySelector("#change-sort");
sortBtn.addEventListener('click', function(e){
    
    debounce(
        ()=>{

            isDescending = !isDescending;
            const sortOrder = isDescending ? 'desc' : 'asc';
            writeURLData([`sort=${sortOrder}`])
            updateTable()

        },100
    )()

    
})

// paginator events
const prevPage = document.querySelector("#paginator_pre_btn");
prevPage.addEventListener('click', function(e){
    if(currentPage > 1){
    currentPage -= 1;
    
    writeURLData([`page=${currentPage}`])
    updateTable()

    dataSource.filterData(searchColumn, searchTerm)
        .then(
            (res)=>{
            dataSource.paginateFromData(currentPage,res)
                .then( page => { populateTable(TABLE_CONTAINER_ID, page); })
            }
        )
        setCurrentPage(currentPage)

    }    
})


dataSource.paginate(currentPage).then(res=>{  
  populateTable(TABLE_CONTAINER_ID, res )
})

const nextPage = document.querySelector("#paginator_next_btn");
nextPage.addEventListener('click', function(){
  

    currentPage += 1 ;

    writeURLData([`page=${currentPage}`])
    updateTable()


})



const nameSearchInput = document.querySelector('#filter-input-name');
nameSearchInput.addEventListener("input", (evnt)=>{
    debounce(()=>{

    currentPage = 1;
    writeURLData([`page=${currentPage}`,`name=${evnt.target.value}`])
    updateTable()
    
    },
    1000)()

})

const adDateSearchInput = document.querySelector('#filter-input-date');
adDateSearchInput.addEventListener("input", (evnt)=>{
  debounce(()=>{

    currentPage = 1;
    writeURLData([`page=${currentPage}`,`date=${evnt.target.value}`])
    updateTable()

  },
  1000)()
})

const adTitleSearchInput = document.querySelector('#filter-input-title');
adTitleSearchInput.addEventListener("input", (evnt)=>{
    
  debounce(()=>{

    currentPage = 1;
    writeURLData([`page=${currentPage}`,`title=${evnt.target.value}`])
    updateTable()

  },
  1000)()
})

function setCurrentPage(pageNumber){

    sessionStorage.removeItem('pageNumber');
    sessionStorage.setItem('pageNumber',currentPage);

    const containerRef = document.querySelector("#page-number-container");
    containerRef.innerHTML=currentPage.toString()
}


function updateTable(){

    let page, name, date, title, sort = undefined;
    const searchArray = [];
    
    debounce(
        ()=>{
            page = readURLData('page');
            name = readURLData('name');
            date = readURLData('date');
            title = readURLData('title');
            sort = readURLData('sort');
            

            addToArray({
                field : 'name',
                value : name } ,
                searchArray,
                3);
            addToArray({
                field : 'date',
                value : date } ,
                searchArray,
                3);
            addToArray({
                field : 'title',
                value : title } ,
                searchArray,
                3);
                
            if(name||date||title){
                    
                dataSource.filterDataMultiple(searchArray,sort )
                    .then(
                    (res)=>{

                        debugger

                        dataSource.getTotalPageNumber(res).then(pages=>{
                            totalPagesContainer.innerHTML = pages.toString();
                        });

                        dataSource.getTotalItemsNumber(res).then(records=>{
                            totalNumberOfItemsContainer.innerHTML = records.toString();
                        })

                        dataSource.paginateFromData(page,res)
                        .then(pagedata=>{populateTable(TABLE_CONTAINER_ID,pagedata);})
                        }
                    )
            } else {
                dataSource.sortData(sort).then(
                    res=>{

                        dataSource.getTotalPageNumber(res).then(pages=>{
                            totalPagesContainer.innerHTML = pages.toString();
                        });

                        dataSource.getTotalItemsNumber(res).then(records=>{
                            totalNumberOfItemsContainer.innerHTML = records.toString();
                        })

                        dataSource.paginateFromData(page,res)
                        .then(pagedata=>{populateTable(TABLE_CONTAINER_ID,pagedata);})
                    }
                )
            }



        },
        500
    )()


}
