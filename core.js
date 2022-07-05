const SMART_CITIZEN_TOPIC_REGEX = new RegExp("device\/sck\/(.*?)\/readings\/raw", 'g')

const isValidTopic = topic => {
    return SMART_CITIZEN_TOPIC_REGEX.test(topic)
}

const captureTokenFromTopic = topic => {
    const group = SMART_CITIZEN_TOPIC_REGEX.exec(topic)
    const [_, token] = group || [null, null]
    return token
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
