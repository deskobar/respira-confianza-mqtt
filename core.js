const SMART_CITIZEN_TOPIC_REGEX = new RegExp("device\/sck\/(.*?)\/readings\/raw", 'g')

const isValidTopic = topic => {
    return SMART_CITIZEN_TOPIC_REGEX.test(topic)
}

const captureTokenFromTopic = value => {
    // Obvio es una pésima manera, pero funciona
    return value.replace('device/sck/', '').replace('/readings/raw', '')
}

const smartCitizenDataToJSON = value => {
    const withoutBrackets = value.replace('{', '').replace('}', '')
    const keyValues = withoutBrackets.split(',') || []
    let jsonData = {}
    keyValues.forEach(kv => {
        if (kv.toString().startsWith('t:')) {
            jsonData['t'] = kv.toString().replace('t:', '')
        } else {
            const [key, value] = kv.split(':')
            jsonData[key.toString()] = Number(value)
        }
    })
    return jsonData
}

module.exports = {
    captureTokenFromTopic, smartCitizenDataToJSON, isValidTopic
}
