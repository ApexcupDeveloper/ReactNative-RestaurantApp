export const handleError = error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log('Error data : ', error.response);
    // console.log(error.response.status);
    // console.log(error.response.headers);
    if (error.response.data?.error) {
      if (Array.isArray(error.response.data?.error))
        return error.response.data.error[0];
      else return error.response.data.error;
    } else {
      return 'No internet connection.';
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log('Error request: ', error.message);
    return 'No internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error message: ', error.message);
    return error.message;
  }
};
