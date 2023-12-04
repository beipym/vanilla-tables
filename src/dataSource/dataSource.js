export default class DataSource {

    constructor(jsonFileUrl, itemsPerPage ) {
      this.jsonFileUrl  = jsonFileUrl;
      this.itemsPerPage = itemsPerPage;
      this._sortColumn  = 'date';
      this.sortOrder = 'desc';
    }
    
    /**
     * 
     * @returns all of data
     */
    async loadData() {
      const response = await fetch(this.jsonFileUrl);
      const data = await response.json();
      return data;
    }
 
    /**
     * 
     * @param {Number} page 
     * @returns paginated data from all of the data
     */
    async paginate(page) {
      const startIndex = (page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const data = await this.loadData();
      return data.slice(startIndex, endIndex);
    } 


    /**
     * 
     * @param {Number} page 
     * @param {Array} dataIn 
     * @param {String} sortOrder 
     * 
     * @returns accepts an array of data and returns data in pages
     */
    async paginateFromData(page, dataIn, sortOrder) {
      const startIndex = (page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const data = await this.sortDataFrom( sortOrder ?? 'desc',dataIn);
      return data.slice(startIndex, endIndex);
    }

    /**
     * 
     * @param {String} order 
     * @param {Array} dataToSort 
     * @returns accepts a custom array and returns the data sorted
     */
    async sortDataFrom(order = 'asc', dataToSort) {
      const data = dataToSort;
      data.sort((a, b) => {
        const result = a[this._sortColumn].localeCompare(b[this._sortColumn]);
        return order === 'desc' ? -result : result;
      });
      return data;
    } 

    /**
     * 
     * @param {String} order 
     * @returns a sorted array of all data
     */
    async sortData(order) {
      const data = await this.loadData();
      data.sort((a, b) => {
        const result = a[this._sortColumn].localeCompare(b[this._sortColumn]);
        return order === this.sortOrder ? -result : result;
      });
      return data;
    }

    /**
     * 
     * @param {Array} filterItems 
     * @param {String} sortOrder 
     * @returns filtered data based on multiple filters
     */
    async filterDataMultiple(filterItems, sortOrder) {
      const data = await this.sortData(sortOrder);
      
      // if(filterItems.length > 0 ){

        return data.filter((item) => {
          return filterItems.every((filterItem) => {
            if(filterItem && filterItem.value !==   '' && filterItem.value !== null){
              const filterValue = filterItem.value;
              return item[filterItem.field].toLowerCase().includes(filterValue.toLowerCase());
            } else {
              return item
            }
          });
        });
      // } else {
      //   return data
      // }
    }
    
    /**
     * default sort column
     */
    get sortColumn(){
      return this._sortColumn;
    }

    /**
   * @param {string} value
   */
    // set sortOrder(value){
    //   this.sortOrder = value;
    // }

    /**
     * 
     * @param {Array} data 
     * @returns total number of pages in data
     */
    async getTotalPageNumber(data){
      const totalRecords = data;
      return Math.ceil(totalRecords.length / this.itemsPerPage);
    }

    /**
     * 
     * @param {Array} data 
     * @returns total number of items in data
     */
    async getTotalItemsNumber(data){
      const totalRecords = data;
      return totalRecords.length;  
    }
}