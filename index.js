const fs = require('fs');
const readline = require('readline');
const {once} = require('events');

console.log(`\x1b[37mSwatch-Board \x1b[90mCopyright © 2019 Lukalot (Luke N. Arnold) All Rights Reserved
\x1b[32m --> Starting process...\x1b[0m`);

(function checkExistingOutputOverwrite() {
  const outputFiles = fs.readdirSync('output_files/')
  // unfortunately, Node.js does not provide a way to automatically filter out hidden system files :(
    .filter((filename) => filename !== 'desktop.ini' && filename !== 'Thumbs.db' && filename.substr(0, 1) !== '.');

  if (outputFiles.length > 0) {
    console.warn('\x1b[33mWARNING: ' + outputFiles.length + ' files were already in the output folder, and have not been removed.\x1b[0m');
  }
})();

// Get arguments
const suffix = process.argv[2] || '';
const isLoggingEnabled = process.argv[3] || true;
const threshold = process.argv[4] || 20;

const targets = [];

async function readTargets() {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream('targets.txt'),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      if (line.trim() !== '') {
        const no_quotes = line.toLowerCase().split("'").join("");

        targets.push({
          raw: line,
          underscore: no_quotes.split(' ').join('_'),
          dash: no_quotes.split(' ').join('-'),
          none: no_quotes.split(' ').join('')
        });
      }
    });

    await once(rl, 'close');
    return targets;
  } catch (err) {
    console.error('Failed to process targets.txt:');
    throw err;
  }
}

function checkNameMatch(sourceName, target) {
  const noDigitsName = sourceName.replace(/[0-9]+/g, '');

  if (suffix && !noDigitsName.endsWith(suffix)) {
    return false;
  }

  const noDigitsLowercaseName = noDigitsName.toLowerCase();

  return (noDigitsLowercaseName.includes(target.underscore)
    || noDigitsLowercaseName.includes(target.dash)
    || noDigitsLowercaseName.includes(target.none));
}

function compareTargetsWithSources(targets) {
  const source_files = fs.readdirSync('source_files/'); // Array of files in the source_files folder
  const matched = [];

  for (let i = 0; i < source_files.length; i++) {
    for (let j = 0; j < targets.length; j++) {
      if (checkNameMatch(source_files[i], targets[j])) {
        fs.copyFileSync('source_files/' + source_files[i], 'output_files/' + source_files[i]);
        matched.push(targets[j].raw);

        if (isLoggingEnabled) {
          const nameMatchPercentage = Math.round((targets[j].raw.length + suffix.length) / (source_files[i].length) * 100);

          if (nameMatchPercentage < threshold) {
            console.log('  \x1b[33m[' + nameMatchPercentage + '%]\x1b[0m MATCH - ' + source_files[i] + ' / ' + targets[j].raw);
          } else {
            console.log('  [' + nameMatchPercentage + '%] MATCH - ' + source_files[i] + ' / ' + targets[j].raw);
          }
        }
      }
    }
  }

  return [targets, matched];
}

function showResults(results) {
  const [targets, matched] = results;
  const targetsNotMatched = targets.filter((target) => !matched.includes(target.raw));

  fs.writeFileSync('disparate_targets.log', `DISPARATE LOG - 'Logging $%&#ed up stuff since 2019'
  Recorded ${targetsNotMatched.length} unmatched targets in last process:\n\n` + targetsNotMatched.map(t => t.raw).join("\n"));

  console.log(`\x1b[32m --> Completed process with ${matched.length} match${(matched.length === 1) ? '' : 'es'}\x1b[0m`);
}

readTargets()
  .then(compareTargetsWithSources)
  .then(showResults)
  .catch(err => console.error(err));
