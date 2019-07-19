# SWATCH-BOARD

Swatch-Board is an automated file search program for searching and matching bulk swatch color images to nail polish bottle names.
It can be used and modified for other purposes.

Swatch board finds and copies files that include specific phrases in their names to a new file.

## Installation

Swatch-Board requires [Node.js](https://nodejs.org/) to run.
If this requirement is met, run `npm install` in the root directory.

## Usage

Run the following command in the root directory:
`node index.js [suffix] [log] [warn]`

 - `[suffix]` String, default "". Filters only files that end with supplied string. `""` for no suffix.
 - `[log]` Bool, default true. Determines whether or not the process will log individual matches in the console.
 - `[warn]` Number, default 20. Matches below this target:filename percentage will be marked yellow when logged to the console to indicate they *might* require some attention.

The text file, `targets.txt`, in the root directory should contain all the names of the bottles whose swatches need to be separated.
You can simply go to any website (ex. www.premiernailsource.com) and copy/paste all the bottle names, as-is, in the `targets.txt` file.

Place the bulk, unfiltered set of files to be extracted from into the `source_files` directory, then run the program.
The result will be the `output_files` directory being populated with matching files.

Notice that this program does not remove files from the `output_files` directory before rerunning the program,
however it will warn you if you attempt to run the program while files still exist in the directory.
This means you must manually delete the files in the directory before running the program again,
or may want to run a different command to add other files to the output before finishing.

Information on the latest process' unmatched (disparate) targets is logged in `disparate_log.log` after every search.
