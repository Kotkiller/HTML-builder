const fs = require('fs');   //доступ к файловой системе
const path = require('path'); //доступ к путям
const textPath = path.join(__dirname, 'text.txt'); //путь к файлу
const { stdin: input, stdout: output, exit } = require('process'); //стандартные потоки ввода и вывода информации
const readline = require('readline');
const writeStream=fs.createWriteStream(textPath); //запись данных в файл
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