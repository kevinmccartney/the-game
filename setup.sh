echo "Setting up The Game project"
echo "Step 1 - Add project bin to path"
echo "Adding the project bin to your path will allow easier usage of project scripts"

bin_file_search=$(cat ~/.zshrc | grep '^export PATH=.*\/the-game\/bin:\$PATH$')
bin_search_results_length=${#bin_file_search}
bin_in_path=false

if [[ bin_search_results_length -gt 0 ]] 
then
  bin_in_path=true
fi

if ! $bin_in_path
then
  echo "Exporting bin to path..."
  echo "export PATH=$(pwd)/bin:\$PATH" >> ~/.zshrc
else
  echo "Project bin found in path. No update of .zshrc necessary"
fi