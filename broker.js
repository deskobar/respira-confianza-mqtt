const axios = require("axios");
const {API_URL} = require("./config");
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883

server.listen(port, function () {
    console.log('Aedes listening on port:', port)
    aedes.publish({ topic: '#', payload: "I'm broker " + aedes.id })
})

aedes.on('subscribe', function (subscriptions, client) {
    console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
        '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
})

aedes.on('unsubscribe', function (subscriptions, client) {
    console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
        '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
})

// fired when a client connects
aedes.on('client', function (client) {
    console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

// fired when a client disconnects
aedes.on('clientDisconnect', function (client) {
    console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

// fired when a message is published
aedes.on('publish', async function (packet, client) {
    const endpoint = `${API_URL}/station-readings`
    const body = {
        privateKey: "$2b$10$LKZDhmBFW9Pl3xOxzlnK8OyYvBF9gsMjmvZpi0BZv4X0o2ceLNh3m",
        HR: 10000
    }
    try {
        console.log('date', new Date())
        console.log(packet)
        const { topic, payload } = packet
        console.log('payloadAsString', payload.toString())
        console.log('topic', topic)
        console.log('client', client)
        // const response = await axios.post(endpoint, body)
        console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
        console.log('todo ok')
    } catch (e) {
        console.log(e)
    }
})

aedes.on ('clientError', function (client, error){
    console.log('clientError')
    console.log({client, error})
})

aedes.on ('connectionError', function (client, error){
    console.log('connectionError')
    console.log({client, error})
})

aedes.on ('connackSent', function (packet, client) {
    console.log('connactSenk')
    console.log({packet, client})
})
aedes.on ('ping', function (packet, client) {
    console.log('ping')
    console.log({packet, client})
})

aedes.on ('ack', function(packet, client){
    console.log('ack')
    console.log({packet, client})
})
