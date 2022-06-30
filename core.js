const captureTokenFromTopic = topic => {
    const regex = /device\/sck\/(.*?)\/readings\/raw/g
    const [_, token] = regex.exec(topic) || [null, null]
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
    captureTokenFromTopic, isJson
}
