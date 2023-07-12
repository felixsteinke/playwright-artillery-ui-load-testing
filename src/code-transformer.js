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
        if (line.trim().startsWith('await')) {
            const code = line.trim().replaceAll('await', '').trim();
            transformedContent += transformCodeLine(code, eIndex);
            eIndex++;
        } else if (line.trim().startsWith('const')) {
            transformedContent += `
    ${line.trim()}\n`;
        }
    });
    if (!transformedContent.startsWith('await page.goto')){
        transformedContent = `
    await page.goto(pageUrl)\n` + transformedContent;
    }
    return transformedContent;
}

function transformCodeLine(code, eIndex) {
    const locator = extractLocator(code);
    if (locator.startsWith('page.goto')) {
        return `
    await ${code}\n`;
    }
    const action = extractAction(code);
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
    if (timeout) {
        await locator.isVisible({ timeout: timeout });
    } else {
        await locator.isVisible({ timeout: 5000 });
    }
}`;
}

// Function to extract the locator from a line of code
function extractLocator(code) {
    return code.substring(0, code.lastIndexOf('.'));
}

// Function to extract the action from a line of code
function extractAction(code) {
    return code.substring(code.lastIndexOf('.')).replaceAll(';', '');
}
