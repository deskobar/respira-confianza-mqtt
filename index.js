const axios = require("axios");
const {API_URL} = require("./config");

const mqtt = require("mqtt");
const {captureTokenFromTopic, isJson, isValidTopic} = require("./core");

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
    const topicIsValid = isValidTopic(topic)
    console.log({topic, topicIsValid})
    if (!topicIsValid) return
    const token = captureTokenFromTopic(topic.toString())
    const payloadIsJSON = isJson(payload.toString())
    console.log(`Token: ${token}`)
    console.log(`Payload is JSON: ${payloadIsJSON}`);

    const xd = {}

    const lala = {
        "t": "2022-06-29T23:38:02Z",
        "10": 97,
        "14": 37,
        "55": 20.38,
        "56": 46.41,
        "53": 50.13,
        "58": 95.31,
        "113": 55.00,
        "112": 763.00,
        "89": 22,
        "87": 27,
        "88": 27
    }

    const data = {
        "timestamp": xd["t"] || null,
        "battery": xd["10"] || null,
        "luz": xd["14"] || null,
        "temperature": xd["55"] || null,
        "humidity": xd["56"] || null,
        "latitude": xd["53"] || null,
        "Horizontal dilution": xd["58"] || null,
        "Total Volatile Organic Compounds Digital Indoor Sensor": xd["113"] || null,
        "eCO2": xd["112"] || null,
        "PM1.0": xd["89"] || null,
        "PM2.5": xd["87"] || null,
        "PM10": xd["88"] || null,
    }

});

