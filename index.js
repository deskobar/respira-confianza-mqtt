const axios = require("axios");
const {API_URL} = require("./config");

const mqtt = require("mqtt");
const {captureTokenFromTopic, isJson} = require("./core");

const host = "broker.emqx.io";
const port = "1883";
const clientId = `mqtt_respiraconfianza`;

const connectUrl = `mqtt://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: "emqx",
    password: "public",
    reconnectPeriod: 1000,
});

const topic = "device/sck/+/readings/raw";
client.on("connect", () => {
    console.log("Connected");
    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
    });
});
client.on("message", (topic, payload) => {
    const token = captureTokenFromTopic(topic)
    const payloadIsJSON = isJson(payload.toString())
    console.log(`Token: ${token}`)
    console.log(`Payload is JSON: ${payloadIsJSON}`);
});

