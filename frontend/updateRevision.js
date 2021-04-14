"use strict";

const path = require('path');
const fs = require('fs')

const revisions = JSON.parse(fs.readFileSync(path.join(__dirname, 'revisions.json'), {encoding: 'utf8'}).toString())
const publicPath = path.join(__dirname, 'public')
const latestRelease = revisions.value[0].id

const propertyNames = fs.readdirSync(publicPath).filter(file=>file.includes('properties'))
const properties = []

const writeFiles = (files) => {
    for(const file of files) {
        fs.writeFile(path.join(publicPath, file.propertyName), file.propertyData, (err) => {
            if (err) throw ReferenceError(`Failed to write ${file.propertyName} on the path: ${path.join(publicPath, file.propertyName)}`)
        })
    }
}

for(let propertyName of propertyNames) {
    let propertyData = JSON.parse(fs.readFileSync(path.join(publicPath, propertyName), {encoding: 'utf8'}).toString())
    propertyData.Dashboard_Release = latestRelease
    propertyData = JSON.stringify(propertyData)
    const file = {
        propertyName,
        propertyData
    }
    properties.push(file)
}

writeFiles(properties)