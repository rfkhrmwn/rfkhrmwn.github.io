document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "ubed2407";
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const resetBtn = document.getElementById('reset-btn');
    const imageInput = document.getElementById('image-input');
    const imageBtn = document.getElementById('image-btn');
    const aiStatus = document.getElementById('ai-status');

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }

    function createTypingIndicatorElement() {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'ai-message', 'typing-indicator-container');
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        bubbleDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>`;
        messageDiv.appendChild(bubbleDiv);
        return messageDiv;
    }

    /**
     * Menambahkan pesan ke container chat.
     * @param {string} content - Teks pesan.
     * @param {'user'|'ai'} sender - Pengirim pesan ('user' atau 'ai').
     * @param {'text'|'image_preview'|'generated_image'} type - Tipe pesan.
     * @param {string} [imageUrl=''] - URL gambar jika tipe adalah 'image_preview' atau 'generated_image'.
     * @returns {HTMLElement} - Mengembalikan elemen yang berisi konten (teks atau gambar) untuk typewriter atau manipulasi lebih lanjut.
     */
    function addMessageToChat(content, sender, type = 'text', imageUrl = '') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');

        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');

        let contentElement; // Ini akan menjadi elemen yang berisi teks atau gambar

        if (type === 'image_preview' || type === 'generated_image') {
            contentElement = document.createElement('img');
            contentElement.src = imageUrl;
            contentElement.alt = (type === 'image_preview' ? "Preview Gambar Pengguna" : "Gambar dari AI");
            contentElement.classList.add(type === 'image_preview' ? 'image-preview' : 'generated-image-ai');
            contentElement.onerror = () => {
                console.error(`Gagal memuat gambar: ${imageUrl}`);
                contentElement.remove(); // Hapus elemen gambar yang gagal
                const errorText = document.createElement('div');
                errorText.classList.add('message-text-content');
                errorText.textContent = (type === 'image_preview' ? "Gagal memuat preview gambar." : "Gagal memuat gambar dari AI. URL mungkin tidak valid atau ada masalah jaringan.");
                bubbleDiv.insertBefore(errorText, timestampDiv); // Sisipkan pesan error sebelum timestamp
            };
            bubbleDiv.appendChild(contentElement);
        } else { // type === 'text'
            contentElement = document.createElement('div');
            contentElement.classList.add('message-text-content');
            contentElement.textContent = content; // Untuk pesan user, langsung isi teks
            bubbleDiv.appendChild(contentElement);
        }
        
        const timestampDiv = document.createElement('div');
        timestampDiv.classList.add('timestamp');
        timestampDiv.innerHTML = `${getCurrentTime()} ${sender === 'user' ? '<i class="fas fa-check-double"></i>' : ''}`;
        bubbleDiv.appendChild(timestampDiv);
        
        messageDiv.appendChild(bubbleDiv);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        return contentElement; // Kembalikan elemen konten untuk diisi oleh typewriter jika perlu
    }

    // =====================================================================================
    // BAGIAN INI YANG BERUBAH: Menggunakan API /ai/blackbox untuk teks chat
    // =====================================================================================
    async function getRfkAiTextResponse(prompt) {
        aiStatus.textContent = 'Mengetik...';
        try {
            const encodedPrompt = encodeURIComponent(prompt);
            // --- PERUBAHAN DI SINI ---
            const response = await fetch(`https://api.ubed.my.id/ai/blackbox?apikey=${apiKey}&ask=${encodedPrompt}`);
            // --- BATAS PERUBAHAN ---
            if (!response.ok) {
                const errorData = await response.text();
                console.error("API Text Error Response:", errorData);
                return `Maaf, terjadi masalah dengan server AI (Status: ${response.status}).`;
            }
            const data = await response.json();
            // --- KOREKSI PADA PENGAMBILAN DATA.data KARENA /blackbox mengembalikan data.data ---
            return data.data || data.result || data.respon || data.message || "Maaf, format respons AI tidak dikenal.";
        } catch (err) {
            console.error("Fetch Text Error:", err);
            return "Terjadi kesalahan menghubungi AI. Periksa koneksi Anda.";
        } finally {
            aiStatus.textContent = 'Online';
        }
    }
    // =====================================================================================
    // AKHIR DARI BAGIAN YANG BERUBAH
    // =====================================================================================
    
    async function getRfkAiImageAnalysisResponse(base64Image, askText = "Apa isi gambar ini?") {
        aiStatus.textContent = 'Menganalisis gambar...';
        try {
            const response = await fetch("https://api.ubed.my.id/ai/ubed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apikey: apiKey, image: base64Image, ask: askText })
            });
            if (!response.ok) {
                const errorData = await response.text();
                console.error("API Image Analysis Error:", errorData);
                return `Gagal menganalisis gambar (Status: ${response.status}).`;
            }
            const data = await response.json();
            return data.result || data.respon || data.message || "Tidak dapat menganalisis gambar.";
        } catch (error) {
            console.error("Fetch Image Analysis Error:", error);
            return "Kesalahan mengirim gambar ke AI untuk analisis.";
        } finally {
            aiStatus.textContent = 'Online';
        }
    }

    async function generateImageFromTextApi(prompt) {
        aiStatus.textContent = 'Membuat gambar...';
        try {
            const encodedPrompt = encodeURIComponent(prompt);
            const apiUrl = `https://api.ubed.my.id/ai/ai4chat-image?apikey=${apiKey}&text=${encodedPrompt}`;
            console.log("Mencoba generate gambar dengan URL:", apiUrl);

            const response = await fetch(apiUrl);

            if (!response.ok) {
                let errorMsg = `Gagal membuat gambar (Status: ${response.status}).`;
                try {
                    const errorData = await response.json();
                    errorMsg += ` Pesan: ${errorData.message || errorData.error || JSON.stringify(errorData)}`;
                } catch (e) {
                    const errorText = await response.text();
                    errorMsg += ` Detail: ${errorText}`;
                }
                console.error("API Image Generation Error:", errorMsg);
                return { success: false, data: errorMsg };
            }
            
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                const imageUrl = data.result || data.url || data.image || (data.data ? data.data.url : null);
                if (imageUrl) {
                    return { success: true, data: imageUrl };
                } else {
                    console.error("API Image Generation - JSON tidak mengandung URL gambar:", data);
                    return { success: false, data: "Format JSON dari API gambar tidak valid atau tidak ada URL gambar." };
                }
            } else if (contentType && contentType.startsWith("image/")) {
                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                return { success: true, data: imageUrl };
            } else {
                console.error("API Image Generation - Tipe konten tidak dikenal:", contentType);
                const responseText = await response.text();
                console.error("Response Text:", responseText);
                return { success: false, data: `Tipe respons API tidak dikenal: ${contentType}. Coba cek log server API.` };
            }

        } catch (err) {
            console.error("Fetch Image Generation Error:", err);
            return { success: false, data: "Terjadi kesalahan saat menghubungi AI pembuat gambar." };
        } finally {
            aiStatus.textContent = 'Online';
        }
    }

    function typeWriter(elementContent, text, speed = 25) {
        let i = 0;
        elementContent.innerHTML = ''; // Pastikan elemen kosong sebelum memulai

        function typing() {
            if (i < text.length) {
                // Perbarui innerHTML dengan substring hingga karakter saat ini
                // Ini menangani kasus newline dengan benar
                const lines = text.substring(0, i + 1).split('\n');
                elementContent.innerHTML = lines.slice(0, -1).join('<br>') + (lines.length > 1 ? '<br>' : '') + lines[lines.length - 1];

                chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll saat mengetik
                i++;
                setTimeout(typing, speed);
            } else {
                // Pastikan teks akhir benar setelah selesai mengetik
                const lines = text.split('\n');
                elementContent.innerHTML = lines.join('<br>');
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
        typing();
    }

    async function handleSendMessage() {
        const text = userInput.value.trim();
        if (!text && !imageInput.files[0]) return; // Jangan kirim jika input teks kosong dan tidak ada gambar

        let imageFileToSend = imageInput.files[0];
        let base64Image = '';

        // Jika ada gambar dipilih, proses gambar terlebih dahulu
        if (imageFileToSend) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                base64Image = event.target.result;
                // Tampilkan preview gambar di chat
                addMessageToChat('', 'user', 'image_preview', base64Image);
                imageInput.value = ''; // Reset input file setelah digunakan

                // Tampilkan indikator mengetik
                const typingIndicator = createTypingIndicatorElement();
                chatContainer.appendChild(typingIndicator);
                chatContainer.scrollTop = chatContainer.scrollHeight;

                const analysisText = text || "Apa isi gambar ini?"; // Gunakan teks user atau default
                const aiReplyText = await getRfkAiImageAnalysisResponse(base64Image, analysisText);
                
                // Hapus indikator mengetik
                chatContainer.removeChild(typingIndicator);
                
                // Tampilkan balasan AI dengan efek typewriter
                const aiMessageContentElement = addMessageToChat('', 'ai', 'text');
                typeWriter(aiMessageContentElement, aiReplyText);
            };
            reader.readAsDataURL(imageFileToSend); // Mulai membaca file sebagai Data URL
            userInput.value = ''; // Bersihkan input teks setelah mengirim gambar
            userInput.focus();
            return; // Keluar dari fungsi karena pemrosesan gambar akan melanjutkan alur
        }
        
        // Jika tidak ada gambar, proses teks
        addMessageToChat(text, 'user', 'text');
        const originalUserInput = text;
        userInput.value = '';
        userInput.focus();

        const typingIndicator = createTypingIndicatorElement();
        chatContainer.appendChild(typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        if (originalUserInput.toLowerCase().startsWith("/gambar ")) {
            const imagePrompt = originalUserInput.substring(8).trim();
            if (!imagePrompt) {
                chatContainer.removeChild(typingIndicator);
                const aiMessageContentElement = addMessageToChat('', 'ai', 'text');
                typeWriter(aiMessageContentElement, "Silakan berikan deskripsi untuk gambar yang ingin dibuat setelah perintah /gambar.");
                return;
            }
            
            const imageResult = await generateImageFromTextApi(imagePrompt);
            chatContainer.removeChild(typingIndicator); // Hapus indikator setelah API selesai

            if (imageResult.success) {
                addMessageToChat('', 'ai', 'generated_image', imageResult.data);
                // Jika gambar berhasil, mungkin tidak perlu teks balasan lagi, atau bisa tambahkan "Gambar berhasil dibuat."
            } else {
                const aiMessageContentElement = addMessageToChat('', 'ai', 'text');
                typeWriter(aiMessageContentElement, imageResult.data); // Tampilkan pesan error
            }

        } else {
            const aiReplyText = await getRfkAiTextResponse(originalUserInput);
            chatContainer.removeChild(typingIndicator); // Hapus indikator setelah API selesai
            
            const aiMessageContentElement = addMessageToChat('', 'ai', 'text');
            typeWriter(aiMessageContentElement, aiReplyText);
        }
    }

    sendBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    resetBtn.addEventListener('click', () => {
        chatContainer.innerHTML = '';
        // Panggil welcome message setelah reset
        const welcomeContentElement = addMessageToChat('', 'ai', 'text');
        typeWriter(welcomeContentElement, "Hai! Saya Rfk AI. Ketik pesan atau coba '/gambar deskripsi_gambar' untuk membuat gambar, atau kirim gambar untuk analisis.");
    });

    imageBtn.addEventListener('click', () => imageInput.click());

    // Initial welcome message saat halaman dimuat
    window.addEventListener('load', () => {
        const welcomeContentElement = addMessageToChat('', 'ai', 'text');
        typeWriter(welcomeContentElement, "Hai! Saya Rfk AI. Ketik pesan atau coba '/gambar deskripsi_gambar' untuk membuat gambar, atau kirim gambar untuk analisis.");
    });

}); // End DOMContentLoaded
