export default class DataSource {

    constructor(jsonFileUrl, itemsPerPage) {
      this.jsonFileUrl = jsonFileUrl;
      this.itemsPerPage = itemsPerPage;
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

    async paginateFromData(page, dataIn) {
      const startIndex = (page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const data = dataIn;
      return data.slice(startIndex, endIndex);
    }
  
    async sortData(field, order) {
      const data = await this.loadData();
      data.sort((a, b) => {
        const result = a[field].localeCompare(b[field]);
        return order === 'desc' ? -result : result;
      });
      return data;
    }
  
    async filterData(filterField, filterValue) {
      const data = await this.loadData();
      return data.filter(item => {
        return item[filterField].toLowerCase().includes(filterValue.toLowerCase());
      });
    }
  }
  