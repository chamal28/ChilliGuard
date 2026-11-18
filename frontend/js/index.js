// ============================================================
// INDEX.JS - Homepage interactions
// ============================================================

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Select all anchor links with hash (#)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Console welcome message (optional)
    console.log('🌿 ChilliGuard - Smart Protection for Nai Miris Farmers');
    console.log('🚀 Built with ❤️ for Sri Lankan farmers');
});