document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatOutput = document.getElementById('chat-output');
    const loadingIndicator = document.getElementById('loading-indicator');

    const API_KEY = "ubed2407"; // Ganti dengan API key Anda jika perlu
    const BASE_URL = "https://api.ubed.my.id/ai/blackbox";

    // Function to append message to chat window
    function appendMessage(sender, message) {
        const messageElement = document.createElement('p');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatOutput.appendChild(messageElement);
        // Scroll to the bottom of the chat window
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    // Function to send message to API
    async function sendMessage() {
        const question = userInput.value.trim();
        if (!question) return;

        appendMessage('user', question);
        userInput.value = ''; // Clear input field

        loadingIndicator.classList.remove('hidden'); // Show loading indicator
        sendButton.disabled = true; // Disable send button

        try {
            const encodedQuestion = encodeURIComponent(question);
            const apiUrl = `${BASE_URL}?apikey=${API_KEY}&ask=${encodedQuestion}`;
            console.log("Fetching from:", apiUrl); // For debugging

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.status && data.data) {
                appendMessage('bot', data.data);
            } else {
                appendMessage('bot', 'Maaf, saya tidak dapat memproses pertanyaan Anda saat ini. Silakan coba lagi.');
                console.error("API Error:", data);
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            appendMessage('bot', 'Terjadi kesalahan saat menghubungi server AI. Mohon coba beberapa saat lagi.');
        } finally {
            loadingIndicator.classList.add('hidden'); // Hide loading indicator
            sendButton.disabled = false; // Re-enable send button
            userInput.focus(); // Focus back on input
        }
    }

    // Event listener for send button click
    sendButton.addEventListener('click', sendMessage);

    // Event listener for Enter key press in input field
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Initial focus on input field
    userInput.focus();
});
