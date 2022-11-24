import { BaseGenerator, prompts,yParser } from '@umijs/utils';
import { join } from 'path'

const args = yParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h'],
  },
  boolean: ['version'],
});

const cwd =process.cwd()
const [ name ] = args._

const target = name ? join(cwd, name) : cwd;

const questions: prompts.PromptObject[] = [
 {
    name: 'name',
    type: 'text',
    message: `Input NPM package name (assets-xxx or gi-assets-xxx)`
  },
  {
    name: 'description',
    type: 'text',
    message: `Input project description`,
  },
  {
    name: 'author',
    type: 'text',
    message: `Input project author (Name <email@example.com>)`,
  },
];

const generator = new BaseGenerator({
  path: join(__dirname, `../templates`),
  target,
  data: {
    version: '^2.0.0-rc.0',
  },
  questions,
});

(async function () {
  await generator.run();
})()
