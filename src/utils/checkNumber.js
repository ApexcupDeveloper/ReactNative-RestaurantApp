export const isNumber = (number) => {
    if (typeof number !== 'string') {
        return false;
      }
    
      if (number.trim() === '') {
        return false;
      }
    
      return !isNaN(number);
}