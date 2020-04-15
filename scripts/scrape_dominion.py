#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

import requests
import bs4


BASE_URL = 'http://wiki.dominionstrategy.com'
CARDS_RPATH = '/index.php/Cards'
IMAGES_RPATH = '/images'

OUT_PATH = '../games/dominion/const.js'


def main():
    page = requests.get(f'{BASE_URL}{CARDS_RPATH}')
    r_html = bs4.BeautifulSoup(page.content, 'lxml')
    r_table = r_html.find('table', {'class': 'wikitable'})

    cards = []
    sets = {}
    for r_row in r_table.find_all('tr')[1:]:
        name_td, set_td = r_row.find_all('td')[:2]

        name_a = name_td.find('a')
        name = name_a.text
        link = BASE_URL + name_a['href']
        img_link = f'{BASE_URL}{IMAGES_RPATH}/' + '/'.join(name_td.find('img')['src'].split('/')[3:6])

        set_a = set_td.find('a')
        set_ = set_a.text
        set_link = BASE_URL + set_a['href']

        cards.append({
            'name': name,
            'link': link,
            'imgLink': img_link,
            'set': set_
        })
        sets[set_] = set_link

    sets = [{'set': k, 'setLink': v} for k, v in sets.items()]

    s_sets = json.dumps(sorted(sets, key=lambda x: x['set']), indent=4).replace('"', '\'')
    s_cards = json.dumps(sorted(cards, key=lambda x: x['name']), indent=4).replace('"', '\'')

    with open(OUT_PATH, 'w+') as fout:
        fout.write(f'const allSets = {s_sets};\n\nconst allCards = {s_cards};\n')


if __name__ == '__main__':
    main()
