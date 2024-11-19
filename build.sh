#!/usr/bin/env bash

# for windows, run build.bat

echo "This script will prepare the project to work with either Chromium or Firefox"
echo

echo "What platform do you want to build the project for?"
echo "1) Chromium browsers"
echo "2) Firefox"

read choice

create () {
	# $1 = browser name
	# $2 = 1 if we want to make a zip file
	echo "Building project for $1..."
	current_dir=$(pwd)
	new_folder="MAL Pal $1"

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
	rm "$new_folder/MAL Pal chromium.zip"
	rm -rf "$new_folder/MAL Pal chromium"
	rm -rf "$new_folder/.git"
	rm -rf "$new_folder/.vscode"
	# remove platforms folder because chrome hates multiple manifest files lol
	rm -rf "$new_folder/platforms"
	find "$new_folder" -name ".*" -type f -print0| xargs -0 \rm -rf # delete files starting with .
	echo "Removed unnecessary files!"

	if [[ $2 == 1 ]]; then
		echo "Zipping folder..."

		# when updating a zip file, it doesn't remove files so just delete zip file
		rm "MAL Pal $1.zip"

		# copy all, and ONLY, contents within new_folder
		cd "$new_folder"
		zip -r "../MAL Pal $1.zip" . # make zip file outside of new_folder
		cd $current_dir

		echo "Created new ZIP File called 'MAL PAL $1.zip'"
		echo

		# remove folder if building for firefox, since the folder isn't needed
		if [[ $1 == "firefox" ]]; then
			rm -rf "$new_folder"
		fi

		echo "ZIP File SHA-256 Checksum:"
		shasum -a 256 "$new_folder.zip"
		echo
	else
		echo "Created new Folder called 'MAL PAL $1'"
		echo
	fi
}

if [[ $choice == 1 ]]; then
	echo
	echo "Would you like to create a ZIP file and folder, or just the folder?"

	echo "1) ZIP File and Folder"
	echo "2) Folder"

	read buildChoice

	if [[ $buildChoice == 1 ]]; then
		create "chromium" 1
	else
		create "chromium"
	fi
elif [[ $choice == 2 ]]; then
	create "firefox" 1
else
	echo "Invalid choice"
fi
