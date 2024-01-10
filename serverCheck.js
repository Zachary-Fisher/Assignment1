const axios = require('axios');

/*
* name - findServer
* input - serverList (Array) This array should contain a list of objects (servers), each with a url and priority
* output - (Promise) A promise that will either resolve as the url of the lowest priority online server, 
* or reject as the string 'None of the provided servers are available.'
* description - This function accepts a list of servers and returns the url for the lowest priority online server
*/
function findServer(serverList) {
    if(!serverList || serverList.length == 0) {
        return new Promise((resolve, reject) => {
            reject(new Error('No servers provided.'))
        });
    }
    const serverPromise = new Promise((resolve, reject) => {
        requests = [];
        serverList.forEach((server) => {
            requests.push(getStatus(server));
        });
        Promise.allSettled(requests).then((results) => {
            results = results.filter((result) => result.status == 'fulfilled' && result.value.status >=200 && result.value.status <300);
            if(results.length == 0) {
                reject(new Error('None of the provided servers are available.'));
            }
            else {
                let bestPriority = results[0].value.priority;
                let bestServer = results[0].value.url;
                results.forEach((result) => {
                    if(result.value.priority < bestPriority) {
                        bestServer = result.value.url;
                        bextPriority = result.value.priority;
                    }
                })
            resolve(bestServer);
            }
            
        })
    });
    return serverPromise;
}

/*
* name - getStatus
* input - serverInfo {Object} This array should contain a list of objects (servers), each with a url and priority
* output - {Promise} A promise that will either resolve as the url of the lowest priority online server, 
* or reject as the string 'None of the provided servers are available.'
* description - This function accepts a list of servers and returns the url for the lowest priority online server
*/
function getStatus(serverInfo) {
    const statusPromise = new Promise((resolve, reject) => {
        axios.get(serverInfo.url, {timeout: 5000})
        .then((response) => {
            resolve({'url': serverInfo.url, 'status': response.status, 'priority': serverInfo.priority})})
        .catch((error) => {
            reject(new Error(`Server ${serverInfo.url} Offline`));
        });
    });
    return statusPromise;
}

module.exports = { findServer, getStatus }