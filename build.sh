#!/bin/bash

echo "This script will build the project for both Chromium and Firefox"
echo

echo "Would you like to continue?"
echo "1) Yes"
echo "2) No"

read choice

create () {
	echo "Building project..."
	current_dir=$(pwd)

	if ! [[ "$current_dir" == *"MAL-Pal" ]]; then
		echo "You must be in the MAL-Pal directory to build this project!"
		exit 1
	fi

	new_folder="MAL Pal Build"

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
	unnecessaryFiles=("build.sh" "MAL Pal Build.zip" "README.md" "icons/512.png")
	for fileName in "${unnecessaryFiles[@]}"
	do
		rm "$new_folder/$fileName"
	done
	# then folders
	rm -rf "$new_folder/.git"
	rm -rf "$new_folder/.vscode"
	rm -rf "$new_folder/icons/readme"
	rm -rf "$new_folder/icons/old_previews" # local folder for storing old preview images
	find "$new_folder" -name ".*" -type f -print0| xargs -0 \rm -rf # delete files starting with .
	echo "Removed unnecessary files!"

	echo "Zipping folder..."

	# when updating a zip file, it doesn't remove files so just delete zip file
	rm "MAL Pal Build.zip"

	# copy all, and ONLY, contents within new_folder
	cd "$new_folder"
	zip -r "../MAL Pal Build.zip" . # make zip file outside of new_folder
	cd $current_dir

	echo "Created new ZIP File called 'MAL PAL Build.zip'"
	echo

	# clean up old folder
	rm -rf "$new_folder"

	echo "ZIP File SHA-256 Checksum:"
	shasum -a 256 "$new_folder.zip"
	echo
}

if [[ $choice == 1 ]]; then
	create
else
	echo "Exiting..."
	exit 0
fi
