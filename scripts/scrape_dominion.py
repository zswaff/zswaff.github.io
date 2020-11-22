#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

import requests
import bs4


BASE_URL = 'http://wiki.dominionstrategy.com'
CARDS_RPATH = '/index.php/Cards'
IMAGES_RPATH = '/images'

IMAGE_OUT_PATH_FMT = '../games/dominion/images/{}'
CONST_OUT_PATH = '../games/dominion/const.js'

EXCLUDED_CARDS = {
    'Copper',
    'Silver',
    'Gold',
    'Platinum',
    'Curse',
    'Estate',
    'Duchy',
    'Province',
    'Colony'
}


def main():
    page = requests.get(f'{BASE_URL}{CARDS_RPATH}')
    r_html = bs4.BeautifulSoup(page.content, 'lxml')
    r_table = r_html.find('table', {'class': 'wikitable'})

    cards = []
    set_links = {}
    for r_row in r_table.find_all('tr')[1:]:
        name_td, set_td = r_row.find_all('td')[:2]

        name_a = name_td.find('a')
        name = name_a.text
        if name in EXCLUDED_CARDS:
            continue

        link = BASE_URL + name_a['href']
        img_link_elems = name_td.find('img')['src'].split('/')[3:6]
        fname = img_link_elems[-1]
        img_link = f'{BASE_URL}{IMAGES_RPATH}/' + '/'.join(img_link_elems)
        img_out_path = IMAGE_OUT_PATH_FMT.format(fname)
        new_img_link = img_out_path[2:]

        img_res = requests.get(img_link)
        with open(img_out_path, 'wb+') as fout:
            fout.write(img_res.content)

        set_a = set_td.find('a')
        set_ = set_a.text
        set_link = BASE_URL + set_a['href']

        print(name)
        cards.append((set_, {
            'name': name,
            'link': link,
            'imgLink': new_img_link
        }))
        set_links[set_] = set_link

    sets = {
        k: {
            'link': v,
            'cards': sorted([e for set_, e in cards if set_ == k], key=lambda x: x['name'])
        }
        for k, v in set_links.items()
    }

    s_sets = json.dumps(sets, indent=4, sort_keys=True)
    with open(CONST_OUT_PATH, 'w+') as fout:
        fout.write(f'const allCards = {s_sets};\n')


if __name__ == '__main__':
    main()
