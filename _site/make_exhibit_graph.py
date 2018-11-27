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
      ex_node = f'e_{ex_id}'
      G.add_node(ex_node)
      G.nodes[ex_node]["node_type"] = "exhibit"
      G.nodes[ex_node]["_id"] = ex_id
      for o_id in obj_ids:
        if str(o_id) in collection:
          o_node = f'o_{o_id}'
          G.add_node(o_node)
          G.nodes[o_node]["node_type"] = "object"
          G.nodes[o_node]["_id"] = o_id
          G.add_edge(o_node, ex_node)
      '''
      pairs = list(itertools.combinations(obj_ids, 2))
      for p in pairs:
        # print(p)
        if str(p[0]) in collection and str(p[1]) in collection:
          G.add_edge(p[0], p[1], id=ex_id)  # Use object ID as nodes
      '''
  with open("data/exhibition_graph.pickle", "wb") as f:
    pickle.dump(G,f)

def load_graph():
  with open("data/exhibition_graph.pickle", "rb") as f:
    return pickle.load(f)

def dump_to_json():
  G = load_graph()
  graph_json = nx.node_link_data(G)
  ''' only use ids as nodes, don't use redundant info
  with open("json/wcma-collection--color.json", "r", encoding="utf8") as f:
    node_json = json.load(f)
  node_list = [node_json[x] for x in node_json]
  graph_json["nodes"] = node_list
  '''
  exhibit_nodes = [x for x in graph_json["nodes"] if x["node_type"] == "exhibit"]
  with open("json/collection_graph.json", "w") as f:
    json.dump(graph_json, f)
  with open("json/exhibit_nodes.json", "w") as f:
    json.dump(exhibit_nodes, f)

if "-save" in sys.argv:
  save_graph()
  print("Saved!")
if "-json" in sys.argv:
  dump_to_json()
  print("Dumped to collection_graph.json!")
