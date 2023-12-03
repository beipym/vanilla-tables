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
