import { writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('type', {
    alias: 't',
    describe: 'Release type (major, minor, patch)',
    choices: ['major', 'minor', 'patch'],
    demandOption: true,
  })
  .help()
  .alias('help', 'h').argv;

const releaseType = argv.type;

function getLatestVersion(releasesPath) {
  const files = readdirSync(releasesPath);
  const versions = files.map(file => {
    const match = file.match(/^v(\d+\.\d+\.\d+)\.md$/);
    return match ? match[1] : '';
  }).filter(Boolean);

  const sortedVersions = versions.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  return sortedVersions[0] || '0.0.0';
}

function incrementVersion(version, type) {
  const parts = version.split('.').map(part => parseInt(part, 10));
  switch (type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
      parts[2]++;
      break;
  }
  return parts.join('.');
}

const releasesPath = join('.', 'releases');
const currentVersion = getLatestVersion(releasesPath);
const newVersion = incrementVersion(currentVersion, releaseType);
const fileName = `v${newVersion}.md`;
const filePath = join(releasesPath, fileName);

const content = `# Release ${newVersion}

## Overview

This release introduces several new features and improvements, along with various bug fixes. For more detailed information, please refer to the sections below.

## What's New

- Detailed description of new feature 1
- Detailed description of new feature 2

## Improvements

- Improvement 1 with more details
- Improvement 2 with more details

## Bug Fixes

- Description of fix 1
- Description of fix 2

## Acknowledgments

Special thanks to our contributors and community for their support and suggestions in this release.

## Upgrade Notes

Important notes about upgrading from the previous version, if any, including breaking changes.

---

For a full list of changes, please refer to the [changelog](LINK_TO_CHANGELOG).
`;

writeFileSync(filePath, content, 'utf8');
console.log(`Release note template generated at: ${filePath}`);
