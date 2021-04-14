"user strict";

const readline = require('readline');
const path = require('path');
const fs = require('fs')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const readFile = (path, callback) => {
    return () => {
        fs.readFile(path, 'utf8', callback)
    }
}

const toEnglish = (messages) => {
    messages = JSON.parse(messages)
    for(let key in messages) {
        messages[key] = key
    }
    return JSON.stringify(messages)
}

const convertTranslationFile = (data) => {
    let multilanguageText = data.toString()
    let textByCountry = multilanguageText.substring(multilanguageText.indexOf('{') + 1, multilanguageText.lastIndexOf('}')).split(';')

    let resultByCountry = new Map()
    textByCountry.forEach(text => {
        resultByCountry.set(
            text.substring(text.indexOf('(') + 2, text.indexOf(',') - 1), // Country
            text.substring(text.indexOf('{'), text.indexOf('}') + 1) // message
        )
    })
    resultByCountry.set(
        'en',
        toEnglish(resultByCountry.get('jp'))
    )
    return resultByCountry
}

const writeConvertedFile = (resultByCountry) => {
    for(let [key, value] of resultByCountry) {
        let validFileNameRegex = new RegExp(/^[a-zA-Z-_]*$/)
        if(!validFileNameRegex.test(key)) continue
        fs.writeFile(path.join(__dirname, `${key}.json`), value, (err) => {
            if (err) throw ReferenceError(`Failed to write ${key}.json on the path: ${path.join(__dirname, key)}`)
        })
    }
}

const onReadFile = (err, data) => {
    if (err) throw ReferenceError('Failed to read specified file. Place the file in the same directory as this script.')
    writeConvertedFile(convertTranslationFile(data))
}

(async () => {
    rl.question('Enter the translation file name \n', (fileName) => {
        let readTranslationFile = readFile(path.join(__dirname, fileName), onReadFile);
        readTranslationFile()
        rl.close();
    });
})()

