import os
import json

base_path = "/Users/ryanmadsen/code/webdev/wdd330/final/exercises"
objs = []

os.chdir(base_path)

def traverse_recursive(path):
    os.chdir(path)
    
    ls = os.listdir()
    ls.sort()

    for item in ls:
        if '.' not in item:
            traverse_recursive(f"{path}/{item}")
        elif '.json' in item:
            with open(f'{path}/{item}') as read_file:
                data = json.load(read_file)
                objs.append(data)
        elif item.endswith('.jpg'):
            base = path.replace("/Users/ryanmadsen/code/webdev/wdd330/final", "")

            if 'image_paths' in objs[len(objs) - 1]:
                objs[len(objs) - 1]['image_paths'].append(f".{base}/{item}")
            else:
                objs[len(objs) - 1]['image_paths'] = [f".{base}/{item}"]

traverse_recursive(base_path)

os.chdir("/Users/ryanmadsen/code/webdev/wdd330/final")

with open('all-exercises.json', 'w') as write_file:
    json.dump(objs, write_file)