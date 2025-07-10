<?php
// FILE: claimgaransi.php

// Inisialisasi variabel untuk pesan status dan data formulir
$successMessage = '';
$errorMessage = '';
$formData = [
    'wname' => '',
    'wemail' => '',
    'wphone' => '',
    'wmessage' => ''
];

// Cek jika formulir dikirimkan (metode POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 1. Ambil dan bersihkan input teks
    $formData['wname'] = isset($_POST['wname']) ? htmlspecialchars(trim($_POST['wname'])) : '';
    $formData['wemail'] = isset($_POST['wemail']) ? htmlspecialchars(trim($_POST['wemail'])) : '';
    $formData['wphone'] = isset($_POST['wphone']) ? htmlspecialchars(trim($_POST['wphone'])) : '';
    $formData['wmessage'] = isset($_POST['wmessage']) ? htmlspecialchars(trim($_POST['wmessage'])) : '';

    // 2. Validasi dasar
    if (empty($formData['wname']) || empty($formData['wemail']) || empty($formData['wmessage'])) {
        $errorMessage = 'Harap isi semua kolom yang wajib diisi.';
    } elseif (!isset($_FILES['wproof']) || $_FILES['wproof']['error'] !== UPLOAD_ERR_OK) {
        $errorMessage = 'Gagal mengunggah bukti pembelian. Pastikan Anda telah memilih file.';
    } else {
        // 3. Proses file yang diunggah
        $file_tmp_path = $_FILES['wproof']['tmp_name'];
        $file_name = $_FILES['wproof']['name'];
        $file_mime_type = mime_content_type($file_tmp_path);

        // Konfigurasi Telegram
        $botToken = '7556127257:AAHjYKxGwmz7rKEkiOGwWpNi2swmZHCriAg'; // Ganti dengan token Anda
        $chatId = '6685458865'; // Ganti dengan chat ID Anda
        $apiUrl = "https://api.telegram.org/bot{$botToken}/sendPhoto";

        // 4. Buat caption untuk pesan Telegram
        $caption = "🛠 *Klaim Garansi Baru*\n\n"
                 . "👤 *Nama:* " . $formData['wname'] . "\n"
                 . "📞 *Telepon:* " . $formData['wphone'] . "\n"
                 . "📧 *Email:* " . $formData['wemail'] . "\n"
                 . "📝 *Masalah:* " . $formData['wmessage'];

        // 5. Siapkan data untuk dikirim ke Telegram menggunakan cURL
        $post_fields = [
            'chat_id' => $chatId,
            'caption' => $caption,
            'parse_mode' => 'Markdown',
            'photo' => new CURLFile($file_tmp_path, $file_mime_type, $file_name)
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curl_error = curl_error($ch);
        curl_close($ch);

        // 6. Tampilkan pesan sukses atau error
        if ($httpcode == 200) {
            $successMessage = 'Klaim garansi Anda telah berhasil dikirim. Tim kami akan segera menghubungi Anda.';
            // Kosongkan formulir setelah berhasil
            $formData = ['wname' => '', 'wemail' => '', 'wphone' => '', 'wmessage' => ''];
        } else {
            $errorMessage = 'Terjadi kesalahan saat mengirim klaim. Silakan coba lagi. Detail: ' . $curl_error;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claim Garansi | Franki Store</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="bg-white shadow-xl rounded-2xl max-w-2xl w-full p-8 transition-all duration-500">
            <h1 class="text-3xl font-bold text-indigo-600 mb-2 text-center">Klaim Garansi Anda</h1>
            <p class="text-gray-600 text-center mb-8">Isi formulir di bawah ini untuk mengajukan klaim garansi. Tim kami akan segera menghubungi Anda.</p>

            <?php if (!empty($successMessage)): ?>
                <div class="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-md mb-6" role="alert">
                    <p class="font-bold">Berhasil!</p>
                    <p><?php echo $successMessage; ?></p>
                </div>
            <?php endif; ?>
            <?php if (!empty($errorMessage)): ?>
                <div class="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md mb-6" role="alert">
                    <p class="font-bold">Gagal!</p>
                    <p><?php echo $errorMessage; ?></p>
                </div>
            <?php endif; ?>

            <form action="claimgaransi.php" method="POST" class="space-y-6" enctype="multipart/form-data">
                <input type="text" name="wname" placeholder="Nama Lengkap" required value="<?php echo $formData['wname']; ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                <input type="email" name="wemail" placeholder="Alamat Email" required value="<?php echo $formData['wemail']; ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                <input type="tel" name="wphone" placeholder="Nomor Telepon" required value="<?php echo $formData['wphone']; ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">Unggah Bukti Pembelian</label>
                    <input type="file" name="wproof" accept="image/*" required class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer">
                </div>
                
                <textarea name="wmessage" rows="4" placeholder="Jelaskan masalah Anda..." required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"><?php echo $formData['wmessage']; ?></textarea>
                
                <button type="submit" class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-105">
                    Kirim Klaim
                </button>
            </form>
        </div>

        <div class="mt-6 text-center">
            <a href="index.php" class="inline-block px-6 py-2 text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50 transition-all duration-300">
                <i class="fas fa-arrow-left mr-2"></i> Kembali ke Kontak
            </a>
        </div>
    </div>
</body>
</html>
