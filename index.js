const mqtt = require("mqtt");
const {captureTokenFromTopic, smartCitizenDataToJSON, isValidTopic, sendReadingToAPI} = require("./core");

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

client.on("message", async (topic, payload) => {

    const topicIsValid = isValidTopic(topic.toString())

    if (!topicIsValid) return

    try {
        const token = captureTokenFromTopic(topic.toString())
        const decodedPayload = payload.toString()
        const sensorReadings = smartCitizenDataToJSON(decodedPayload)

        // https://api.smartcitizen.me/v0/sensors/?per_page=1000

        const apiRequiredData = {
            PRIVATE_KEY: token,
            TEMP: sensorReadings["55"] || null,
            PRESS: sensorReadings["58"] || null,
            HR: sensorReadings["56"] || null,
            MP10: sensorReadings["89"] || null,
            MP25: sensorReadings["87"] || null,
        }

        await sendReadingToAPI(apiRequiredData)

    } catch (error) {
        console.log({error})
    }

});

