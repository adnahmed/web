const fs = require('fs')

module.exports = file => {
    const buffer = fs.readFileSync(`${__dirname}/${file}.cypher`).toString();
    if(buffer.length == 0)
        throw new EmptyCypherQueryError(file);
    return buffer.toString()
}

class EmptyCypherQueryError extends Error {
    constructor(fileName) {
        super()
        this.message = `Error occurred trying to execute empty query: ${fileName}`;
    }
}