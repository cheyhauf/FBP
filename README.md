# FBP
A data saving balance planner created with the electron framework.

This application was developed for a sole target of my girlfriend, and serves as a largely over-engineered command line program that collects user input in state of the 
art UI to persist and translate that data for later manipulation using Python and it's collective data science libraries.

This unfortunately is not in a distributable executable format at the moment. While the application can be opened by using "npm/yarn install" and then "npm start" in the same directory,
a single file executable was produced on the latest MacOS, Ventura, using the npm electron-forge.

The ui is not the most intuitive, but each expense column row will subtract from the corresponding budget column row, and the totals are tracked on the bottom.
The buttons near the inputs not only allow modifcation of the data but try to minimally highlight which values are able to be changed on the button press.

The theme can be changed by hovering over the theme button, the Luna theme is contorversially to low of a contrast but the sole user approves of it so it made it into the
the repository

The two buttons that appear in the console are simply quality of life buttons, the handwashing symbol will clear the console, yet the data will persist in the user's
OS specified application data directory. The window revert button simply resizes the window back to its default size should the ui be too unappealing in a different size.

As there is not a single executable for windows, the only data that should persist upon the deleting the directory for uninstall is the data backup. This is located in
the application data folder that should default to C:\Users\cheyhauf\AppData\Roaming\franks-balance-planner

