// Slide presentation functionality
let currentSlide = 0;

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    body.setAttribute('data-theme', savedTheme);
    
    // Update icon based on current theme
    themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon based on new theme
    themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    
    // Update current slide to reflect theme change
    updateSlide();
}

// Helper function to get the appropriate image URL based on current theme
function getImageUrl(imageUrl) {
    if (typeof imageUrl === 'string') {
        return imageUrl; // Backward compatibility for single images
    }
    
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    return imageUrl[currentTheme] || imageUrl.dark || imageUrl.light;
}

// Navigation functions
function nextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlide();
        updateURL();
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
        updateURL();
    }
}

// URL management functions
function updateURL() {
    const url = new URL(window.location);
    url.searchParams.set('slide', currentSlide + 1);
    window.history.pushState({}, '', url);
}

function getSlideFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const slideParam = urlParams.get('slide');
    if (slideParam) {
        const slideNumber = parseInt(slideParam, 10);
        if (slideNumber >= 1 && slideNumber <= slides.length) {
            return slideNumber - 1; // Convert to 0-based index
        }
    }
    return 0; // Default to first slide
}

// Main slide update function
function updateSlide() {
    const slideContainer = document.getElementById('slideContainer');
    const slideCounter = document.getElementById('slideCounter');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const currentSlideData = slides[currentSlide];
    
    // Update slide counter and button states
    slideCounter.textContent = `${currentSlide + 1} / ${slides.length}`;
    prevButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === slides.length - 1;
    
    // Show/hide theme toggle based on current slide
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.style.display = currentSlide === 0 ? 'flex' : 'none';
    }
    
    // Clear existing content and styles
    slideContainer.className = 'slide-content padding-medium';
    slideContainer.innerHTML = '';
    
    // Add appropriate style class and content
    if (currentSlideData.style === 'video') {
        slideContainer.classList.add('video-style');
        
        // Check if it's a YouTube embed URL or direct video file
        if (currentSlideData.videoUrl.includes('youtube.com/embed/')) {
            // Handle YouTube embed URL
            slideContainer.innerHTML = `
                <div class="video-container fade-transition">
                    <iframe src="${currentSlideData.videoUrl}" 
                            class="fade-transition"
                            allowfullscreen>
                    </iframe>
                </div>
            `;
        } else {
            // Handle direct video URL (MP4, WebM, etc.)
            slideContainer.innerHTML = `
                <div class="video-container fade-transition">
                    <video src="${currentSlideData.videoUrl}" 
                           class="fade-transition"
                           controls
                           autoplay
                           muted>
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
        }
    } else if (currentSlideData.style === 'gif') {
        slideContainer.classList.add('video-style');
        
        slideContainer.innerHTML = `
            <div class="video-container fade-transition">
                <img src="${currentSlideData.gifUrl}" 
                     alt="GIF Animation"
                     class="fade-transition">
            </div>
        `;
    } else if (currentSlideData.style === 'image') {
        slideContainer.classList.add('image-style');
        
        const imageUrl = getImageUrl(currentSlideData.imageUrl);
        slideContainer.innerHTML = `
            <div class="video-container fade-transition">
                <img src="${imageUrl}" 
                     alt="${currentSlideData.title || 'Slide Image'}"
                     class="fade-transition">
            </div>
        `;
    } else if (currentSlideData.style === 'text-image') {
        slideContainer.classList.add('text-image-style');
        
        // Determine order based on imagePosition property (default: 'right')
        const imagePosition = currentSlideData.imagePosition || 'right';
        const textHalf = `
            <div class="text-half fade-transition">
                <h1 class="text-large color-gray-100 slide-title">${currentSlideData.title}</h1>
                <p class="text-medium color-gray-500 slide-subtitle">${currentSlideData.subtitle}</p>
            </div>
        `;
        const imageUrl = getImageUrl(currentSlideData.imageUrl);
        const imageHalf = `
            <div class="image-half fade-transition">
                <img src="${imageUrl}" 
                     alt="${currentSlideData.title || 'Slide Image'}"
                     class="fade-transition">
            </div>
        `;
        
        if (imagePosition === 'left') {
            slideContainer.innerHTML = imageHalf + textHalf;
        } else {
            slideContainer.innerHTML = textHalf + imageHalf;
        }
    } else {
        // Default to statement style
        slideContainer.classList.add('statement-style');
        slideContainer.innerHTML = `
            <div class="slide-text">
                <h1 class="text-large color-gray-100 fade-transition slide-title">${currentSlideData.title}</h1>
                <p class="text-medium color-gray-500 fade-transition slide-subtitle">${currentSlideData.subtitle}</p>
            </div>
        `;
    }
    
    // Add slide transition effect
    const elements = slideContainer.querySelectorAll('.fade-transition');
    elements.forEach(el => el.style.opacity = '0');
    
    setTimeout(() => {
        elements.forEach(el => el.style.opacity = '1');
    }, 150);
}

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Initialize slides
    currentSlide = getSlideFromURL();
    updateSlide();
    updateURL();
    
    // Add theme toggle event listener
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' || event.key === ' ') {
        nextSlide();
    } else if (event.key === 'ArrowLeft') {
        previousSlide();
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    currentSlide = getSlideFromURL();
    updateSlide();
}); 