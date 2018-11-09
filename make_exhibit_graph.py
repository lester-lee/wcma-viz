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

G = nx.Graph()

with open("json/exhibitions.json") as f:
  exhibitions = json.load(f)

for ex in exhibitions:
  if "Objects" in ex:
    ex_id = ex["ExhibitionID"]
    objects = ex["Objects"]
    obj_ids = [o["ObjectID"] for o in objects]
    pairs = list(itertools.combinations(obj_ids, 2))
    for p in pairs:
      G.add_edge(p[0], p[1], id=ex_id)

with open("data/exhibition_graph.pickle", "wb") as f:
  pickle.dump(G,f)