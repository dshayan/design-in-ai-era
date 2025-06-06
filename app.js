// Slide presentation functionality
let currentSlide = 0;

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
    
    // Clear existing content and styles
    slideContainer.className = 'slide-content padding-medium';
    slideContainer.innerHTML = '';
    
    // Add appropriate style class and content
    if (currentSlideData.style === 'video') {
        slideContainer.classList.add('video-style');
        
        // Handle YouTube video ID with timestamp
        let videoUrl = '';
        if (currentSlideData.videoId.includes('?t=')) {
            const [videoId, timestamp] = currentSlideData.videoId.split('?t=');
            videoUrl = `https://www.youtube.com/embed/${videoId}?start=${timestamp}`;
        } else {
            videoUrl = `https://www.youtube.com/embed/${currentSlideData.videoId}`;
        }
        
        slideContainer.innerHTML = `
            <div class="video-container">
                <iframe src="${videoUrl}" 
                        allowfullscreen>
                </iframe>
            </div>
        `;
    } else if (currentSlideData.style === 'gif') {
        slideContainer.classList.add('video-style');
        
        slideContainer.innerHTML = `
            <div class="video-container">
                <img src="${currentSlideData.gifUrl}" 
                     alt="GIF Animation"
                     style="width: 100%; height: 100%; object-fit: contain;">
            </div>
        `;
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
    currentSlide = getSlideFromURL();
    updateSlide();
    updateURL();
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