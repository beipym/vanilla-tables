export default class DataSource {

    constructor(jsonFileUrl, itemsPerPage ) {
      this.jsonFileUrl  = jsonFileUrl;
      this.itemsPerPage = itemsPerPage;
      this._sortColumn  = 'date';
    }
  
    async loadData() {
      const response = await fetch(this.jsonFileUrl);
      const data = await response.json();
      return data;
    }
 
    async paginate(page) {
      const startIndex = (page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const data = await this.loadData();
      return data.slice(startIndex, endIndex);
    } 

    async paginateFromData(page, dataIn, sortOrder) {
      const startIndex = (page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const data = await this.sortDataFrom( sortOrder ?? 'desc',dataIn);
      return data.slice(startIndex, endIndex);
    }

    async sortDataFrom(order = 'asc', dataToSort) {
      const data = dataToSort;
      data.sort((a, b) => {
        const result = a[this._sortColumn].localeCompare(b[this._sortColumn]);
        return order === 'desc' ? -result : result;
      });
      return data;
    } 

    async sortData(order) {
      const data = await this.loadData();
      data.sort((a, b) => {
        const result = a[this._sortColumn].localeCompare(b[this._sortColumn]);
        return order === 'desc' ? -result : result;
      });
      return data;
    }
  
    async filterData(filterField , filterValue) {
      const data = await this.sortData();
      if(filterField && filterValue){

        return data.filter(item => {
          return item[filterField].toLowerCase().includes(filterValue.toLowerCase());
        });
      } else return data;
    }

    async filterDataMultiple(filterItems) {
      const data = await this.sortData();

      return data.filter((item) => {
        return filterItems.every((filterItem) => {
          if(filterItem.value){
            const filterValue = filterItem.value;
            return item[filterItem.field].toLowerCase().includes(filterValue.toLowerCase());
          }
        });
      });
    }
    
    get sortColumn(){
      return this._sortColumn;
    }

    async getTotalPageNumber(){
      const totalRecords = await this.loadData();

      return Math.ceil(totalRecords.length / this.itemsPerPage);
    }


    async getTotalItemsNumber(){
      const totalRecords = await this.loadData();

      return totalRecords.length;  
    }
}