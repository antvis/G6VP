const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 从命令行参数获取 repoUrl 和 cloneDir
const [, , repoUrl, cloneDirPath] = process.argv;

const cloneDir = path.join(__dirname, '../', cloneDirPath);
const packageJsonPath = path.join(__dirname, '../', `${cloneDirPath}/package.json`);
const siteJsonPath = path.join(__dirname, '../', 'packages/gi-site/package.json');

function cloneRepository() {
  if (fs.existsSync(cloneDir)) {
    console.log('目录已存在，跳过克隆操作。');
    return;
  }

  exec(`git clone ${repoUrl} ${cloneDir}`, (err, stdout, stderr) => {
    if (err) {
      console.error('克隆仓库时出错:', err);
      return;
    }
    console.log('仓库克隆成功。');
  });
}

function updatePackageJson() {
  if (!fs.existsSync(packageJsonPath)) {
    console.log('package.json 文件不存在，跳过更新操作。');
    return;
  }
  let pkgName;

  /** update asset package.json */
  fs.readFile(packageJsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('读取文件时出错:', err);
      return;
    }

    let packageJson;

    try {
      packageJson = JSON.parse(data);
    } catch (jsonErr) {
      console.error('解析 JSON 时出错:', jsonErr);
      return;
    }

    const dependencies = packageJson.dependencies;
    pkgName = packageJson.name;
    let updated = false;
    if (dependencies) {
      if (dependencies['@antv/gi-sdk']) {
        dependencies['@antv/gi-sdk'] = 'workspace:*';
        updated = true;
      }
      if (dependencies['@antv/graphin']) {
        dependencies['@antv/graphin'] = 'workspace:*';
        updated = true;
      }
    }

    if (updated) {
      fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', writeErr => {
        if (writeErr) {
          console.error('写入文件时出错:', writeErr);
          return;
        }
        console.log(`${pkgName} package.json 已更新。`);
      });
    } else {
      console.log(`无需更新 ${pkgName}  package.json。`);
    }

    updateSite(pkgName);
  });
}
/** update asset site.json */
function updateSite(pkgName) {
  fs.readFile(siteJsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('读取文件时出错:', err);
      return;
    }
    let packageJson;
    try {
      packageJson = JSON.parse(data);
    } catch (jsonErr) {
      console.error('解析 JSON 时出错:', jsonErr);
      return;
    }
    const dependencies = packageJson.dependencies;

    let updated = false;

    if (!dependencies[pkgName]) {
      dependencies[pkgName] = 'workspace:*';
      updated = true;
    }

    if (updated) {
      fs.writeFile(siteJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', writeErr => {
        if (writeErr) {
          console.error('写入文件时出错:', writeErr);
          return;
        }
        console.log('site package.json 已更新。');
      });
    } else {
      console.log('无需更新 site package.json。');
    }
  });
}

// 执行脚本
cloneRepository();
updatePackageJson();
