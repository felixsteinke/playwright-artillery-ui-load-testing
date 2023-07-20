const fs = require('fs');
const path = require('path');

// configuration
const inputDirectory = './1-generated-code';
const outputDirectory = './2-transformed-code';
const encoding = 'utf8';

// read all files from directory
fs.readdir(inputDirectory, (err, files) => {
    if (err) {
        console.error('Error reading input directory:', err);
        return;
    }
    // process all files
    files.forEach((file) => {
        if (file === '.gitkeep') {
            return;
        }
        const inputFilePath = path.join(inputDirectory, file);
        const outputFilePath = path.join(outputDirectory, file);
        // read file content
        fs.readFile(inputFilePath, encoding, (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            // transform content
            const functionBody = transformFunctionBody(data);
            const script = buildTransformedScript(functionBody);
            // write transformed code to file
            fs.writeFile(outputFilePath, script, encoding, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log(`Transformed ${file} and saved as ${outputFilePath}`);
            });
        });
    });
});

function transformFunctionBody(content) {
    const lines = content.split('\n');
    let transformedContent = '';
    let eIndex = 0;
    lines.forEach((line) => {
        // filter lines
        if (line.startsWith('import') || line.startsWith('test') || line.startsWith('{') || line.startsWith('}')) {
            return;
        }
        // transform lines
        transformedContent += transformLine(line.trim(), eIndex);
        eIndex++;
    });
    if (!transformedContent.startsWith('await page.goto')) {
        transformedContent = buildTransformedAwaitPageLines() + transformedContent;
    }
    return transformedContent;
}

function transformLine(line, eIndex) {
    if (line.startsWith('await')) {
        const code = line.replaceAll('await', '').trim();
        if (code.startsWith('page.goto')) {
            return buildTransformedAwaitPageLines(line);
        }
        const locator = extractLocator(code);
        const action = extractAction(line);
        if (locator.startsWith('page.frameLocator')) {
            return buildTransformedAwaitFrameLines(eIndex, locator, action);
        }
        return buildTransformedAwaitLines(eIndex, locator, action);
    } else {
        return buildTransformedUnmodifiedLine(line);
    }
}

// Function to extract the locator from a line of code
function extractLocator(code) {
    return code.substring(0, code.lastIndexOf('.'));
}

// Function to extract the action from a line of code
function extractAction(code) {
    return code.substring(code.lastIndexOf('.')).replaceAll(';', '');
}


function buildTransformedAwaitPageLines(line) {
    if (line) {
        return `
    await ${line}\n`
    } else {
        return `
    const pageUrl = ''; // TODO insert url
    await page.goto(pageUrl);\n`
    }
}

function buildTransformedUnmodifiedLine(line) {
    return `
    ${line}`;
}

function buildTransformedAwaitFrameLines(eIndex, locator, action) {
    return `
    await checkSingleAdditionalFrame(page);
    const e${eIndex} = ${locator};
    await isVisible(e${eIndex});
    await e${eIndex}${action};\n`;
}

function buildTransformedAwaitLines(eIndex, locator, action) {
    return `
    const e${eIndex} = ${locator};
    await isVisible(e${eIndex});
    await e${eIndex}${action};\n`;
}

function buildTransformedScript(functionBody) {
    return `module.exports = { usageScenario };

async function usageScenario(page) {
    ${functionBody}
}

async function isVisible(locator, timeout) {
    if (!timeout) {
        timeout = 5000;
    }
    await locator.isVisible({timeout: timeout});
}

async function checkSingleAdditionalFrame(page, timeout, attempts) {
    if (!timeout) {
        timeout = 10000;
    }
    if (!attempts) {
        attempts = 10;
    }
    for (let i = 0; i < attempts; i++) {
        if (page.frames().length <= 2) {
            return;
        } else {
            await sleep(timeout / attempts);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}`;
}
