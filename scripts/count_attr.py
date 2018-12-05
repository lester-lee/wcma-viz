import pickle, json, sys
import collections

def get_counts(attr_name):
  count = {}
  for c in collection:
    artwork = collection[c]
    if attr_name in artwork:
      attr = artwork[attr_name]
      if attr in count:
        count[attr] += 1
      else:
        count[attr] = 1

  count_list = [(x, count[x]) for x in count]
  sorted_count = sorted(count_list, key=lambda x: x[1], reverse=True)
  #print(json.dumps(count))
  print(sorted_count)
  print([x[0] for x in sorted_count])
  print([x[1] for x in sorted_count])
  ''' CSV format
  print("{},count".format(attr_name))
  for name in count:
    print("{},{}".format(name,count[name]))
  '''


with open('data/wcma-collection.pickle', 'rb') as f:
  collection = pickle.load(f)

if len(sys.argv) < 2:
  print("Pass in name of attribute!")
else:
  get_counts(sys.argv[1])
