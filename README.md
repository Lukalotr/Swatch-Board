# SWATCH-BOARD

Swatch-Board is an automated file search program for searching and matching bulk swatch color images to nail polish bottle names. It can be used and modified for other purposes.

Swatch board finds and copies files that include specific phrases in their names to a new file.

# Use
If you want to use this program, this section might be important. Like, seriously, just read it.

Use like:
`node path/to/directory/index.js [suffix] [log] [warn]`

 - `[suffix]` String, defualt "". Filters only files that end with supplied string. `""` for no suffix.
 - `[log]` Bool, defualt true. Determines wether or not the process will log individual matches in the console.
 - `[warn]` Number, defualt 20. Matches below this target:filename percentage will be marked yellow when logged to the console to indicate they *might* require some attention.

The text file, `targets.txt`, in the directory is all the names of the bottles which swatches need to be seperated. You can simply go to any website (ex. www.premiernailsource.com) and copy from the first bottle name to the last bottle name you need to find and paste all the names, as-is, in the targets.txt file.

Place the bulk, unfiltered set of files to be extracted from into the `source_files` directory. Then run the program with the console command above. The result will be the `output_files` directory being populated with matching files.

Notice that Swatch-Board does not remove files from the output_files directory before rerunning the program, however it will warn you if you attempt to run the program while files still exist in the directory. This means you must manually delete the files in the directory before running the program again, or may want to run a different command to add other files to the output before finishing.

Information on the latest process' unmatched (disparate) targets is logged in `disparate_log.txt` after every search.

### Installation

Swatch-Board requires [Node.js](https://nodejs.org/) to run.

If the program files are downloaded on your computer and node.js is installed you may use Swatch-Board as specified in the Use section.
