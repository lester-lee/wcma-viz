'''
 - Read in color details
 - Add details to collection
 - Dump collection to pickle/json
'''

import json, pickle

with open("data/wcma-collection.pickle", "rb") as f:
  collection = pickle.load(f)

def add_color_details():
  # Read in color details and add to collection dict
  with open("data/collection-color-details.csv") as f:
    details = [x.strip().split(",") for x in f]

  color_details = {x[0]: {
    'dominant_colors': x[1].split('$'),
    'luminance': x[2],
    'contrast': x[3]}
    for x in details}

  for id in color_details:
    collection[id].update(color_details[id])

  print("Color details added!")

def save():
  print("Saving to wcma-collection.pickle...")
  with open("data/wcma-collection.pickle", "wb") as f:
    pickle.dump(collection, f)
  print("Saved!")
  print("Saving to wcma-collection--color.json...")
  with open("json/wcma-collection--color.json", "w", encoding="utf8") as f:
    json.dump(collection, f, ensure_ascii=False)
  print("Saved!")

if __name__ == "__main__":
  add_color_details()
  save()