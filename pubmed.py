import requests
from xml.etree import ElementTree as ET

BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"

def search_pubmed(query, max_results=5):
    params = {"db":"pubmed","term":query,"retmax":max_results,"retmode":"json"}
    r = requests.get(BASE + 'esearch.fcgi', params=params)
    r.raise_for_status()
    data = r.json()
    ids = data.get('esearchresult',{}).get('idlist', [])
    return ids

def fetch_details(pmids):
    if not pmids:
        return []
    params = {"db":"pubmed","id":','.join(pmids),"retmode":"xml"}
    r = requests.get(BASE + 'efetch.fcgi', params=params)
    r.raise_for_status()
    root = ET.fromstring(r.text)
    articles = []
    for article in root.findall('.//PubmedArticle'):
        title = article.find('.//ArticleTitle')
        pmid = article.find('.//PMID')
        journal = article.find('.//Journal/Title')
        year = article.find('.//PubDate/Year')
        articles.append({
            'pmid': pmid.text if pmid is not None else None,
            'title': title.text if title is not None else None,
            'journal': journal.text if journal is not None else None,
            'year': year.text if year is not None else None
        })
    return articles
