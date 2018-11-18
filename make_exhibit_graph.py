'''
Read in exhibit data and produce a graph where
  - Each node represents an object id
  - An edge e=(n,m) represents objects n and m
    being in the same exhibit with id e
'''

import networkx as nx
import itertools
import json
import pickle
import sys

with open("json/exhibitions.json") as f:
  exhibitions = json.load(f)

with open("data/wcma-collection.pickle", "rb") as f:
  collection = pickle.load(f)

def save_graph():
  G = nx.Graph()
  for ex in exhibitions:
    if "Objects" in ex:
      ex_id = ex["ExhibitionID"]
      objects = ex["Objects"]
      obj_ids = [o["ObjectID"] for o in objects]
      pairs = list(itertools.combinations(obj_ids, 2))
      for p in pairs:
        print(p)
        if str(p[0]) in collection and str(p[1]) in collection:
          G.add_edge(p[0], p[1], id=ex_id)  # Use object ID as nodes

  with open("data/exhibition_graph.pickle", "wb") as f:
    pickle.dump(G,f)

def load_graph():
  with open("data/exhibition_graph.pickle", "rb") as f:
    return pickle.load(f)

def dump_to_json():
  G = load_graph()
  graph_json = nx.node_link_data(G)
  with open("json/collection_graph.json", "w") as f:
    json.dump(graph_json, f)

if "-save" in sys.argv:
  save_graph()
  print("Saved!")
if "-json" in sys.argv:
  dump_to_json()
  print("Dumped to collection_graph.json!")
