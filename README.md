# Bulk File Filter

Bulk File Filter is a script for file filtering *by name*.

## Installation

Bulk File Filter requires [Node.js](https://nodejs.org/) to run.
If this requirement is met, run `npm install` in the root directory.

## Usage

1. You must put the search keywords in `targets.txt`, each search phrase on its own line.

    Example:
    ```
    foo
    bar baz
    ```
    
    will find files with names like `FoO-bAr.jpg`, `_BAR_baz.png` and `Bar0_Baz.gif`,
    but will not match names like `bar.bmp`.

2. Put the files to be filtered inside the directory named `source_files`.

3. Run the following command in the root directory:
    
    `node index.js [suffix] [log] [warn]`
    
     - `[suffix]` String, default "". Filters only files that end with supplied string. `""` for no suffix.
     - `[log]` Bool, default true. Determines whether or not the process will log individual matches in the console.
     - `[warn]` Number, default 20. Matches below this target:filename percentage will be marked yellow when logged to the console to indicate they *might* require some attention.

After running the script, the files that matched the target keywords will be **copied** into the directory named `output_files`.

Notice that this program does not clear the `output_files` directory before rerunning the program,
however it will warn you if you attempt to run the program while files still exist in the directory.
This means you must manually delete the files in the directory before running the program again,
or may want to run a different command to add other files to the output before finishing.

Information on the latest process' unmatched (disparate) targets is logged in `disparate_targets.log` after every search (this file is overwritten every time).
