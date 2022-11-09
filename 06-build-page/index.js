const path = require('path');
const fs = require('fs');

try {
    fs.promises.mkdir(
        path.join(__dirname, "project-dist"),
        {recursive: true},
    )  
      
    fs.promises.mkdir(
        path.join(__dirname, "project-dist", "assets"),
        {recursive: true}
    )

} catch (err) {
    if (err) throw err
}

fs.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    "",
    (err) => {
        if (err) throw err;
    }
)

fs.readdir(
    path.join(__dirname, 'styles'),
    {withFileTypes: true},
    (err, files) => {
        if(err) throw err;
        fs.writeFile(
            path.join(__dirname, 'project-dist', 'style.css'),
             '',
              (err)=> {
                if(err) throw err;
              })
      
        files.forEach((file => {
            if(path.parse(path.join(__dirname, "styles", file.name)).ext === '.css') {
                fs.readFile(
                    path.join(__dirname, 'styles', file.name),
                    'utf-8',
                    (err, data) => {
                        if(err) throw err;
                        fs.appendFile(
                            path.join(__dirname, 'project-dist', 'style.css'),
                            data,
                            (err) => {
                                if(err) throw err
                            }
                        )
                    }

                )
            }

        }))
    }
)

fs.readdir(
    path.join(__dirname, 'assets'),
    {withFileTypes: true},
    (err, files) => {
        if(err) throw err
        files.forEach((file) => {
            if (!file.isFile()) {
                fs.promises.mkdir(
                path.join(__dirname, "project-dist", "assets", file.name),
                {recursive: true}
            ).then(
                copyFile(file.name)
            )
                
            };
        })
    }
)

function copyFile(dirname) {
    fs.readdir(
    path.join(__dirname, 'assets', dirname),
    { withFileTypes: true},
    (err, files) => {
        if(err) throw err
        files.forEach((file) => {
            fs.copyFile(
                path.join(__dirname, 'assets', dirname, file.name),
                path.join(__dirname, 'project-dist', "assets", dirname, file.name),
                (err) => {
                    if (err) throw err
                }
            )
        }

        )
    }
    )
}

fs.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
    (err, html) => {
        if(err) throw err;
        let htmlText = html;
        fs.readdir(
            path.join(__dirname, 'components'),
            { withFileTypes: true},
            (err, components) => {
                if(err) throw err;
                components.forEach((component, index) => {
                    fs.readFile(
                        path.join(__dirname, 'components', component.name),
                        'utf-8',
                        (err, componentInner) => {
                            if(err) throw err;
                            let componentFileName = component.name.split('.')[0];
                            htmlText = htmlText.replace(`{{${componentFileName}}}`, componentInner);
                            if(index == components.length-1) {
                                fs.appendFile(
                                    path.join(__dirname, 'project-dist', 'index.html'),
                                    htmlText,
                                    (err) => {
                                        if(err) throw err;
                                    }
                                )
                            }
                            
                        }
                    )
                })
            }
        )
    }
)
