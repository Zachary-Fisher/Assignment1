const { findServer } = require('./serverCheck.js');

const allFail = [
    {
        "url": "http://doesNotExist.boldtech.co",
        "priority": 8
    },
    {
        "url": "http://localhost2",
        "priority": 7
    },
    {
        "url": "http://localhost3",
        "priority": 2
    },
    {
        "url": "https://localhost4",
        "priority": 10
    }
];
const providedDemo = [
    {
        'url': 'http://doesNotExist.boldtech.co',
        'priority': 1
    },
    {
        'url': 'http://boldtech.co',
        'priority': 7
    },
    {
        'url': 'http://offline.boldtech.co',
        'priority': 2
    },
    {
        'url': 'https://google.com',
        'priority': 4
    }
];

findServer(providedDemo).then(function(response) {
    console.log(response);
}).catch(function(error) {
    console.log(error.message);
})