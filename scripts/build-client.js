import { readFile, writeFile } from 'node:fs/promises';
import { remoteContribution } from '../remote.js';

const templateUrl = new URL('../src/client.template.js', import.meta.url);
const outputUrl = new URL('../client.js', import.meta.url);

const template = await readFile(templateUrl, 'utf8');
const inlined = remoteContribution
  .toString()
  .split('\n')
  .map((line, index) => (index === 0 || !line ? line : `    ${line}`))
  .join('\n');

await writeFile(
  outputUrl,
  template.replace('/* REMOTE_CONTRIBUTION */', `const remoteContribution = ${inlined};`),
);
