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

    const sensorReadings = {}

    // https://api.smartcitizen.me/v0/sensors/?per_page=200
    // PM1.0 = sensorReadings["89"] || null
    // PM10 = sensorReadings["88"] || null

    const apiRequiredData = {
        PRIVATE_KEY: token,
        TEMP: sensorReadings["55"] || null,
        PRESS: sensorReadings["58"] || null,
        HR: sensorReadings["56"] || null,
        MP10: sensorReadings["89"] || null,
        MP25: sensorReadings["87"] || null,
    }

    console.log({apiRequiredData})

    // axios.post()

});

