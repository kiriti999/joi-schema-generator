#!/usr/bin/env node
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const joiMachine = require('joi-machine');
const cp = require('child_process');
const args = process.argv.slice(2);

console.log(`joiSchemaGenerator:: args:, '${args}'`);

const inputFolderNamePath = getFolderPath(args[0] || 'jsonFiles');
const outputFolderNamePath = getFolderPath(args[1] || 'schemas');
const schemaArgs = (args.slice(2).join(' ')) || 'import { Joi } from \'joi\';';
console.log(' ------------------------------------------------------');
console.log(`joiSchemaGenerator:: schemaArgs: '${schemaArgs}'`);
console.log(`joiSchemaGenerator:: inputFolderNamePath:, '${inputFolderNamePath}'`);
console.log(`joiSchemaGenerator:: outputFolderNamePath:, '${outputFolderNamePath}'`);
console.log(' -------------------------------------------------------');

/**
 * Initializer
 * @param inputFolderNamePath input folder path
 */
function init(inputFolderNamePath) {
    if (!isDirExists(inputFolderNamePath)) throw new Error('Input folder not found');
    if (!isDirExists(outputFolderNamePath)) fs.mkdirSync(outputFolderNamePath);
}

/**
 * Gets folder path from current working dir
 * @param dir folder name
 * @returns path
 */
function getFolderPath(dir) {
    return path.resolve(process.cwd(), dir);
}

/**
 * Determines whether dir exists is
 * @param dir folder path
 * @returns boolean whether folder exists
 */
function isDirExists(dir) {
    return fs.existsSync(dir);
}

/* #region  Generate joi schema from json */
/**
 * Reads files
 * @param dir input folder path
 * @param processFile callback function to generate joi schemas
 */
function readFiles(dir, processFile) {
    try {
        fs.readdir(dir, (error, fileNames) => {
            if (error) throw error;
            if (fileNames.length < 1) console.log('No json files found!');
            fileNames.forEach(filename => {
                const name = path.parse(filename).name;
                const ext = path.parse(filename).ext;
                processFile(name, ext);
            });
        });
    } catch (error) {
        console.log(' -------------------------');
        console.log('readFiles :: error', error);
        console.log(' -------------------------');
    }
}

/**
 * Writes to file
 * @param writeStream fs stream
 * @param outPutFileName used to write to file as 'export const outPutFileName ='
 */
function writeToFile(writeStream, outPutFileName) {
    writeStream.write(schemaArgs);
    writeStream.write('\n \n');
    writeStream.write(`export const ${outPutFileName} = `);
}

/**
 * Creates schema files
 * @param name input folder name
 * @param ext extension of file
 */
function createSchemaFiles(name, ext) {
    try {
        console.log(' -------------------------------');
        console.log(`joiSchemaGenerator:: files found: ${name}${ext}`);
        const outPutFileName = `${name}Schema`;
        const rs = fs.createReadStream(`${inputFolderNamePath}/${name}${ext}`).pipe(joiMachine());
        const ws = fs.WriteStream(`${outputFolderNamePath}/${outPutFileName}.ts`);
        writeToFile(ws, outPutFileName);
        rs.pipe(ws);
        formatAndLint();
    } catch (error) {
        console.log(' ---------------------------------');
        console.log('createSchemaFiles :: error', error);
        console.log(' ---------------------------------');
    }
}

/**
 * Formats and fixes lint issues on schema files generated
 */
function formatAndLint() {
    const beautify = `prettier --write ${outputFolderNamePath}/*.ts && npm run lint:fix`;
    try {
        cp.exec(beautify, (error, stdout, stderr) => {
            if (error || stderr) throw error;
            console.log(stdout, stderr);
            if (error !== null) console.log(`exec error: ${error}`);
        });
    } catch (error) {
        console.log(' -----------------------------');
        console.log('formatAndLint :: error', error);
        console.log(' -----------------------------');
    }
}

module.exports.generateJoiSchema = function (dir = inputFolderNamePath) {
    init(dir);
    readFiles(dir, createSchemaFiles);
}();
/* #end region */
