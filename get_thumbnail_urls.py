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
  try:
    remote = res["data"]["object"]["remote"]
    version = remote["version"]
    p_id = remote["public_id"]
    fmt = remote["format"]

    if not version or not p_id or not fmt:
      raise LookupError("Invalid thumbnail url")

    url = f'http://res.cloudinary.com/wcma/image/upload/v{version}/{p_id}.{fmt}'
    print(url)
    urls[id] = url
  except Exception as e:
    urls[id] = "None"


print("Dumping to json...")

with open("json/thumbnail_urls.json", "w+") as f:
  json.dump(urls, f)

print("Done!")

