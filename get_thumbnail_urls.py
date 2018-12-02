import json, pickle
import setup_graphql as gql

with open("data/wcma-collection.pickle", "rb") as f:
  collection = pickle.load(f)

urls = {}

print("Getting urls...")

for id in collection:
  query = "{object (id:"+id+"){remote {version public_id format}}}"

  print(f"{id}, ", end="", flush=True)

  res = gql.query_wcma(query)
  if res:
    remote = res["data"]["object"]["remote"]
    if remote:
      version = remote["version"]
      p_id = remote["public_id"]
      fmt = remote["format"]

      url = f'http://res.cloudinary.com/wcma/image/upload/v{version}/{p_id}.{fmt}'
      #print(url)
      urls[id] = url
    else:
      urls[id] = "None"

  else:
    urls[id] = "None"


print("Dumping to json...")

with open("json/thumbnail_urls.json", "w+") as f:
  json.dump(urls, f)

print("Done!")

