import { createTable, populateTable } from './src/vani-table/vani-table';
import DataSource from './src/dataSource/dataSource';

import './style.css'
import { debounce } from './src/core/utilities';

const ITEMS_PER_PAGE = 10;
const TABLE_CONTAINER_ID = 'vani-table';
const JSON_FILE_LOCATION = './assets/records.json';

let searchTerm = '';
let searchColumn = '';
let currentPage = Number(sessionStorage.getItem("pageNumber")) ?? 1;
const dataSource = new DataSource(JSON_FILE_LOCATION, ITEMS_PER_PAGE);

createTable(TABLE_CONTAINER_ID);

dataSource.paginate(currentPage).then(res=>{  
  populateTable(TABLE_CONTAINER_ID, res )
})

// paginator events
const prevPage = document.querySelector("#paginator_pre_btn");
prevPage.addEventListener('click', function(e){
  console.log('searchTerm', searchTerm)

    if(currentPage > 1){
      
      currentPage -= 1;

      // dataSource.filterData( searchColumn, searchTerm)
      // .then(
      //   (res)=>{
      //     dataSource.paginateFromData(1,res)
      //       .then( page => { populateTable(TABLE_CONTAINER_ID, page); })
      //   }
      // )

      dataSource.paginate(currentPage).then(res=>{  
        populateTable(TABLE_CONTAINER_ID, res )
      })
      
      sessionStorage.removeItem('pageNumber');
      sessionStorage.setItem('pageNumber',currentPage);
      console.log('currentPage', currentPage)
    }    
  
})

const nextPage = document.querySelector("#paginator_next_btn");
nextPage.addEventListener('click', function(){
  
  currentPage += 1 ;

  dataSource.paginate(currentPage).then(res=>{  
    populateTable(TABLE_CONTAINER_ID, res )
  })

  sessionStorage.removeItem('pageNumber');
  sessionStorage.setItem('pageNumber',currentPage);
  console.log('currentPage', currentPage)
})

const nameSearchInput = document.querySelector('#filter-input-name');
nameSearchInput.addEventListener("input", (evnt)=>{
  debounce(()=>{
    dataSource.filterData('name', evnt.target.value)
    .then(
      (res)=>{
          searchTerm = evnt.target.value;
          searchColumn = 'name';
          currentPage = 0;
          
          sessionStorage.removeItem('pageNumber');
          sessionStorage.setItem('pageNumber',currentPage);

          dataSource.paginateFromData(1,res)
            .then(page=>{populateTable(TABLE_CONTAINER_ID,page);})
        }
      )
  },
  1000)()
})

const adDateSearchInput = document.querySelector('#filter-input-date');
adDateSearchInput.addEventListener("input", (evnt)=>{
  debounce(()=>{
    dataSource.filterData('date', evnt.target.value)
      .then(
        (res)=>{
          searchTerm = evnt.target.value;
          searchColumn = 'date';
          currentPage = 0;
          
          sessionStorage.removeItem('pageNumber');
          sessionStorage.setItem('pageNumber',currentPage);

          dataSource.paginateFromData(1,res)
            .then(page=>{populateTable(TABLE_CONTAINER_ID,page);})
        }
      )
  },
  1000)()
})

const adTitleSearchInput = document.querySelector('#filter-input-title');
adTitleSearchInput.addEventListener("input", (evnt)=>{
  debounce(()=>{
    dataSource.filterData('title', evnt.target.value)
      .then(
        (res)=>{
          searchTerm = evnt.target.value;
          searchColumn = 'title';
          currentPage = 0;
          
          sessionStorage.removeItem('pageNumber');
          sessionStorage.setItem('pageNumber',currentPage);

          dataSource.paginateFromData(1,res)
            .then(page=>{populateTable(TABLE_CONTAINER_ID,page);})
        }
      )
  },
  1000)()
})