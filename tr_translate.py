# -*- coding: utf-8 -*-
"""Apply common Turkish translations to -tr.html files"""
import os
import re

FILES = ['about-tr.html', 'developer-tr.html', 'projects-tr.html', 'facilities-tr.html', 
         'contact-tr.html', 'privacy-policy-tr.html', '404-tr.html']

REPLACEMENTS = [
    (r'<html lang="zxx">', '<html lang="tr">'),
    (r'href="index\.html"', 'href="index-tr.html"'),
    (r'href="about\.html"', 'href="about-tr.html"'),
    (r'href="developer\.html"', 'href="developer-tr.html"'),
    (r'href="projects\.html"', 'href="projects-tr.html"'),
    (r'href="index\.html#residences"', 'href="index-tr.html#residences"'),
    (r'href="facilities\.html"', 'href="facilities-tr.html"'),
    (r'href="contact\.html"', 'href="contact-tr.html"'),
    (r'href="privacy-policy\.html"', 'href="privacy-policy-tr.html"'),
    (r'>Home<', '>Ana Sayfa<'),
    (r'>About<', '>Hakkımızda<'),
    (r'>Developer<', '>Geliştirici<'),
    (r'>Projects<', '>Projeler<'),
    (r'>Residences<', '>Konutlar<'),
    (r'>Facilities<', '>Tesisler<'),
    (r'>Contact<', '>İletişim<'),
    (r'Ask a Question ', 'Soru Sor '),
    (r'View On-Site Video', 'Sahada Video İzle'),
    (r'Take a look at VR', 'VR Turuna Bak'),
    (r'OFFICE', 'OFİS'),
    (r'Do you want to visit us\?', 'Bizi ziyaret etmek ister misiniz?'),
    (r'Monday - Friday', 'Pazartesi - Cuma'),
    (r'Look at the map', 'Haritada Gör'),
    (r'Send a Message', 'Mesaj Gönder'),
    (r'Navigation', 'Menü'),
    (r'aria-label="Footer navigation"', 'aria-label="Alt menü navigasyonu"'),
    (r'All Rights Reserved', 'Tüm Hakları Saklıdır'),
    (r'Privacy Policy', 'Gizlilik Politikası'),
    (r'>Cookies<', '>Çerezler<'),
    (r'All materials on this website are for informational purposes only and do not constitute a public offer\. We implement appropriate technical and organizational security measures to protect personal data against unauthorized access, alteration, disclosure, or destruction\.',
     'Bu web sitesindeki tüm materyaller yalnızca bilgilendirme amaçlıdır ve halka açık teklif niteliği taşımaz. Kişisel verileri yetkisiz erişim, değişiklik, ifşa veya imhadan korumak için uygun teknik ve organizasyonel güvenlik önlemleri uyguluyoruz.'),
    (r'Online Assistant', 'Çevrimiçi Asistan'),
    (r'Azure Tower support', 'Azure Tower desteği'),
    (r'Type your message\.\.\.', 'Mesajınızı yazın...'),
    (r'<button type="submit" class="chat-send-btn">Send</button>', '<button type="submit" class="chat-send-btn">Gönder</button>'),
]

for fname in FILES:
    path = os.path.join(os.path.dirname(__file__), fname)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        for pat, repl in REPLACEMENTS:
            content = re.sub(pat, repl, content)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {fname}')
