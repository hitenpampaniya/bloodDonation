document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginFormContainer = document.getElementById('login-form');
    const signupFormContainer = document.getElementById('signup-form');
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    
    // Dashboard elements
    const navLinks = document.querySelectorAll('.nav-link');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const logoutBtn = document.getElementById('logout-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const changePasswordModal = document.getElementById('change-password-modal');
    const closeModal = document.querySelector('.close-modal');
    const changePasswordForm = document.getElementById('change-password-form');
    
    // User data (in a real app, this would come from a server/database)
    let users = JSON.parse(localStorage.getItem('bloodDonationUsers')) || [];
    let currentUser = null;

    // Event Listeners
    showSignup.addEventListener('click', showSignupForm);
    showLogin.addEventListener('click', showLoginForm);
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Dashboard event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(link.dataset.section);
        });
    });
    
    logoutBtn.addEventListener('click', handleLogout);
    changePasswordBtn.addEventListener('click', () => {
        changePasswordModal.classList.remove('hidden');
    });
    
    closeModal.addEventListener('click', () => {
        changePasswordModal.classList.add('hidden');
    });
    
    changePasswordForm.addEventListener('submit', handleChangePassword);
    
    // Check if user is already logged in
    checkLoggedIn();

    // Functions
    function showSignupForm(e) {
        e.preventDefault();
        loginFormContainer.classList.add('hidden');
        signupFormContainer.classList.remove('hidden');
    }

    function showLoginForm(e) {
        e.preventDefault();
        signupFormContainer.classList.add('hidden');
        loginFormContainer.classList.remove('hidden');
    }

    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Find user in "database"
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('bloodDonationCurrentUser', JSON.stringify(user));
            showDashboard(user);
        } else {
            alert('Invalid email or password. Please try again.');
        }
    }

    function handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const bloodType = document.getElementById('signup-blood-type').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            alert('User with this email already exists!');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            bloodType,
            donations: 0,
            lastDonation: null,
            phone: '',
            dob: '',
            address: '',
            city: '',
            state: '',
            zip: ''
        };
        
        users.push(newUser);
        localStorage.setItem('bloodDonationUsers', JSON.stringify(users));
        
        // Log in the new user
        currentUser = newUser;
        localStorage.setItem('bloodDonationCurrentUser', JSON.stringify(newUser));
        showDashboard(newUser);
    }

    function showDashboard(user) {
        authContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        
        // Update user info in dashboard
        document.getElementById('user-greeting').textContent = `Welcome, ${user.name.split(' ')[0]}`;
        document.getElementById('welcome-user').textContent = `Welcome back, ${user.name}!`;
        document.getElementById('user-blood-type').textContent = user.bloodType;
        document.getElementById('total-donations').textContent = user.donations;
        document.getElementById('last-donation').textContent = user.lastDonation ? formatDate(user.lastDonation) : 'Never';
        
        // Update profile section
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-blood-type').textContent = `Blood Type: ${user.bloodType}`;
        
        document.getElementById('profile-name-input').value = user.name;
        document.getElementById('profile-email-input').value = user.email;
        document.getElementById('profile-phone').value = user.phone;
        document.getElementById('profile-dob').value = user.dob;
        document.getElementById('profile-address').value = user.address;
        document.getElementById('profile-city').value = user.city;
        document.getElementById('profile-state').value = user.state;
        document.getElementById('profile-zip').value = user.zip;
        document.getElementById('profile-blood-type-select').value = user.bloodType;
        
        // Set up profile form submission
        document.getElementById('profile-form').addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }

    function updateProfile() {
        const name = document.getElementById('profile-name-input').value;
        const email = document.getElementById('profile-email-input').value;
        const phone = document.getElementById('profile-phone').value;
        const dob = document.getElementById('profile-dob').value;
        const address = document.getElementById('profile-address').value;
        const city = document.getElementById('profile-city').value;
        const state = document.getElementById('profile-state').value;
        const zip = document.getElementById('profile-zip').value;
        
        // Update current user
        currentUser.name = name;
        currentUser.email = email;
        currentUser.phone = phone;
        currentUser.dob = dob;
        currentUser.address = address;
        currentUser.city = city;
        currentUser.state = state;
        currentUser.zip = zip;
        
        // Update in "database"
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('bloodDonationUsers', JSON.stringify(users));
            localStorage.setItem('bloodDonationCurrentUser', JSON.stringify(currentUser));
        }
        
        // Update displayed info
        document.getElementById('profile-name').textContent = name;
        document.getElementById('profile-email').textContent = email;
        document.getElementById('user-greeting').textContent = `Welcome, ${name.split(' ')[0]}`;
        document.getElementById('welcome-user').textContent = `Welcome back, ${name}!`;
        
        alert('Profile updated successfully!');
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('bloodDonationCurrentUser');
        dashboardContainer.classList.add('hidden');
        authContainer.classList.remove('hidden');
        showLoginForm({ preventDefault: () => {} });
    }

    function checkLoggedIn() {
        const user = JSON.parse(localStorage.getItem('bloodDonationCurrentUser'));
        if (user) {
            currentUser = user;
            showDashboard(user);
        }
    }

    function switchSection(sectionId) {
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });
        
        // Show corresponding section
        dashboardSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${sectionId}-section`) {
                section.classList.add('active');
            }
        });
    }

    function handleChangePassword(e) {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;
        
        // Validate current password
        if (currentPassword !== currentUser.password) {
            alert('Current password is incorrect!');
            return;
        }
        
        // Validate new passwords match
        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match!');
            return;
        }
        
        // Update password
        currentUser.password = newPassword;
        
        // Update in "database"
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('bloodDonationUsers', JSON.stringify(users));
            localStorage.setItem('bloodDonationCurrentUser', JSON.stringify(currentUser));
        }
        
        alert('Password changed successfully!');
        changePasswordModal.classList.add('hidden');
        changePasswordForm.reset();
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
});
// Profile picture preview functionality
document.getElementById('signup-profile-pic').addEventListener('change', function(e) {
    const preview = document.getElementById('profile-pic-preview');
    const defaultPic = document.querySelector('.default-pic');
    const file = e.target.files[0];
    
    if (file) {
        // Check if the file is an image
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }
        
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image size should be less than 2MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            defaultPic.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.classList.add('hidden');
        defaultPic.classList.remove('hidden');
    }
});
