import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const args = process.argv.slice(2);
const source = args[0];
const sourcePath = path.resolve(source || '');
const targetPath = path.resolve('../', sourcePath.split('/').at(-1));
const injectPreBuildPath = path.resolve('./scripts/pre-build-inject.json');
const injectAssetsPath = path.resolve('./src/services/inject.ts');
const sitePkgPath = path.resolve('./', 'package.json');

function readPkgJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function modifyPkgJson(p, cb) {
  const pkgJson = readPkgJson(p);
  cb?.(pkgJson);
  fs.writeFileSync(p, JSON.stringify(pkgJson, null, 2));
}

const srcPkg = readPkgJson(path.resolve(sourcePath, 'package.json'));

const subModulePath = srcPkg.name.split('/');
// 创建子包路径，如会为包 @antv/gi-assets-xxx 创建 node_modules/@antv 目录
if (subModulePath.length > 1) {
  const subModuleFolder = path.resolve('./node_modules', ...subModulePath.slice(0, -1));
  !fs.existsSync(subModuleFolder) && fs.mkdirSync(subModuleFolder, { recursive: true });
}
const siteNodeModulePath = path.resolve('./node_modules', ...subModulePath);

/**
 * 初始化注入文件
 */
const initInject = (force = false) => {
  (force || !fs.existsSync(injectPreBuildPath)) && fs.writeFileSync(injectPreBuildPath, '[]');
  (force || !fs.existsSync(injectAssetsPath)) &&
    fs.writeFileSync(injectAssetsPath, `export default ${JSON.stringify({})};`);
};

initInject();

/**
 * 添加 gi-site 依赖
 */
function addDep() {
  modifyPkgJson(sitePkgPath, sitePkg => {
    sitePkg.dependencies[srcPkg.name] = 'workspace:*';
  });

  execSync(`npx prettier --write ${sitePkgPath}`);
}

/**
 * 移除 gi-site 依赖
 */
function removeDep() {
  modifyPkgJson(sitePkgPath, sitePkg => {
    delete sitePkg.dependencies[srcPkg.name];
  });
  execSync(`npx prettier --write ${sitePkgPath}`);
}

function execGitCommand(command) {
  return execSync(command)
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '');
}

/**
 * 回写数据
 */
function eject() {
  copyDir(targetPath, sourcePath);

  // 回写 package.json 版本号
  modifyPkgJson(path.resolve(sourcePath, 'package.json'), pkgJson => {
    if (pkgJson['dependencies']['@antv/gi-sdk']) {
      const giSDKPkgJson = readPkgJson(path.resolve('../gi-sdk/package.json'));
      pkgJson['dependencies']['@antv/gi-sdk'] = `^${giSDKPkgJson.version}`;
    }
    if (pkgJson['dependencies']['@antv/gi-common-components']) {
      const giCommonComponentsPkgJson = readPkgJson(path.resolve('../gi-common-components/package.json'));
      pkgJson['dependencies']['@antv/gi-common-components'] = `^${giCommonComponentsPkgJson.version}`;
    }
  });
}

/**
 * 断开链接，回写内容并移除链接内容
 * @param clear 是否移除 G6VP 内的链接内容
 */
function unlink() {
  initInject(true);

  eject();

  removeDep();

  // 删除 packages/ 下的 source 链接
  execSync(`rm -rf ${targetPath}`);
  // 删除 gi-site/node_modules 下的 source 链接
  execSync(`rm -rf ${siteNodeModulePath}`);
}

