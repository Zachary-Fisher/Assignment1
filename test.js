const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const serverCheck = require('./serverCheck.js');
const axios = require('axios');

describe('getStatus', function() {

    beforeEach(function() {
    });
    afterEach(function() {
    });
    after(function() {
    });

    it('should reject when given an offline site', function () {
        const requestInterceptor = axios.interceptors.request.use(function (config) {
            config.url = 'localhost';
            return config;
        });
        const responseInterceptor = axios.interceptors.response.use(function (response) {
            return {'status': 200};
        });
        data = serverCheck.getStatus({
            'url': 'localhost',
            'priority': 10
        })
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
        return expect(data).to.be.rejected;
    });

    it('should return data about the server if it is online', function () {
        const requestInterceptor = axios.interceptors.request.use(function (config) {
            config.url = 'localhost';
            return config;
        });
        const responseInterceptor = axios.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            return Promise.resolve({'status': 200});
        });
        data = serverCheck.getStatus({
            'url': 'https://localhost.com',
            'priority': 10
        });

        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);

        return expect(data).to.eventually.deep.equal({
            'url': 'https://localhost.com',
            'priority': 10,
            'status': 200
        });
    });
});

describe('findServer', function() {
    const serverList = [
        {
            "url": "http://localhost",
            "priority": 8
        },
        {
            "url": "http://localhost2",
            "priority": 7
        },
        {
            "url": "http://localhost:random",
            "priority": 2
        },
        {
            "url": "https://localhost4",
            "priority": 10
        }
    ];

    it('should reject if there are no servers.', function () {
        data = serverCheck.findServer([]);
        return expect(data).to.be.rejected;
    });

    it('should fail if all servers are offline.', function () {
        this.timeout(7000);
        const requestInterceptor = axios.interceptors.request.use(function (config) {
            return config;
        });
        //stubbing responsed for the different servers
        const responseInterceptor = axios.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            return Promise.reject(error);
        });
        data = serverCheck.findServer(serverList);

        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);

        return expect(data).to.be.rejected;
    });

    it('should return the lowest priority server', function () {
        this.timeout(7000);
        const requestInterceptor = axios.interceptors.request.use(function (config) {
            return config;
        });
        const responseInterceptor = axios.interceptors.response.use(function (response) {
            return Promise.resolve({'status': 200});
        }, function (error) {
            return Promise.resolve({'status': 200});
        });
        data = serverCheck.findServer(serverList);

        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
        return expect(data).to.eventually.equal('http://localhost:random');
    });

    it('should return the lowest priority server ignoring offline servers', function () {
        this.timeout(7000);
        const requestInterceptor = axios.interceptors.request.use(function (config) {
            return config;
        });
        //stubbing responses for the different servers
        const responseInterceptor = axios.interceptors.response.use(function (response) {
            return Promise.resolve({'status': 200});
        }, function (error) {
            if(error.hostname.includes('random')) {
                return Promise.reject(error);
            }
            return Promise.resolve({'status': 200});
        });
        data = serverCheck.findServer(serverList);

        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
        return expect(data).to.eventually.equal('http://localhost2');
    });
});

