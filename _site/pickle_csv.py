import csv, pickle

with open('data/wcma-collection.csv', encoding='utf-8') as f:
  wcma_reader = csv.DictReader(f)
  collection = {row['id']: row for row in wcma_reader}

with open('data/wcma-collection.pickle', 'wb') as f:
  pickle.dump(collection, f)