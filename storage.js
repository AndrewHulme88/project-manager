const fs = require('fs');

function saveData(data, path='data.json') {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function loadData(path='data.json') {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (error) {
        if (error.code === 'ENOENT') {
            return []; // Return an empty array if the file does not exist
        } else {
            throw error; // If it's any other error, throw it
        }
    }
}

module.exports = { saveData, loadData };
