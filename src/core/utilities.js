export function debounce(func, wait = 0) {
    let timeoutID = null;
    return function (...args) {
      
      const context = this;
      clearTimeout(timeoutID);
  
      timeoutID = setTimeout(function () {
        timeoutID = null; // not neccesary but good to do!
        func.apply(context, args);
      }, wait);
    };
  }

  /**
   * 
   * @param {Object} item 
   * @param {Array} array 
   * @param {Number} maxArraySize 
   * 
   */
export function addToArray(item, array, maxArraySize){
  if(array.length < maxArraySize){
    const existingIndex = array.findIndex(
      (existingObject) =>
        existingObject.field === item.field
    );
    if (existingIndex === -1) {
      array.push(item);
    } else {
      array.splice(existingIndex, 1);
      array.push(item)
    } 
  }
}
/**
 * 
 * @param {string} parameterName 
 * @returns 
 */
export function readURLData(parameterName) {
  const url = window.location.href;
  const urlParams = new URLSearchParams(url.split("?")[1]);

  // Read the query parameter
  const parameterValue = urlParams.get(parameterName);
  return parameterValue;
}

export function writeURLData(newParams) {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  // Add new parameters
  for (const param of newParams) {
    const keyValue = param.split('=');
    const key = keyValue[0];
    let value = keyValue[1];

    if (searchParams.has(key)) {
      // If the parameter already exists, update its value
      searchParams.set(key, value);
    } else {
      // If the parameter doesn't exist, add it
      searchParams.append(key, value);
    }
  }

  url.search = searchParams.toString();
  history.pushState({}, '', url.toString());
}
  