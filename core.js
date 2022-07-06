const {API_URL} = require("./config");
const axios = require("axios");
const SMART_CITIZEN_TOPIC_REGEX = new RegExp("device\/sck\/(.*?)\/readings\/raw", 'g')

const isValidTopic = topic => {
    return SMART_CITIZEN_TOPIC_REGEX.test(topic)
}

const captureTokenFromTopic = value => {
    // Obvio es una pésima manera, pero funciona
    return value.replace('device/sck/', '').replace('/readings/raw', '')
}

const smartCitizenDataToJSON = badJSON => {
    const withoutBrackets = badJSON.replace('{', '').replace('}', '')
    const allKeyValues = withoutBrackets.split(',') || []
    let jsonData = {}
    allKeyValues.forEach(kv => {
        const splitKV = kv.split(/:/)
        const key = splitKV.shift().toString()
        jsonData[key] = splitKV.join(':')
    })
    return jsonData
}

const sendReadingToAPI = async (data) => {
    const url = `${API_URL}/api/station-readings`
    const r = await axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    return r.status === 201
}

module.exports = {
    captureTokenFromTopic, smartCitizenDataToJSON, isValidTopic, sendReadingToAPI
}
