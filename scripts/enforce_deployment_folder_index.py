import sys
import os
import fnmatch
import shutil

# import pathlib

from termcolor import cprint
from yaspin import yaspin

# Color guide
# Info = blue
# Warning = yellow
# Error = red
# Output = white
# Section = purple

PIPE = "│"
ELBOW = "└──"
TEE = "├──"
PIPE_PREFIX = "│   "
SPACE_PREFIX = "    "


def get_path():
    cwd = os.getcwd()

    try:
        path = sys.argv[1]
        real_path = os.path.abspath(os.path.join(cwd, path))

        cprint(f"Using {real_path}", "blue")

        return real_path
    except IndexError:
        cprint(f"No path passed in. Using {cwd}", "blue")

        return cwd


def walk_folders(base_path: str) -> dict:
    changes = []
    for root, dirs, files in os.walk("."):
        # print("root", root)
        # print("")
        # print("dirs:", dirs)
        # print("")

        for item in fnmatch.filter(files, "*.html"):
            # print("...", item)
            if item != "index.html":
                formatted_item = item.replace(".html", "")
                new_change = {
                    "new": {
                        "abs_path": os.path.normpath(
                            os.path.join(base_path, root, formatted_item, "index.html")
                        ),
                        "relative_path": os.path.normpath(
                            os.path.join(root, formatted_item, "index.html")
                        ),
                    },
                    "old": {
                        "abs_path": os.path.normpath(
                            os.path.join(base_path, root, item)
                        ),
                        "relative_path": os.path.normpath(os.path.join(root, item)),
                    },
                }
                changes = [*changes, new_change]
        # print("")

    # print(pprint.pformat(changes))

    return changes


def process_changes(changes: dict):
    cprint(f"{len(changes)} changes found -", "blue")
    for entry in changes:
        cprint(
            f"Old Path - {entry['old']['relative_path']} ({entry['old']['abs_path']})",
            "red",
        )
        cprint(
            f"New Path - {entry['new']['relative_path']} ({entry['new']['abs_path']})",
            "green",
        )

    confirm = input("Apply these changes [y/N]: ")

    if confirm == "" or confirm.lower() == "n":
        print("Not applying changes. exiting...")
        sys.exit(0)
    elif confirm.lower() == "y":
        print("Applying changes...")

    for entry in changes:
        os.makedirs(os.path.dirname(entry["new"]["abs_path"]), exist_ok=True)
        shutil.move(entry["old"]["abs_path"], entry["new"]["abs_path"])


def main():
    changes = {}
    # get path or use cwd
    path = get_path()

    os.chdir(path)

    # tree = DirectoryTree(path)
    # tree.generate()

    with yaspin(text="Scanning directory", color="blue") as spinner:
        try:
            changes = walk_folders(path)

            spinner.ok("✅ ")
        except Exception as ex:
            spinner.fail("💥 ")

            cprint(f"Error: Something went wrong with processing the directory", "red")
            cprint(ex, "red")

    process_changes(changes)

    print("Done!")


if __name__ == "__main__":
    main()


# class DirectoryTree:
#     def __init__(self, root_dir):
#         self._generator = _TreeGenerator(root_dir)

#     def generate(self):
#         tree = self._generator.build_tree()
#         for entry in tree:
#             print(entry)


# class _TreeGenerator:
#     def __init__(self, root_dir):
#         self._root_dir = pathlib.Path(root_dir)
#         self._tree = []

#     def build_tree(self):
#         self._tree_head()
#         self._tree_body(self._root_dir)
#         return self._tree

#     def _tree_head(self):
#         self._tree.append(f"{self._root_dir}{os.sep}")
#         self._tree.append(PIPE)

#     def _tree_body(self, directory, prefix=""):
#         entries = directory.iterdir()
#         entries = sorted(entries, key=lambda entry: entry.is_file())
#         entries_count = len(entries)
#         for index, entry in enumerate(entries):
#             connector = ELBOW if index == entries_count - 1 else TEE
#             if entry.is_dir():
#                 self._add_directory(entry, index, entries_count, prefix, connector)
#             else:
#                 self._add_file(entry, prefix, connector, directory)

#     def _add_directory(self, directory, index, entries_count, prefix, connector):
#         self._tree.append(f"{prefix}{connector} {directory.name}{os.sep}")
#         if index != entries_count - 1:
#             prefix += PIPE_PREFIX
#         else:
#             prefix += SPACE_PREFIX
#         self._tree_body(
#             directory=directory,
#             prefix=prefix,
#         )
#         self._tree.append(prefix.rstrip())

#     def _add_file(self, file, prefix, connector, directory):
#         # use directory to see if it is a file match
#         self._tree.append(f"{prefix}{connector} {file.name}")
