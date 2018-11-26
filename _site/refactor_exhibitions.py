'''
Change exhibitions.json to have the format:
  {id: {exhibit info}}
It currently uses the format:
  {{exhibit info}}
'''
import json

with open("json/exhibitions.json") as f:
  exhibits = json.load(f)

new_exhibits = {ex["ExhibitionID"]: ex for ex in exhibits}

with open("json/exhibitions--refactored.json", "w+", encoding="utf8") as f:
  json.dump(new_exhibits, f)

print("Dumped!")