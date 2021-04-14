// ### 사용법 ###
// 1. 본 스크립트 동일 디렉토리에 de, ko, jp등 다국어파일들을 위치한다.
// 2. correctionParser로 toCorrect파일을 변환한 correctionList.json 파일을 위치한다.
// 3. 실행하면 correctionList 파일에 따라 다국어파일들의 key값을 수정해서 덮어씌운다.
"user strict";

const path = require('path');
const fs = require('fs')

const correctionList = JSON.parse(fs.readFileSync(path.join(__dirname, 'correctionList.json'), {encoding: 'utf8'}).toString())

const readFile = (path, callback) => {
    return () => {
        fs.readFile(path, 'utf8', callback)
    }
}

const multilanguageList = [ 'de', 'en', 'es', 'fr', 'it', 'jp', 'ko', 'por', 'zh' ]

const convertTranslationFile = (data) => {
    let messages = JSON.parse(data.toString())
    for(let correction of correctionList) {
        if(messages[correction.before]) {
            const val = JSON.parse(JSON.stringify(messages[correction.before]))
            delete messages[correction.before]
            messages[correction.after] = val
        }
    }
    return JSON.stringify(messages)
}

const writeConvertedFile = (correctedFile, fileName) => {
    fs.writeFile(path.join(__dirname, `${fileName}.json`), correctedFile, (err) => {
        if (err) throw ReferenceError(`Failed to write ${fileName}.json on the path: ${path.join(__dirname, fileName)}`)
    })
}

(async () => {
    for(let fileName of multilanguageList) {
        try {
            const onReadFile = (err, data) => {
                if(err) throw err
                writeConvertedFile(convertTranslationFile(data), fileName)
            }
            let readTranslationFile = readFile(path.join(__dirname, `${fileName}.json`), onReadFile);
            readTranslationFile()
        } catch (err) {
            console.debug(`Failed to process. error: ${err}`)
        }
    }
})()

