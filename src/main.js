const axios = require("../utils/axios");
const BASE_URL = "http://localhost:5000";

function isValid({ id, name, meaning, quadrant, starsWithPlanets }) {
  return id && name && meaning && quadrant && starsWithPlanets;
}

  // Declare an asynchronous function named "update" that takes a "constellation" object as an argument.
async function update(constellation) {
   // Extract the "id" property from the "constellation" object using destructuring and assign it to a variable named "id".
  const { id } = constellation;
  // Use a try-catch block to handle any errors that may occur during the PUT request.
  try {
    // Inside the try block, send a PUT request using Axios to the BASE_URL/constellations/${id}, with the "constellation" object as the request body.
    const response = await axios.put(`${BASE_URL}/constellations/${id}`, constellation);
    // If the request is successful, return the response from the request.
    return response;
  } // If the request fails, catch the error and return a rejected Promise with an object that includes an "error" property with a message that says 'Updating constellation (id: ${id}) failed.'
  catch (error) {
    return Promise.reject({ error: `Updating constellation (id: ${id}) failed.` });
  }
}

//Define a function named bulkImport that takes an argument named 'constellations'.
function bulkImport(constellations) {
  //Return a new Promise that takes a function as an argument with async keyword which takes resolve and reject as its parameters
  return new Promise(async (resolve, reject) => {
    //Wrap the following code in a try-catch block.
    try {
      // Check if constellations is an array using the Array.isArray() method.
      if (!Array.isArray(constellations)) {
        //If constellations is not an array, throw an error with a message that states the inputted argument must be an array.
        throw new Error("Inputted argument must be an array.");
      }

      // Loop through each constellation in the constellations array.
      for (const constellation of constellations) {
        // Validate each constellation using the isValid() function.
        if (!isValid(constellation)) {
          // If any constellation is invalid, throw an error with a message that states all constellations must include relevant fields.
          throw new Error("All constellations must include relevant fields.");
        }
      }

      // Map each constellation to a PUT request using the update() function, and store these requests in an array called requests.
      const requests = constellations.map((constellation) => {
        return update(constellation);
      });

      // Use Promise.allSettled() to evaluate all requests and store the results in a variable called results.
      const results = await Promise.allSettled(requests);
      // If all requests are successful, resolve the Promise with the results.
      resolve(results);
    } // If there is an error at any point, catch it and reject the Promise with an object that includes an error key with the error message.
    catch (error) {
      reject({ error: error.message });
    }
  });
}


module.exports = { bulkImport, update };
