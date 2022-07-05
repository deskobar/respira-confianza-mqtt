const SMARTCITIZEN_TOPIC_REGEX = new RegExp('device\/sck\/(.*?)\/readings\/raw', 'g')

const isValidTopic = topic => {
    return SMARTCITIZEN_TOPIC_REGEX.test(topic)
}

const captureTokenFromTopic = topic => {
    console.log('exec', SMARTCITIZEN_TOPIC_REGEX.exec(topic))
    const [_, token] = SMARTCITIZEN_TOPIC_REGEX.exec(topic) || [null, null]
    return token
}

const isJson = (data) => {
    try {
        const testIfJson = JSON.parse(data);
        return typeof testIfJson === "object";
    } catch {
        return false;
    }
};


module.exports = {
    captureTokenFromTopic, isJson, isValidTopic
}
