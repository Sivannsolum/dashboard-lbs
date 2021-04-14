"use strict";

const path = require('path');
const fs = require('fs')

const envType = `${process.argv[2]}`
const publicPath = `/${process.argv[3]}`

const envFileName = `.env.${envType}`
const envFilePath = path.join(__dirname, envFileName)
let envFileContent = fs.readFileSync(envFilePath, {encoding: 'utf8'}).toString()
const envVariables = envFileContent.split('\n')


let vuePulicPathIdx = envVariables.findIndex(envVar => envVar.includes('VUE_PUBLIC_PATH'))
envVariables[vuePulicPathIdx] = envVariables[vuePulicPathIdx].split('=')
envVariables[vuePulicPathIdx][1] = publicPath
envVariables[vuePulicPathIdx] = envVariables[vuePulicPathIdx].join('=')
envFileContent = envVariables.join('\n')

fs.writeFile(envFilePath, envFileContent, (err) => {
    if (err) throw ReferenceError(`Failed to write env.server.json on the path: ${envFilePath}`)
})
