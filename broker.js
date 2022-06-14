const axios = require("axios");
const {API_URL} = require("./config");
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883

server.listen(port, function () {
    console.log('Aedes listening on port:', port)
    aedes.publish({topic: 'device/sck/+/readings/raw', payload: 'Hello'}, (e) => console.log({e}))
})

aedes.on('subscribe', function (subscriptions, client) {
    console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
        '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
})

// fired when a client connects
aedes.on('client', function (client) {
    console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

aedes.publish = function (packet, callback) {
    console.log('[publish]', {packet})
    if (packet.topic === 'aaaa') {
        return callback(new Error('wrong topic'))
    }
    if (packet.topic === 'bbb') {
        packet.payload = Buffer.from('overwrite packet payload')
    }
    callback(null)
}

aedes.ping = function (packet, client) {
    console.log({packet, client})
}

aedes.ack = function (packet, client) {
    console.log({packet, client})
}

aedes.connackSent = function (packet, client) {
    console.log({packet, client})
}
