const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const copyBtn = document.getElementById('copyBtn');
const errorMessage = document.getElementById('error');
const successMessage = document.getElementById('success');
const resultContainer = document.getElementById('result');
const loadingSpinner = document.getElementById('loadingSpinner');
const originalUrlDisplay = document.getElementById('originalUrl');
const shortUrlDisplay = document.getElementById('shortUrl');

// Shorten URL button click
shortenBtn.addEventListener('click', shortenURL);

// Allow Enter key to shorten URL
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        shortenURL();
    }
});

async function shortenURL() {
    const longUrl = urlInput.value.trim();

    // Clear previous messages
    clearMessages();

    // Validate input
    if (!longUrl) {
        showError('Please enter a URL');
        return;
    }

    if (!isValidUrl(longUrl)) {
        showError('Please enter a valid URL (must start with http:// or https://)');
        return;
    }

    // Show loading spinner
    loadingSpinner.style.display = 'block';
    shortenBtn.disabled = true;

    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: longUrl }),
        });

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            showError('Invalid response from server. Please try again.');
            return;
        }

        if (response.ok && data.short_url) {
            // Display result
            originalUrlDisplay.textContent = longUrl;
            shortUrlDisplay.textContent = data.shortened_url || window.location.origin + '/' + data.short_url;
            resultContainer.style.display = 'block';
            showSuccess('URL shortened successfully!');
            urlInput.value = '';
        } else {
            showError(data.error || 'Failed to shorten URL. Please check your URL and try again.');
        }
    } catch (error) {
        console.error('Network Error:', error);
        showError('Network error. Please check your connection and try again.');
    } finally {
        loadingSpinner.style.display = 'none';
        shortenBtn.disabled = false;
    }
}

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    const shortUrl = shortUrlDisplay.textContent;
    navigator.clipboard.writeText(shortUrl).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(() => {
        showError('Failed to copy to clipboard');
    });
});

// Validate URL format
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    successMessage.classList.remove('show');
    resultContainer.style.display = 'none';
}

// Show success message
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.add('show');
    errorMessage.classList.remove('show');
}

// Clear messages
function clearMessages() {
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
}
