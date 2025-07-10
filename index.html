<?php
// FILE: index.php

// Inisialisasi variabel untuk pesan status dan data formulir
$successMessage = '';
$errorMessage = '';
$formData = [
    'name' => '',
    'email' => '',
    'phone' => '',
    'message' => ''
];

// Cek apakah request adalah metode POST (artinya formulir dikirim)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Konfigurasi Telegram Bot
    $telegramBotToken = '7556127257:AAHjYKxGwmz7rKEkiOGwWpNi2swmZHCriAg'; // Ganti dengan token Anda
    $chatId = '6685458865'; // Ganti dengan chat ID Anda

    // 1. Ambil dan bersihkan data dari formulir
    // Menggunakan htmlspecialchars untuk mencegah XSS
    $formData['name'] = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
    $formData['email'] = isset($_POST['email']) ? htmlspecialchars(trim($_POST['email'])) : '';
    $formData['phone'] = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : '';
    $formData['message'] = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

    // 2. Validasi dasar (memastikan kolom wajib diisi)
    if (empty($formData['name']) || empty($formData['email']) || empty($formData['message'])) {
        $errorMessage = 'Harap isi semua kolom yang wajib diisi (Nama, Email, dan Pesan).';
    } else {
        // 3. Buat pesan untuk Telegram
        $telegramMessage = "*Permintaan Kontak Baru*\n\n"
                         . "*Nama:* " . $formData['name'] . "\n"
                         . "*Email:* " . $formData['email'] . "\n"
                         . "*Telepon:* " . $formData['phone'] . "\n"
                         . "*Pesan:* " . $formData['message'];

        // 4. Kirim pesan menggunakan cURL
        $url = "https://api.telegram.org/bot{$telegramBotToken}/sendMessage";
        $params = [
            'chat_id' => $chatId,
            'text' => $telegramMessage,
            'parse_mode' => 'Markdown',
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curl_error = curl_error($ch);
        curl_close($ch);

        // 5. Set pesan sukses atau error berdasarkan respons
        if ($httpcode == 200 && $response) {
            $successMessage = 'Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda kembali.';
            // Kosongkan form data agar field menjadi kosong setelah sukses
            $formData = ['name' => '', 'email' => '', 'phone' => '', 'message' => ''];
        } else {
            $errorMessage = 'Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi. Error: ' . $curl_error;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us | Franki Official</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        [x-cloak] { display: none !important; }
    </style>
</head>
<body 
    class="bg-gray-50 text-gray-800"
    x-data="{ isLoading: true, isMenuOpen: false }" 
    x-init="setTimeout(() => isLoading = false, 1500)"
>

    <div x-show="isLoading" x-transition:leave="transition ease-in duration-500" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="fixed inset-0 bg-white flex justify-center items-center z-50">
        <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600"></div>
    </div>

    <nav class="bg-white shadow-md sticky top-0 z-40" x-cloak>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <a href="#" class="text-2xl font-bold text-indigo-600">Franki</a>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <a href="#" class="text-gray-600 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</a>
                        <a href="garansi.html" class="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">Claim Garansi</a>
                    </div>
                </div>
                <div class="-mr-2 flex md:hidden">
                    <button @click="isMenuOpen = !isMenuOpen" type="button" class="bg-indigo-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none">
                        <i class="fas" :class="{ 'fa-bars': !isMenuOpen, 'fa-times': isMenuOpen }"></i>
                    </button>
                </div>
            </div>
        </div>
        <div x-show="isMenuOpen" class="md:hidden" x-transition>
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#" class="text-gray-600 hover:bg-indigo-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">Home</a>
                <a href="garansi.html" class="bg-indigo-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors">Claim Garansi</a>
            </div>
        </div>
    </nav>

    <main x-show="!isLoading" x-transition:enter="transition ease-out duration-1000" x-transition:enter-start="opacity-0 translate-y-5" x-transition:enter-end="opacity-100 translate-y-0" x-cloak>
        
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Hubungi Tim Franki</h1>
                <p class="text-lg md:text-xl opacity-90">Silakan isi data agar admin kami dapat merespons pesan Anda.</p>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>

                    <?php if (!empty($successMessage)): ?>
                        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6" role="alert">
                            <p><?php echo $successMessage; ?></p>
                        </div>
                    <?php endif; ?>
                    <?php if (!empty($errorMessage)): ?>
                        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                            <p><?php echo $errorMessage; ?></p>
                        </div>
                    <?php endif; ?>

                    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST" class="space-y-6">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input type="text" id="name" name="name" required value="<?php echo $formData['name']; ?>" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                            <input type="email" id="email" name="email" required value="<?php echo $formData['email']; ?>" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                        </div>
                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                            <input type="tel" id="phone" name="phone" value="<?php echo $formData['phone']; ?>" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                        </div>
                        <div>
                            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Pesan Anda</label>
                            <textarea id="message" name="message" rows="5" required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"><?php echo $formData['message']; ?></textarea>
                        </div>
                        <div>
                            <button type="submit" class="w-full flex justify-center items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                Kirim Pesan <i class="fas fa-paper-plane ml-2"></i>
                            </button>
                        </div>
                    </form>
                </div>

                <div class="space-y-8">
                    <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
                        <div class="space-y-4">
                            </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                        <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b3edb694-5a6e-4051-9e9e-0ac3e9a3ab9f.png" alt="Customer Service Illustration" class="w-full h-full object-cover">
                    </div>
                </div>
            </div>
        </div>
    </main>

</body>
</html>
