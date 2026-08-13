<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\Category;
use App\Models\Quote;

class ProfessionalArticleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Pastikan kategori "Tafsir Al-Quran" ada
        $category = Category::firstOrCreate(
            ['slug' => 'tafsir-alquran'],
            ['name' => 'Tafsir Al-Quran']
        );

        // 2. Konten Artikel yang Bersih, Panjang, dan Profesional
        $content = '
            <p><strong>Bismillāhirraḥmānirraḥīm.</strong> Segala puji bagi Allah ﷻ yang telah menurunkan Al-Qur’an sebagai petunjuk bagi seluruh alam. Shalawat serta salam semoga senantiasa tercurah kepada junjungan kita Nabi Muhammad ﷺ, keluarga, para sahabat, serta umatnya hingga akhir zaman.</p>

            <p>Tauhid merupakan fondasi utama dan paling krusial dalam kehidupan seorang muslim. Seluruh amal ibadah, doa, pengharapan, rasa takut, dan ketaatan hanya boleh dipersembahkan semata-mata kepada Allah ﷻ. Sebaliknya, perbuatan syirik merupakan kezaliman yang paling besar karena menempatkan makhluk pada posisi pencipta.</p>

            <h2>1. Kedudukan Agung Surat An-Nisa Ayat 48</h2>

            <p>Di antara ayat yang menjelaskan betapa bahayanya dosa syirik serta luasnya rahmat Allah ﷻ adalah firman-Nya dalam Surat An-Nisa ayat 48:</p>

            <p dir="rtl" style="text-align: right; font-size: 1.8rem; line-height: 2.4; font-family: \'Traditional Arabic\', serif;">
                إِنَّ اللَّهَ لَا يَغْفِرُ أَنْ يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَنْ يَشَاءُ ۚ وَمَنْ يُشْرِكْ بِاللَّهِ فَقَدِ افْتَرَىٰ إِثْمًا عَظِيمًا
            </p>

            <p><em>“Sesungguhnya Allah tidak akan mengampuni dosa syirik (mempersekutukan sesuatu) dengan-Dia, dan Dia mengampuni segala dosa yang selain dari (syirik) itu, bagi siapa yang dikehendaki-Nya. Barangsiapa yang mempersekutukan Allah, maka sungguh ia telah berbuat dosa yang besar.”</em> <strong>(QS. An-Nisa: 48)</strong></p>

            <h2>2. Penjelasan Tafsir dan Bahaya Syirik</h2>

            <p>Imam Ibnu Katsir rahimahullah menjelaskan dalam kitab tafsirnya bahwa Allah ﷻ mengabarkan Dia tidak akan mengampuni dosa syirik bagi orang yang mati dalam keadaan belum bertaubat darinya. Ini berarti pelaku syirik besar akan kekal di dalam neraka.</p>

            <p>Namun, untuk dosa-dosa di bawah tingkat syirik (dosa-dosa besar maupun kecil selain syirik), hal itu berada di bawah kehendak Allah ﷻ. Jika Allah menghendaki, Dia akan mengampuninya dengan rahmat-Nya; dan jika Dia menghendaki, Dia akan mengazabnya sesuai kadar dosanya, namun pelaku maksiat tersebut pada akhirnya tidak akan kekal di dalam neraka jika ia membawa iman.</p>

            <h2>3. Pelajaran Penting yang Dapat Diambil</h2>

            <ol>
                <li><strong>Keutamaan Tauhid:</strong> Menjaga kemurnian tauhid adalah kewajiban terbesar setiap hamba agar terhindar dari siksa yang abadi.</li>
                <li><strong>Larangan Berputus Asa:</strong> Ayat ini memberikan harapan besar bagi orang yang beriman untuk senantiasa memohon ampunan atas dosa-dosa selain syirik.</li>
                <li><strong>Pentingnya Ilmu Agama:</strong> Mempelajari akidah yang benar menyelamatkan seseorang dari jerembap kesyirikan tersembunyi (syirik kecil maupun besar).</li>
            </ol>

            <h2>Kesimpulan</h2>

            <p>Mari kita senantiasa mengevaluasi diri, memperkuat keimanan, dan membersihkan hati dari segala bentuk ketergantungan selain kepada Allah ﷻ. Semoga Allah ﷻ mewafatkan kita dalam keadaan husnul khatimah dan di atas tauhid yang murni. <strong>Āmīn yā Rabbal ‘ālamīn.</strong></p>
        ';

        // 3. Simpan Artikel ke Database
        $article = Article::create([
            'category_id' => $category->id,
            'title' => 'Tafsir Surat An-Nisa Ayat 48: Bahaya Syirik dan Luasnya Ampunan Allah',
            'slug' => 'tafsir-surat-an-nisa-ayat-48-bahaya-syirik-dan-luasnya-ampunan',
            'image' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop',
            'description' => 'Kajian mendalam tafsir Surat An-Nisa ayat 48 mengenai bahaya dosa syirik, keutamaan tauhid, dan luasnya ampunan Allah SWT.',
            'content' => trim($content),
            'read_time' => 5,
            'is_published' => true,
        ]);

        // 4. Buat Relasi Quote / Ayat Pilihan yang langsung terhubung ke artikel ini
        Quote::create([
            'arabic' => 'إِنَّ اللَّهَ لَا يَغْفِرُ أَنْ يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَنْ يَشَاءُ',
            'translation' => 'Sesungguhnya Allah tidak akan mengampuni dosa syirik kepada-Nya dan Dia mengampuni dosa selain itu bagi siapa yang dikehendaki.',
            'reference' => 'QS. An-Nisa: 48',
            'article_id' => $article->id,
        ]);
    }
}