# -*- coding: utf-8 -*-
"""Page-specific Turkish translations"""
import os

PAGE_TRANSLATIONS = {
    'about-tr.html': [
        ('<title>Azure Tower | About</title>', '<title>Azure Tower | Hakkımızda</title>'),
        ('<span class="hero-title-main">Discover<br>AZURE TOWER</span>', '<span class="hero-title-main">Keşfedin<br>AZURE TOWER</span>'),
        ('<span class="sub-title mb-55 rmb-25 wow fadeInRight delay-0-4s">overview</span>', '<span class="sub-title mb-55 rmb-25 wow fadeInRight delay-0-4s">genel bakış</span>'),
        ('<h2>Modern & premium residences</h2>', '<h2>Modern ve premium konutlar</h2>'),
        ('<p>Own the Skyline with Azure Tower</p>', '<p>Azure Tower ile Gökyüzüne Sahip Olun</p>'),
        ('SQAURE AREAS', 'M² ALAN'),
        ('RESIDENCES', 'KONUT'),
        ('Underground Parking', 'Yeraltı Otopark'),
        ('Public Terrace', 'Halka Açık Teras'),
        ('benefits', 'avantajlar'),
        ('<h2>Our main property features</h2>', '<h2>Ana özelliklerimiz</h2>'),
        ('<p>Azure Tower is a modern residential complex in your city</p>', '<p>Azure Tower şehrinizde modern bir konut kompleksidir</p>'),
        ('<span id="residences" class="sub-title mb-60">Residences</span>', '<span id="residences" class="sub-title mb-60">Konutlar</span>'),
        ('<h2>Designed to a Higher Standard of Living</h2>', '<h2>Daha Yüksek Yaşam Standardına Göre Tasarlandı</h2>'),
        ('<p>Advanced engineering, premium materials, and panoramic architecture.</p>', '<p>İleri mühendislik, premium malzemeler ve panoramik mimari.</p>'),
        ('tour', 'tur'),
        ('<h2>Video tour</h2>', '<h2>Video turu</h2>'),
        ('<p>Transparency matters.\n                                    This video tour shows the actual condition of the project today —\n                                    no staged renders, no post-production illusions.</p>', '<p>Şeffaflık önemlidir. Bu video turu, projenin günümüzdeki gerçek durumunu gösterir — sahne renderları yok, post prodüksiyon illüzyonları yok.</p>'),
    ],
    'developer-tr.html': [
        ('<title>5M İnşaat | Developer</title>', '<title>5M İnşaat | Geliştirici</title>'),
        ('<p>25+ Years of Institutional Development</p>', '<p>25+ Yıllık Kurumsal Geliştirme</p>'),
        ('what we do', 'ne yapıyoruz'),
        ('<h2>Built on engineering.  <br> Governed by standards. <br> Proven by results.</h2>', '<h2>Mühendislik üzerine inşa. Standartlarla yönetilen. Sonuçlarla kanıtlanmış.</h2>'),
        ('Verified & Accredited', 'Doğrulanmış ve Akredite'),
        ('<h2>International Certifications & Compliance</h2>', '<h2>Uluslararası Sertifikalar ve Uyumluluk</h2>'),
        ('Our achievements', 'Başarılarımız'),
        ('<h2>We Working for You</h2>', '<h2>Sizin İçin Çalışıyoruz</h2>'),
        ('Years of<br> Experience', 'Yıllık<br> Deneyim'),
        ('Completed<br> Projects', 'Tamamlanan<br> Proje'),
        ('Countries<br> of Operation', 'Faaliyet<br> Ülkesi'),
        ('Millions<br> Investment', 'Milyon<br> Yatırım'),
    ],
    'projects-tr.html': [
        ('<title>5M İnşaat | Projects</title>', '<title>5M İnşaat | Projeler</title>'),
        ('<h1 class="hero-heading">Projects Delivered<br>by 5M İnşaat</h1>', '<h1 class="hero-heading">5M İnşaat Tarafından<br>Teslim Edilen Projeler</h1>'),
        ('Operational History', 'Faaliyet Geçmişi'),
        ('<h2>Selected Completed Projects</h2>', '<h2>Seçilmiş Tamamlanan Projeler</h2>'),
    ],
    'facilities-tr.html': [
        ('<title>Azure Tower - Residence Complex Landing Page HTML Template || Facilities</title>', '<title>Azure Tower - Konut Kompleksi Açılış Sayfası HTML Şablonu || Tesisler</title>'),
        ('<span class="hero-title-line">Elevated Living,</span>\n                                    <span class="hero-title-line">Designed Around You</span>', '<span class="hero-title-line">Yükseltilmiş Yaşam,</span>\n                                    <span class="hero-title-line">Sizin İçin Tasarlandı</span>'),
        ('<span class="sub-title mb-60">Facilities</span>', '<span class="sub-title mb-60">Tesisler</span>'),
        ('<h2>Facilities designed for comfort, wellness, productivity, and peace of mind.</h2>', '<h2>Konfor, sağlık, verimlilik ve huzur için tasarlanmış tesisler.</h2>'),
        ('Location', 'Konum'),
        ('Near by Places', 'Yakındaki Yerler'),
        ('5 minutes walk', '5 dakika yürüyüş'),
        ('10 minutes walk', '10 dakika yürüyüş'),
    ],
    '404-tr.html': [
        ('<title>Azure Tower - Residence Complex Landing Page HTML Template || 404</title>', '<title>Azure Tower - Konut Kompleksi Açılış Sayfası HTML Şablonu || 404</title>'),
        ('<h1>Oops! Page Not Found</h1>', '<h1>Üzgünüz! Sayfa Bulunamadı</h1>'),
        ('<p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>', '<p>Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.</p>'),
        ('Return To Home Page', 'Ana Sayfaya Dön'),
    ],
}

for fname, trans in PAGE_TRANSLATIONS.items():
    path = os.path.join(os.path.dirname(__file__), fname)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        for old, new in trans:
            content = content.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {fname}')
