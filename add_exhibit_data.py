import pickle
with open('data/wcma-collection.pickle', 'rb') as f:
  collection = pickle.load(f)
with open('data/exhibitions.pickle', 'rb') as f:
  exhibits = pickle.load(f)

for e in exhibits:
  for o in e['objects']:
    col_id = str(o)
    if col_id in collection:
      artwork = collection[col_id]
      if 'exhibits' in artwork:
        artwork['exhibits'].append(e['id'])
      else:
        artwork['exhibits'] = [e['id']]
    else:
      print("Collection id not found: {}".format(col_id))

with open('data/collection--exhibit.pickle', 'wb') as f:
  pickle.dump(collection, f)