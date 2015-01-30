# speechticulate
webkit speech recognition for articulate presentations

to install:
- get this repo as well as the `voicecontrol` branch of `dark-spider`.
- open your `chrome://extensions` page and make sure "Developer mode" checkbox
  is checked in the upper right corner.
- click the "Load unpacked extension" button.
- navigate to this folder on your local machine, and select the `v0.1` folder.

Currently working for "next" command and in localhost only (trying to figure out
how to allow chrome extensions in the file protocol). `grunt` has an express
server that it runs, but you'll need to set up a few symlinks from the `build`
folder to your presentation (specifically `build/html5`, `build/mobile` and
`build/story_content`). On a mac, the command is
`ln -s [preso folder full path] [build folder full path]`

