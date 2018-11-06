import requests

url = 'https://wcma-api.williams.edu/graphql'
headers = {
  'content-type': 'application/json',
  'Authorization': 'bearer 74591dd0f2e9bc2801bc7515a9bdd001'
}

def query_wcma(q):
  r = requests.post(url, json={'query':q}, headers=headers)
  if r.status_code == 200:
    return r.json()
  else:
    return r.status_code

#Example query for collection
"""
q = '''
{
  objects {
    id
    title
    maker
    period
    object_name
    culture
    medium
    remote {
      status
      original_image_id
      public_id
      version
      signature
      width
      height
      format
    }
  }
}
'''
res = query_wcma(q)
cultures = [x['title'] for x in res['data']['objects']]

print(cultures)
"""
