const fs = require('fs');

function saveData(data, path='data.json') {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function loadData(path='data.json') {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        } else {
            throw error;
        }
    }
}

module.exports = { saveData, loadData };
