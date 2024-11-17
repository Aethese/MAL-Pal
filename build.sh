#!/usr/bin/env bash

# for windows, run build.bat

echo "This script will prepare the project to work with either Chromium or Firefox\n"

echo "What platform do you want to build the project for?"
echo "1) Chromium browsers"
echo "2) Firefox"

read choice

create_folder () {
	# $1 = browser name
	# $2 = 1 if we want to zip folder as well
	echo "Building project for $1..."
	current_dir=$(pwd)
	new_folder="MAL Pal $1"

	# zip doesn't need to be removed, it just updates lol
	if [ -d "$new_folder" ]; then
		echo "Removed old build folder"
		rm -rf "$new_folder"
	fi

	mkdir "../$new_folder" # temp create folder outside of working dir to combat recursion issues (experienced first hand lmao)
	cp -r "$current_dir"/. "../$new_folder"

	mv "../$new_folder" "$current_dir" # move folder out of temp location, and back into working dir

	# move needed manifest to root, and remove unnecessary files
	mv "$new_folder/platforms/$1/manifest.json" "$new_folder"

	echo "Removing unnecessary files..."
	rm "$new_folder/build.sh"
	rm "$new_folder/MAL Pal firefox.zip"
	rm -rf "$new_folder/MAL Pal chromium"
	rm -rf "$new_folder/.git"
	rm -rf "$new_folder/.vscode"
	find "$new_folder" -name ".*" -type f -print0| xargs -0 \rm -rf # delete files starting with .
	echo "Removed unnecessary files!"

	if [[ $2 == 1 ]]; then
		echo "Zipping folder..."

		# copy all, and ONLY, contents within new_folder
		cd "$new_folder"
		zip -r "../MAL Pal $1.zip" . # make zip file outside of new_folder
		cd $current_dir

		rm -rf "$new_folder"
		echo "Finished zipping folder!"
	fi

	echo "Created new Folder called 'MAL PAL $1' at '$new_folder'"
}

if [[ $choice == 1 ]]; then
	create_folder "chromium"
elif [[ $choice == 2 ]]; then
	create_folder "firefox" 1
else
	echo "Invalid choice"
fi
