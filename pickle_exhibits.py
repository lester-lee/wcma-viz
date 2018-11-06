import setup_graphql as wcma
import pickle

# Per page is 5000 to retrieve all exhibits at once,
# otherwise the query only returns ~50 results.

q = '''
{
  exhibitions(page:0, per_page:5000){
    id
    title
    objects
  }
}
'''

raw = wcma.query_wcma(q)
exhibitions = raw['data']['exhibitions']

with open('data/exhibitions.pickle', 'wb') as f:
  pickle.dump(exhibitions, f)