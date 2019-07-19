const fs = require('fs');

console.log(`\x1b[37mSwatch-Board \x1b[90mCopyright © 2019 Lukalot (Luke N. Arnold) All Rights Reserved
\x1b[32m --> Starting process...\x1b[0m`);

(function checkExistingOutputOverwrite() {
  const outputFiles = fs.readdirSync('output_files/')
  // unfortunately, Node.js does not provide a way to automatically filter out hidden system files :(
    .filter((filename) => filename !== 'desktop.ini' && filename !== 'Thumbs.db');

  if (outputFiles.length > 0) {
    console.warn('\x1b[33mWARNING: ' + outputFiles.length + ' files were already in the output folder, and have not been removed.\x1b[0m');
  }
})();

// Get arguments
const suffix = process.argv[2] || '';
const isLoggingEnabled = process.argv[3] || true;
const threshold = process.argv[4] || 20;

// Get data
var source_files = fs.readdirSync('source_files/'); // Array of files in the source_files folder
var targets_raw = fs.readFileSync('targets.txt').toString().split("\r\n") // Array of names in the targets.txt file
  .filter(line => !!line); // Remove empty lines
var targets_underscore = []; // Array of target names formatted with underscores
var targets_dash = []; // Array of target names formatted with dashes
var targets_none = []; // Array of target names formatted with nothing ""
var matched = [];

// Create the underscore, dash, and empty variants of our target names and complete them with the supplied suffix.
for (let i = 0; i < targets_raw.length; i++) {
  const no_quotes = targets_raw[i].toLowerCase().split("'").join("");

  targets_underscore.push(no_quotes.split(" ").join("_"));
  targets_dash.push(no_quotes.split(" ").join("-"));
  targets_none.push(no_quotes.split(" ").join(""));
}

function checkNameMatch(sourceName, targetIndex) {
  const noDigitsName = sourceName.replace(/[0-9]+/g, '');

  if (suffix && !noDigitsName.endsWith(suffix)) {
    return false;
  }

  const noDigitsLowercaseName = noDigitsName.toLowerCase();

  return (noDigitsLowercaseName.includes(targets_underscore[targetIndex])
    || noDigitsLowercaseName.includes(targets_dash[targetIndex])
    || noDigitsLowercaseName.includes(targets_none[targetIndex]));
}

// Compare the source with the targets in every possible combination.
for (i = 0; i < source_files.length; i++) {
  for(j in targets_raw) {
    if (checkNameMatch(source_files[i], j)) {
      // Copy the file as a match
      fs.copyFileSync("source_files/" + source_files[i], "output_files/" + source_files[i]);
      matched.push(targets_raw[j]);

      if (isLoggingEnabled) {
        var bottle_to_filename_pct = Math.round((targets_raw[j].length + suffix.length)/(source_files[i].length)*100);
        if (bottle_to_filename_pct < threshold) {
          console.log( "  \x1b[33m[" + bottle_to_filename_pct + "%]\x1b[0m MATCH - " + source_files[i] + " / " + targets_raw[j])
        } else {
          console.log( "  [" + bottle_to_filename_pct + "%] MATCH - " + source_files[i] + " / " + targets_raw[j])
        }
      }
    }
  }
}

// Now get forget all of the ones we found so we can know which we didnt find. (all - matched = unmatched)
for (i in matched) {
  for(j in targets_raw) {
    if (matched[i] === targets_raw[j]) {
      targets_raw.splice(j, 1);
    }
  }
}

// Log disparate files
fs.writeFileSync("disparate_log.log",  `DISPARATE LOG - "Logging $%&#ed up stuff since 2019"
  Recorded ${targets_raw.length} unmatched targets in last process:\n\n` + targets_raw.join("\n"));

console.log(`\x1b[32m --> Completed process with ${matched.length} match${(matched.length === 1) ? '' : 'es'}\x1b[0m`);
