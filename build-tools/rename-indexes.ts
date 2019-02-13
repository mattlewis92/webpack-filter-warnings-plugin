import * as fs from 'fs';
import glob from 'glob';
import * as path from 'path';

interface PathToReplace {
  originalPath: string;
  newPath: string;
}

/**
 * Renames Typescript index files.
 * As neither Typescript or Babel have capability of easily renaming files along transpiling,
 * this one creates consistent file names that are easier to use for library consumers
 */
glob('ts-out/**/index.**', (err, files) => {
  const renameMap = files.reduce((memo: PathToReplace[], file) => {
    const newFilename = file.replace(/(.*\/index)\.(cjs|es)(\.d)*\.(ts|js)/, '$1$3.$4');

    const originalPath = path.resolve(__dirname, '..', file);
    const newPath = path.resolve(__dirname, '..', newFilename);

    if (originalPath !== newPath) {
      memo.push({
        originalPath,
        newPath,
      });
    }

    return memo;
  }, [] as PathToReplace[]);

  if (renameMap.length) {
    console.log(`Found ${renameMap.length} index files to rename.`); // tslint:disable-line

    renameMap.forEach((renameEntry: PathToReplace) => {
      console.log(`Renaming ${renameEntry.originalPath} to ${path.basename(renameEntry.newPath)}`); // tslint:disable-line
      fs.renameSync(renameEntry.originalPath, renameEntry.newPath);
    });
  }
});
