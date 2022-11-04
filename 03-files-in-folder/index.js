const fs = require('fs');
const path = require('path');
const pathToSecretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToSecretFolder, { withFileTypes: true }, (_, files) => {
    files.forEach((file) => {
        if (file.isFile()) {
            const pathToFiles = path.join(__dirname, 'secret-folder', `${file.name}`);
                fs.stat(pathToFiles, (_, stats) => {
                const fileName = path.basename(pathToFiles, `${path.extname(pathToFiles)}`);
                const fileExt = path.extname(pathToFiles).slice(1);
                const fileSize = `${(stats.size / 1024).toFixed(3)}kb`;
                console.log(`${fileName} - ${fileExt} - ${fileSize}`);
            })
        }
    })
});