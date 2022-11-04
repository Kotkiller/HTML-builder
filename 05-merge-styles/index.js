const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');
const pathToBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
const pathToStyleFile = path.join(__dirname, 'styles');

fsp.rm(pathToBundleFile, { force: true }).then(() => {
    fs.readdir(pathToStyleFile, { withFileTypes: true }, (_, files) => {
        let chain = Promise.resolve();
        files.forEach((file) => {
            if (file.isFile()) {
                const pathToFile = path.join(__dirname, 'styles', `${file.name}`);
                const fileExt = path.extname(pathToFile).slice(1);
                if (fileExt === 'css') {
                    chain = chain
                        .then(() => {
                            return fsp.readFile(pathToFile);
                        })
                        .then((data) => {
                            return fsp.appendFile(pathToBundleFile, data);
                        })
                }   
            }
        })
    });
});