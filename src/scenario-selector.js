const fs = require('fs');
const path = require('path');
const readline = require('readline');

// configuration
const inputDir = './2-transformed-code';
const outputDir = './3-scenario'
const outputFile = 'playwright-scenario.js'
const encoding = 'utf8';

fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }
    if (files.length === 0) {
        console.log('No files found in the directory.');
        return;
    }
    // Display the list of files
    console.log('Files in the directory:');
    files.forEach((file, index) => {
        if (file === '.gitkeep') {
            return;
        }
        console.log(`${index} = ${file}`);
    });

    // Prompt the user for an index
    const input = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    input.question('Enter the index of the scenario file: ', (answer) => {
        input.close();

        const fileIndex = parseInt(answer);
        if (isNaN(fileIndex) || fileIndex < 0 || fileIndex > files.length) {
            console.error('Invalid file index.');
            return;
        }

        const selectedFile = files[fileIndex];
        const filePath = path.join(inputDir, selectedFile);

        // Read the content of the selected file
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            const outputPath = path.join(outputDir, outputFile);
            fs.writeFile(outputPath, data, encoding, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log(`Transformed ${selectedFile} and saved as ${outputPath}`);
            });
        });
    });
});
