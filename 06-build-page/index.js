const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');

fs.access(projectDist, error => {
  if (error) {
    createFolders();
  } else {
    recreateFiles();
  };
});

function createFolders() {
  const assetsDist = path.join(__dirname, 'assets');
  const assetsCopyDist = path.join(projectDist, 'assets');

  fs.mkdir(projectDist, { recursive: true }, err => {
    if (err) throw err;
   
    fs.mkdir(assetsCopyDist, { recursive: true }, err => {
      if (err) throw err;
      copyAssets(assetsDist);
      createAndFillStyle();
      createAndFillHTML();
    });
  });
};

function recreateFiles() {
  fs.rm(projectDist, { recursive: true, force: true }, (err) => {
    if (err) throw err;
    createFolders();
  });
};

function copyAssets(pathFile) {
  fs.readdir(pathFile, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      const filePath = path.join(pathFile, file);

      fs.stat(filePath, (err, stats) => {
        if (err) throw err;

        if (stats.isDirectory()) {
          createNewFolders(filePath, file);
          copyAssets(filePath);
        } else {
          copyFiles(filePath, file);
        };
      });
    });
  });
};

function createNewFolders(filePath, fileName) {
  const newFolder = filePath.replace(/assets/gi, 'project-dist\\assets');

  fs.mkdir(newFolder, err => {
    if (err) throw err;
   });
};

function copyFiles(originalPath, fileName) {
  const fileCopy = originalPath.replace(/assets/gi, 'project-dist\\assets');

  fs.copyFile(originalPath, fileCopy, err => {
    if (err) throw err;
    });
};

function createAndFillStyle() {
  const stylePath = path.join(projectDist, `style.css`);
  const styles = path.join(__dirname, 'styles');

  fs.writeFile(stylePath, '', err => {
    if (err) throw err;
    
    fs.readdir(styles, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        const pathFile = path.join(styles, file);

        if (path.extname(pathFile) === '.css') {
          fs.readFile(pathFile, 'utf-8', (err, data) => {
            if (err) throw err;

            fs.appendFile(stylePath, `${data}\n`, err => {
              if (err) throw err;
            });
          });
        };
      });
    });
  });
};

function createAndFillHTML() {
  const mainHTML = path.join(projectDist, 'index.html');
  const templateHTML = path.join(__dirname, 'template.html');
  const dirComponentsHTML = path.join(__dirname, 'components');

  fs.writeFile(mainHTML, '', err => {
    if (err) throw err;
     });

  fs.readFile(templateHTML, 'utf-8', (err, data) => {
    if (err) throw err;
    let dataHTML = data;

    fs.readdir(dirComponentsHTML, async(err, files) => {
      if (err) throw err;

      for (let file of files) {
        const fileName = file.replace(/.html/gi, '');
        if (dataHTML.includes(`{{${fileName}}}`)) {
          const fileComponents = path.join(dirComponentsHTML, file);

          await fs.promises.readFile(fileComponents, 'utf-8')
            .then(async fileData => {
              dataHTML = dataHTML.replaceAll(`{{${fileName}}}`, fileData);

              await fs.promises.writeFile(mainHTML, dataHTML)
                .then(err => {
                  if (err) throw err;
                });
            });
        };
      };
    });
  });
};
