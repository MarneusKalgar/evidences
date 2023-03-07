import axios from 'axios';

/**
 * Call GET request to load entity data from UB dictionary
 * @param {String} endpoint
 */
export async function loadEntity(endpoint) {
  return axios({
    method: 'GET',
    url: endpoint
  })
  .then(res => {
    return res.data;
  })
  .catch(error => {
    throw new Error(error);
  });
}

/**
 * Call POST request to record the form data to the DB
 * @param {String} endpoint
 * @param {Number} userID
 * @param {Object|Array} selected
 */
export async function updateEmpSkillAttrs(endpoint, userID, selected) {
  return axios({
    method: 'POST',
    url: endpoint,
    data: {
      userID,
      selected
    }
  });
}
