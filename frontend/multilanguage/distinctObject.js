// ### 사용법 ###
// 프로그램을 실행하고 ko.json 등 key값의 중복을 제거하고 싶은 다국어 파일의 이름을 입력한다.

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

const convertFile = (data) => {
    let fileContent = JSON.parse(data.toString())
    let convertedFile = {}
    for(let key of Object.keys(fileContent)) {
        convertedFile[key] = fileContent[key]
    }
    return JSON.stringify(convertedFile)
}

const writeConvertedFile = (convertedFile, fileName) => {
    fs.writeFile(path.join(__dirname, fileName), convertedFile, (err) => {
        if (err) throw ReferenceError(`Failed to write ${key}.json on the path: ${path.join(__dirname, key)}`)
    })
}


(async () => {
    rl.question('Enter the file name. \n', (fileName) => {
        const onReadFile = (err, data) => {
            if (err) throw ReferenceError('Failed to read specified file. Place the file in the same directory as this script.')
            writeConvertedFile(convertFile(data), fileName)
        }
        let readFileToConvert = readFile(path.join(__dirname, fileName), onReadFile);
        readFileToConvert()
        rl.close();
    });
})()

