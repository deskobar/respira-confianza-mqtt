const axios = require("axios");
const {API_URL} = require("./config");
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883

server.listen(port, function () {
    console.log('Aedes listening on port:', port)
    aedes.publish({ topic: '#', payload: "I'm broker " + aedes.id })
    aedes.publish({topic: '$queue/device/sck/+/+', payload: 'hola'})
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
    const date = new Date()
    try {
        const clientID = client?.id || false
        const { topic, payload } = packet
        try {
            Object.keys(client).forEach(k => console.log(`[${date}] [publish] client has this (k, v): (${k}, ${client[k]})`))
        } catch (e) {
            console.log('error unu')
        }
        console.log(`[${date}] [publish] client: ${client}`)
        console.log(`[${date}] [publish] client_id: ${clientID}`)
        console.log(`[${date}] [publish] packet: ${packet}`)
        console.log(`[${date}] [publish] topic: ${topic}`)
        console.log(`[${date}] [publish] payload: ${payload}`)
        console.log(`[${date}] [publish] payload_as_string: ${payload.toString()}`)
        // const response = await axios.post(endpoint, body)
        console.log(`[${date}] [publish] Todo ok`)
    } catch (e) {
        console.log(`[${date}] [publish] [error] ${e}`)
    }
})