function link() {
  let branch;

  try {
    branch = execGitCommand(`cd ${sourcePath} && git rev-parse --abbrev-ref HEAD`);
  } catch {
    // 如果不存在 git 仓库，则不进行 git 操作
  }

  // 将 sourcePath 链接到 packages/ 以及 gi-site/node_modules 下
  if (!fs.existsSync(targetPath)) {
    copyDir(sourcePath, targetPath);
    // 修改 package.json 中的 gi-sdk 依赖为 'workspace:*'
    modifyPkgJson(path.resolve(targetPath, 'package.json'), targetPkgJson => {
      if (targetPkgJson.dependencies['@antv/gi-sdk']) {
        targetPkgJson.dependencies['@antv/gi-sdk'] = 'workspace:*';
      }
      if (targetPkgJson.dependencies['@antv/gi-common-components']) {
        targetPkgJson.dependencies['@antv/gi-common-components'] = 'workspace:*';
      }
    });
  }
  if (!fs.existsSync(siteNodeModulePath)) {
    fs.symlinkSync(targetPath, siteNodeModulePath);
  }

  // 校验是否存在 build:es 命令
  if (!srcPkg?.scripts['build:es']) {
    console.error('\x1b[31m\x1b[1mpackage.json 中不存在 build:es 命令\x1b[0m');
    console.warn('\x1b[33m添加命令: \x1b[1m"build:es": "father build"\x1b[0m');
    modifyPkgJson(path.resolve(targetPath, 'package.json'), pkgJson => {
      pkgJson.scripts['build:es'] = 'father build';
    });
  }

  // 将 package.json 中的依赖信息写入到 pre-build-inject.json 中
  let glb = args[1];
  if (!glb) {
    glb = srcPkg.name.split('/').at(-1).replace(/-/g, '_').toUpperCase();
    console.warn(`\x1b[33m未指定全局变量名，将使用:${glb} 导出\x1b[0m`);
  }
  const dep = { name: srcPkg.name, version: srcPkg.version, global: glb };
  fs.writeFileSync(injectPreBuildPath, JSON.stringify([dep], null, 2));
  fs.writeFileSync(injectAssetsPath, `import * as ${glb} from '${srcPkg.name}';\nexport default { ${glb} };`);

  // 切换分支
  branch && execGitCommand(`cd ${targetPath} && git checkout ${branch}`);

  addDep();

  console.log('安装依赖、执行构建...');
  try {
    execSync(`cd ${targetPath} && pnpm i`);
  } catch (e) {
    console.log('\x1b[31m$操作失败，手动执行 \x1b[1m pnpm i \x1b[0m\x1b[31m以查看异常信息...\x1b[0m');
  }
}

/**
 * 等待操作
 */
function waitingForUnlink() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(`按[回车]执行回写操作，该操作会覆盖源码 \x1b[31m${source}\x1b[0m`, answer => {
    if (answer === '') {
      rl.question('回写后是否断开链接? (y/n): ', answer => {
        if (answer === 'y') unlink();
        else eject();
        console.log('回写成功!');
        rl.close();
      });
    } else {
      console.log('取消回写');
      rl.close();
    }
  });
}

/** 下列文件夹不同步 */
const baseSkipDirs = ['node_modules', 'dist', 'lib', 'es', '.DS_Store', '.umi', '.turbo'];
/** 下列文件夹不进行遍历复制，而是直接重建 */
const baseOverwriteDirs = ['.git'];

function copyFileSyncWithSudo(src, tgt) {
  try {
    fs.copyFileSync(src, tgt);
  } catch (error) {
    // 没有权限时，申请 sudo 权限
    if (error.code === 'EACCES') {
      console.log('\x1b[31m以管理员权限写入文件：\x1b[0m', tgt);
      execSync(`sudo cp -r ${src} ${tgt}`);
    }
  }
}

/**
 * 复制目录
 */
function copyDir(sourceDir, targetDir, options = { skipDirs: baseSkipDirs, overwriteDirs: baseOverwriteDirs }) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  const files = fs.readdirSync(sourceDir);
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (options?.skipDirs?.includes(file)) {
      return;
    }

    if (options?.overwriteDirs?.includes(file)) {
      fs.rmdirSync(targetPath, { recursive: true });
    }
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath, options);
    } else {
      copyFileSyncWithSudo(sourcePath, targetPath);
    }
  });
}

if (!source) {
  console.log('使用示例: pnpm run link <source> [global name]');
} else if (process.env.UNLINK === 'true' || args[1] === 'unlink') {
  console.log(`\x1b[1m${source}\x1b[0m`, '\x1b[31m\x1b[1m-/->\x1b[0m', `\x1b[1m${targetPath}\x1b[0m`);
  unlink();
} else if (process.env.EJECT === 'true' || args[1] === 'eject') {
  console.log('\x1b[1m🖍 ->\x1b[0m', `\x1b[1m${source}\x1b[0m`);
  eject();
} else {
  link();
  console.log(`\x1b[42m 链接成功，该阶段请勿编辑源码 ${source} \x1b[0m`);
  console.log(`\x1b[1m${source}\x1b[0m`, '\x1b[31m\x1b[1m-->\x1b[0m', `\x1b[1m${targetPath}\x1b[0m`);
  // 等待回写命令
  waitingForUnlink();
}
