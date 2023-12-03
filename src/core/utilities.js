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