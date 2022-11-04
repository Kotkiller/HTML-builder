const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');
const pathToDistDir = path.join(__dirname, 'project-dist');
const pathToDistDirStyle = path.join(__dirname, 'project-dist', 'style.css');
const pathToStyle = path.join(__dirname, 'styles');
const pathToAssetsDir = path.join(__dirname, 'assets'); 
const pathToCopiedAssetsDir = path.join(pathToDistDir, 'assets'); 
const pathToDistDirHTML = path.join(__dirname, 'project-dist', 'index.html');
const pathToTemplateFile = path.join(__dirname, 'template.html');
const pathToComponentsDir = path.join(__dirname, 'components');

function addStyle() {
    fsp.rm(pathToDistDirStyle, { force: true }).then(() => {
        fs.readdir(pathToStyle, { withFileTypes: true }, (_, files) => {
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
                                return fsp.appendFile(pathToDistDirStyle, data);
                            })
                    }   
                }
            })
        });
    });
}

function copyAssets(pathToAssetsDir, pathToCopiedAssetsDir) {
    fs.readdir(pathToAssetsDir, { withFileTypes: true }, (_, items) => {
        items.forEach((item) => {
            if (item.isFile()) {
                const pathToFile = path.join(pathToAssetsDir, item.name);
                const pathToCopiedFile = path.join(pathToCopiedAssetsDir, item.name);
                
                fsp.copyFile(pathToFile, pathToCopiedFile);
                
            } else if (item.isDirectory()) {
                const nestedPath = path.join(pathToAssetsDir, item.name);
                const nestedPathToCopied = path.join(pathToCopiedAssetsDir, item.name);
                fsp.mkdir(nestedPathToCopied).then(() => copyAssets(nestedPath, nestedPathToCopied));
            }
        })
    });
};

function copyContent() {
    return fsp.mkdir(pathToDistDir)
        .then(() => addStyle())
        .then(() => fsp.mkdir(pathToCopiedAssetsDir))
        .then(() => {
            createIndexHTML();
            copyAssets(pathToAssetsDir, pathToCopiedAssetsDir);
        });
}

function createIndexHTML() {
    fs.readdir(pathToComponentsDir, { withFileTypes: true }, (_, files) => {
        const filesPath = files.map(file => path.join(pathToComponentsDir, file.name));
        const filesContent = filesPath.map(filePath => fsp.readFile(filePath));

        Promise.all([
            fsp.readFile(pathToTemplateFile),
            ...filesContent, 
        ]).then(([template, ...contents]) => {
            let result = template.toString();
            contents.forEach((content, index) => {
                const contentString = content.toString();
                const fileName = files[index].name.split('.')[0];
                result = result.replace(`{{${fileName}}}`, contentString);
            });
            fsp.appendFile(pathToDistDirHTML, result);
        })
    })
}

fs.access(pathToDistDir, (error) => {
    if (error) {
        copyContent();
    } else {
        fsp.rmdir(pathToDistDir, { recursive: true })
            .then(() => copyContent())
    }
})


