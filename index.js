
const fs = require('fs-extra')

// Get arguments
var suf = process.argv[2];
var log = process.argv[3] || true;
var threshhold = process.argv[4] || 20;

// Get data
var targets_raw = fs.readFileSync('targets.txt').toString().split("\r\n"); // Array of names in the targets.txt file
var targets_underscore = []; // Array of target names formatted with underscores
var targets_dash = []; // Array of target names formatted with dashes
var targets_none = []; // Array of target names formatted with nothing ""
var source_files = []; // Array of files in the source_files folder
var matched = [];

// Output related
var matches = 0; // Records matches
var mwarn = function() { // Warn when mixing output files with old output files
  if ( fs.readdirSync("output_files/")[0] != "desktop.ini" && fs.readdirSync("output_files/")[0] != undefined || fs.readdirSync("output_files/").length > 1 ) {
    return "| \x1b[33mWARNING: " + fs.readdirSync("output_files/").filter(function(e) { return e !== 'desktop.ini' }).length + " files were already in the output folder, and have not been removed.\x1b[0m"
  } else { return "" }
}
var es = function(m) { if ( m != 1 ) { return "es" } else { return "" } } // Grammatically correct plural in console.log
var bottle_to_filename_pct;

targets_raw = targets_raw.filter(n => n) // Remove empty array elements

source_files = fs.readdirSync("source_files/") // Get source files

console.log(`\x1b[37mSwatch-Board \x1b[90mCopyright © 2019 Lukalot (Luke N. Arnold) All Rights Reserved
\x1b[32m --> Starting process \x1b[0m` + mwarn())

// Create the underscore, dash, and empty variants of our target names and complete them with the supplied suffix.
for(i in targets_raw) {
  const no_quotes = targets_raw[i].toLowerCase().split("'").join("");

  targets_underscore.push(no_quotes.split(" ").join("_"));
  targets_dash.push(no_quotes.split(" ").join("-"));
  targets_none.push(no_quotes.split(" ").join(""));
}

// Compare the source with the targets in every possible combination.
for(i in source_files) {
  for(j in targets_raw) {

    if (source_files[i].replace(/[0-9]+/g, "").toLowerCase().includes(targets_underscore[j]) && source_files[i].replace(/[0-9]+/g, "").endsWith(suf)
    ||  source_files[i].replace(/[0-9]+/g, "").toLowerCase().includes(targets_dash[j])       && source_files[i].replace(/[0-9]+/g, "").endsWith(suf)
    ||  source_files[i].replace(/[0-9]+/g, "").toLowerCase().includes(targets_none[j])       && source_files[i].replace(/[0-9]+/g, "").endsWith(suf)) {
      // Copy the file as a match
      fs.copyFileSync("source_files/" + source_files[i], "output_files/" + source_files[i])
      matched.push(targets_raw[j])
      matches ++; // Record the match
      var bottle_to_filename_pct = Math.round((targets_raw[j].length + suf.length)/(source_files[i].length)*100)
      if (log) {
        if (bottle_to_filename_pct < threshhold) {
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
fs.writeFileSync("disparate_log.txt",  `DISPARATE LOG - "Logging $%&#ed up stuff since 2019"
  Recorded ${targets_raw.length} unmatched targets in last process:\n\n` + targets_raw.join("\n") )

// Complete
console.log(`\x1b[32m --> Completed process with ${matches} match` + es(matches) + "\x1b[0m")
