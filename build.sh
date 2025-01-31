#!/bin/bash

echo "This script will prepare the project to work with either Chromium or Firefox"
echo

echo "What platform do you want to build the project for?"
echo "1) Chromium browsers"
echo "2) Firefox"
echo "3) Both"

read choice

create () {
	# $1 = browser name
	echo "Building project for $1..."
	current_dir=$(pwd)
	new_folder="MAL Pal $1"

	if [[ -d "$new_folder" ]]; then
		echo "Removed old build folder"
		rm -rf "$new_folder"
	fi

	mkdir "../$new_folder" # temp create folder outside of working dir to combat recursion issues (experienced first hand lmao)
	cp -r "$current_dir"/. "../$new_folder"

	mv "../$new_folder" "$current_dir" # move folder out of temp location, and back into working dir

	# remove unnecessary files
	echo "Removing unnecessary files..."
	# files first
	unnecessaryFiles=("build.sh" "MAL Pal firefox.zip" "MAL Pal chromium.zip" "README.md" "icons/512.png")
	for fileName in "${unnecessaryFiles[@]}"
	do
		rm "$new_folder/$fileName"
	done
	# then folders
	rm -rf "$new_folder/.git"
	rm -rf "$new_folder/.vscode"
	rm -rf "$new_folder/icons/readme"
	rm -rf "$new_folder/icons/old_previews" # local folder for storing old preview images
	rm -rf "$new_folder/old_dbs" # local folder for storing old database versions
	find "$new_folder" -name ".*" -type f -print0| xargs -0 \rm -rf # delete files starting with .
	echo "Removed unnecessary files!"

	echo "Zipping folder..."

	# when updating a zip file, it doesn't remove files so just delete zip file
	rm "MAL Pal $1.zip"

	# copy all, and ONLY, contents within new_folder
	cd "$new_folder"
	zip -r "../MAL Pal $1.zip" . # make zip file outside of new_folder
	cd $current_dir

	echo "Created new ZIP File called 'MAL PAL $1.zip'"
	echo

	# clean up old folder
	rm -rf "$new_folder"

	echo "ZIP File SHA-256 Checksum:"
	shasum -a 256 "$new_folder.zip"
	echo
}

if [[ $choice == 1 ]]; then
	create "chromium"
elif [[ $choice == 2 ]]; then
	create "firefox"
elif [[ $choice == 3 ]]; then
	create "chromium"
	create "firefox"
else
	echo "Invalid choice"
fi
