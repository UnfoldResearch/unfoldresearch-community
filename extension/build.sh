#! /bin/sh

OUTPUT_DIR=build

# COL_BLACK='\033[0;30m'
# COL_RED='\033[0;31m'
# COL_GREEN='\033[0;32m'
# COL_BROWN='\033[0;33m'
# COL_BLUE='\033[0;34m'
# COL_LIGHT_RED='\033[1;31m'
# COL_LIGHT_GREEN='\033[1;32m'
# COL_YELLOW='\033[1;33m'
# COL_LIGHT_BLUE='\033[1;34m'
# COL_LIGHT_PURPLE='\033[1;35m'
# COL_LIGHT_CYAN='\033[1;36m'
# COL_WHITE='\033[1;37m'
# COL_LIGHT_GRAY='\033[0;37m'
# COL_PURPLE='\033[0;35m'
COL_CYAN='\033[0;36m'
COL_NONE='\033[0m'


# update overrides
# cd option
# bun run rewire-config
# cd ../popup
# bun run rewire-config
# cd content_scripts/app
# bun run rewire-config
# cd ../..

# cleanup
printf "${COL_CYAN}# Preparing...${COL_NONE}\n"
rm -rf $OUTPUT_DIR
mkdir $OUTPUT_DIR

# add meta files
cp manifest.json $OUTPUT_DIR/manifest.json
cp logo.png $OUTPUT_DIR/logo.png
cp logo_sm.png $OUTPUT_DIR/logo_sm.png

# build popup
# printf "${COL_CYAN}# Building popup page...${COL_NONE}\n"
# cd popup
# bun run build
# cp build/index.html ../$OUTPUT_DIR/popup.html
# cp build/popup-main.js ../$OUTPUT_DIR/popup-main.js
# cp build/popup-main.js.map ../$OUTPUT_DIR/popup-main.js.map # source map
# cd ..

# build content
printf "${COL_CYAN}# Building content scripts...${COL_NONE}\n"
cd content_scripts
cp content.html ../$OUTPUT_DIR/content.html
cp content-root.css ../$OUTPUT_DIR/content-root.css
npx tsc content-root.ts inj_script.ts --outDir ../$OUTPUT_DIR
cd app
bun run build
cp build/content-react.js ../../$OUTPUT_DIR/content-react.js
cp build/content-react.js.map ../../$OUTPUT_DIR/content-react.js.map # source map
cd ../..

# build worker
# printf "${COL_CYAN}# Building worker scripts...${COL_NONE}\n"
# cd worker
# bun run build
# cp build/background.js ../$OUTPUT_DIR/background.js
# cd ..

# build options page
# printf "${COL_CYAN}# Building options page...${COL_NONE}\n"
# cd options
# bun run build
# cp build/index.html ../$OUTPUT_DIR/options.html
# cp build/options-main.js ../$OUTPUT_DIR/options-main.js
# cp build/options-main.js.map ../$OUTPUT_DIR/options-main.js.map # source map
# cd ..

printf "${COL_CYAN}# Done.${COL_NONE}\n"