<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\Category;
use App\Models\Quote;

class ArticleAndQuoteSeeder extends Seeder
{
    public function run(): void
    {
        // =========================================================
        // 1. KATEGORI
        // =========================================================
        $category = Category::firstOrCreate(
            ['slug' => 'tafsir-al-quran'],
            ['name' => 'Tafsir Al-Qur’an']
        );

        // =========================================================
        // 2. ARTIKEL TAFSIR
        // =========================================================
        $article = Article::updateOrCreate(
            [
                'slug' => 'tafsir-surat-al-waqiah-ayat-57-62-kekuasaan-allah',
            ],
            [
                'category_id' => $category->id,

                'title' => 'Tafsir Surat Al-Waqi’ah Ayat 57–62: Mengingat Kekuasaan Allah dalam Penciptaan Manusia',

                'image' => 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1200&auto=format&fit=crop',

                'description' => 'Kajian tafsir Surat Al-Waqi’ah ayat 57–62 tentang kekuasaan Allah ﷻ dalam menciptakan manusia dan bukti kebesaran-Nya dalam kehidupan.',

                'content' => '
                    <p>
                        <strong>Bismillāhirraḥmānirraḥīm.</strong>
                    </p>

                    <p>
                        Manusia sering kali melihat berbagai nikmat yang ada di sekitarnya
                        tanpa menyadari siapa yang menciptakannya. Kehidupan, tubuh,
                        makanan, air, dan berbagai kenikmatan yang kita rasakan semuanya
                        merupakan bagian dari kekuasaan Allah ﷻ.
                    </p>

                    <p>
                        Surat Al-Waqi’ah mengajak manusia untuk merenungkan kembali
                        penciptaan dirinya dan berbagai nikmat yang Allah berikan.
                        Dengan merenungkannya, seorang hamba diharapkan semakin mengenal
                        kebesaran dan kekuasaan Rabb-nya.
                    </p>

                    <h2>Firman Allah ﷻ</h2>

                    <p dir="rtl" style="text-align: right; font-size: 1.8rem; line-height: 2.4;">
                        نَحْنُ خَلَقْنَاكُمْ فَلَوْلَا تُصَدِّقُونَ
                    </p>

                    <p>
                        <em>
                            “Kami telah menciptakan kamu, maka mengapa kamu tidak
                            membenarkan (hari kebangkitan)?”
                        </em>
                    </p>

                    <p>
                        <strong>QS. Al-Waqi’ah: 57</strong>
                    </p>

                    <h2>Allah yang Menciptakan Manusia</h2>

                    <p>
                        Ayat ini mengingatkan manusia kepada asal keberadaannya.
                        Tidak ada seorang pun yang menciptakan dirinya sendiri.
                        Kehadiran manusia di dunia merupakan kehendak dan kekuasaan
                        Allah ﷻ.
                    </p>

                    <p>
                        Karena Allah mampu menciptakan manusia dari keadaan yang
                        sebelumnya tidak ada, maka menghidupkan kembali manusia setelah
                        kematian bukanlah sesuatu yang sulit bagi-Nya.
                    </p>

                    <p>
                        Allah ﷻ kemudian mengajak manusia untuk memperhatikan proses
                        penciptaannya:
                    </p>

                    <p dir="rtl" style="text-align: right; font-size: 1.7rem; line-height: 2.2;">
                        أَفَرَأَيْتُم مَّا تُمْنُونَ
                    </p>

                    <p>
                        <em>
                            “Maka pernahkah kamu memperhatikan apa yang kamu pancarkan?”
                        </em>
                    </p>

                    <p>
                        <strong>QS. Al-Waqi’ah: 58</strong>
                    </p>

                    <p>
                        Allah ﷻ mengingatkan manusia mengenai awal penciptaannya.
                        Dari sesuatu yang sangat sederhana, Allah membentuk manusia
                        dengan susunan yang sempurna hingga menjadi makhluk yang memiliki
                        akal, kemampuan berbicara, dan berbagai kemampuan lainnya.
                    </p>

                    <h2>Siapa yang Menentukan Penciptaan?</h2>

                    <p>
                        Allah ﷻ berfirman:
                    </p>

                    <p dir="rtl" style="text-align: right; font-size: 1.7rem; line-height: 2.2;">
                        أَأَنتُمْ تَخْلُقُونَهُ أَمْ نَحْنُ الْخَالِقُونَ
                    </p>

                    <p>
                        <em>
                            “Kamukah yang menciptakannya atau Kami yang menciptakan?”
                        </em>
                    </p>

                    <p>
                        <strong>QS. Al-Waqi’ah: 59</strong>
                    </p>

                    <p>
                        Pertanyaan tersebut merupakan pengingat yang sangat kuat.
                        Manusia memiliki kemampuan untuk melakukan banyak hal, tetapi
                        kemampuan tersebut tetap berada di bawah kehendak Allah ﷻ.
                    </p>

                    <p>
                        Tidak ada manusia yang mampu menciptakan dirinya sendiri.
                        Tidak pula manusia mampu menentukan seluruh perjalanan hidupnya
                        tanpa kehendak Allah.
                    </p>

                    <h2>Kekuasaan Allah atas Kehidupan dan Kematian</h2>

                    <p>
                        Dalam ayat berikutnya Allah ﷻ menjelaskan bahwa Dia menetapkan
                        kematian di antara manusia dan tidak ada yang mampu mengalahkan
                        ketetapan-Nya.
                    </p>

                    <p dir="rtl" style="text-align: right; font-size: 1.6rem; line-height: 2.2;">
                        نَحْنُ قَدَّرْنَا بَيْنَكُمُ الْمَوْتَ
                    </p>

                    <p>
                        <em>
                            “Kami telah menentukan kematian di antara kamu.”
                        </em>
                    </p>

                    <p>
                        <strong>QS. Al-Waqi’ah: 60</strong>
                    </p>

                    <p>
                        Kematian bukanlah sesuatu yang dapat dihindari oleh manusia.
                        Setiap orang akan menghadapi waktunya masing-masing.
                        Karena itu, seorang muslim hendaknya menggunakan kehidupan
                        yang diberikan Allah untuk memperbanyak amal saleh dan
                        mempersiapkan kehidupan akhirat.
                    </p>

                    <h2>Pelajaran dari Surat Al-Waqi’ah Ayat 57–62</h2>

                    <ol>
                        <li>
                            Allah ﷻ adalah satu-satunya Pencipta manusia.
                        </li>

                        <li>
                            Penciptaan manusia merupakan salah satu tanda kekuasaan Allah.
                        </li>

                        <li>
                            Kemampuan Allah menciptakan manusia menjadi bukti bahwa
                            kebangkitan setelah kematian adalah sesuatu yang benar.
                        </li>

                        <li>
                            Kehidupan dan kematian berada dalam ketetapan Allah ﷻ.
                        </li>

                        <li>
                            Manusia hendaknya tidak sombong karena pada hakikatnya
                            dirinya adalah makhluk yang diciptakan Allah.
                        </li>

                        <li>
                            Mengingat kematian dapat mendorong seorang muslim untuk
                            memperbaiki amal dan mempersiapkan kehidupan akhirat.
                        </li>
                    </ol>

                    <h2>Penutup</h2>

                    <p>
                        Surat Al-Waqi’ah ayat 57–62 mengajak kita untuk melihat kembali
                        kepada diri sendiri. Dari mana kita berasal? Siapa yang
                        menciptakan kita? Siapa yang menentukan kehidupan dan kematian?
                    </p>

                    <p>
                        Semua itu menunjukkan kebesaran Allah ﷻ. Semakin seseorang
                        merenungkan penciptaan dirinya, seharusnya semakin bertambah
                        rasa syukur, ketundukan, dan penghambaan kepada Allah ﷻ.
                    </p>

                    <p>
                        Semoga Allah ﷻ menjadikan kita hamba yang senantiasa mengingat
                        kebesaran-Nya, mensyukuri nikmat-Nya, dan mempersiapkan diri
                        untuk kehidupan akhirat.
                    </p>

                    <p>
                        <strong>Āmīn yā Rabbal ‘ālamīn.</strong>
                    </p>
                ',

                'read_time' => 6,

                'is_published' => true,
            ]
        );

        // =========================================================
        // 3. QUOTE / AYAT PILIHAN
        // =========================================================
        Quote::updateOrCreate(
            [
                'article_id' => $article->id,
            ],
            [
                'arabic' => 'أَأَنتُمْ تَخْلُقُونَهُ أَمْ نَحْنُ الْخَالِقُونَ',

                'translation' => 'Kamukah yang menciptakannya atau Kami yang menciptakan?',

                'reference' => 'QS. Al-Waqi’ah: 59',
            ]
        );
    }
}