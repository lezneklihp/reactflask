import requests

url = 'http://127.0.0.1:5000/endpoint'
r = requests.get(url)

print(r.json())
