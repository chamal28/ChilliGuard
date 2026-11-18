// ============================================================
// FORGOT-PASSWORD.JS - Forgot Password page functionality
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const forgotForm = document.getElementById('forgotForm');
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('resetEmail')?.value.trim();
            
            if (!email) {
                alert('Please enter your registered email address.');
                return;
            }
            
            if (!email.includes('@') || !email.includes('.')) {
                alert('Please enter a valid email address.');
                return;
            }
            
            console.log('🔑 Password reset requested for:', email);
            
            const submitBtn = forgotForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
            submitBtn.disabled = true;
            
            // Simulate email sending
            setTimeout(function() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                alert('✅ Password reset link has been sent to your email.\nPlease check your inbox (and spam folder).');
                window.location.href = 'login.html';
            }, 1500);
        });
    }
    
    // Back to login link
    const backToLogin = document.querySelector('.back-to-login');
    if (backToLogin) {
        backToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
});