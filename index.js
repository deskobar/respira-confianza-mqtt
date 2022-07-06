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
            privateKey: token,
            TEMP: parseInt(sensorReadings["55"] || null),
            PRESS: parseInt(sensorReadings["58"] || null),
            HR: parseInt(sensorReadings["56"] || null),
            MP10: Number(sensorReadings["89"] || undefined),
            MP25: Number(sensorReadings["87"] || undefined),
            recorded_at: sensorReadings["t"] || new Date().toString(),
            updated_at: sensorReadings["t"] || new Date().toString(),
        }

        const sentSuccessful = await sendReadingToAPI(apiRequiredData)

        console.log(new Date().toString(), {apiRequiredData, sentSuccessful})

    } catch (error) {
        console.log({error})
    }

});

