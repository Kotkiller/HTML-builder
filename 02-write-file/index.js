const fs = require('fs');
const path = require('path');
const textPath = path.join(__dirname, 'text.txt');
const { stdin: input, stdout: output, exit } = require('process');
const readline = require('readline');
const writeStream=fs.createWriteStream(textPath);
const readLine = readline.createInterface({input, output});
output.write('Hi! Please, write anything you want!)\n');

readLine.on('line', (input) => {
  if (input !== 'exit') {
    writeStream.write(input)
     } else {
       output.write('See you later :)\n');
       exit(0);
    }
});

readLine.on('close', () => {
    output.write('God bye :)\n');
})