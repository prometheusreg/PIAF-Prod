var soap = require('soap');
var url = 'https://gateway.rpx.realpage.com/RPXGateway/partner/Promet-20160426141703/Prometheus.svc?wsdl';
var RPXclient = function (cb) {
    soap.createClientAsync(url, {
        "overrideRootElement": {
            "namespace": "tem",
            "xmlnsAttributes": [{
                    "name": "xmlns:tem",
                    "value": "http://tempuri.org/"
                }]
        },
        "namespaceArrayElements": false
    }).then((client) => {
        cb(client);
    });
};
module.exports = RPXclient;
//# sourceMappingURL=RPX-service.js.map