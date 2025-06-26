document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const bookingModal = document.getElementById('booking-modal');
    const bookBtns = document.querySelectorAll('.book-btn');
    const bookingForm = document.querySelector('.booking-form');
    const teachersContainer = document.getElementById('teachers-container');
    const bookingsContainer = document.getElementById('bookings-container');
    const exploreBtn = document.querySelector('.explore-btn');
    const findTeachersBtn = document.querySelector('.find-teachers-btn');
    const toast = document.getElementById('toast');
    
    // Sample Data
    const teachers = [
    {
        id: 1,
        name: "Prof. Rajesh Sharma",
        department: "Mathematics",
        bio: "PhD in Applied Mathematics with 12 years of teaching experience. Specializes in calculus and differential equations.",
        rating: 4.7,
        reviews: 45,
        image: "https://i.ibb.co/pvnmg440/Amit-Setia.webp"
    },
    {
        id: 2,
        name: "Dr. Priya Patel",
        department: "Computer Science",
        bio: "M.Tech in Computer Science from IIT Delhi. Expert in data structures and algorithms with 8 years of experience.",
        rating: 4.9,
        reviews: 38,
        image: "https://i.ibb.co/Gmx6FWC/1746476696746.jpg"
    },
    {
        id: 3,
        name: "Prof. Amit Singh",
        department: "English Literature",
        bio: "PhD in English Literature, Oxford University. Published author with expertise in British and American literature.",
        rating: 4.8,
        reviews: 52,
        image: "https://i.ibb.co/bjnLLCFc/SINGH42308.jpg"
    },
    {
        id: 4,
        name: "Dr. Neha Gupta",
        department: "Physics",
        bio: "Postdoctoral researcher in Quantum Physics with 6 years of teaching experience at university level.",
        rating: 4.6,
        reviews: 29,
        image: "https://i.ibb.co/j9KXv9h7/Neha-Gupta111622.jpg"
    },
    {
        id: 5,
        name: "Prof. Sanjay Verma",
        department: "Biology",
        bio: "PhD in Molecular Biology with 15 years of research and teaching experience. Published in Nature Journal.",
        rating: 4.5,
        reviews: 34,
        image: "https://i.ibb.co/0pjXHVfh/SK.jpg"
    },
    {
        id: 6,
        name: "Dr. Ananya Joshi",
        department: "History",
        bio: "Specialist in Ancient Indian History with MA and PhD from JNU. Authored 3 books on historical studies.",
        rating: 4.7,
        reviews: 41,
        image: "https://i.ibb.co/5X5gyTmd/1741015986886.jpg"
    }
];
    
    let bookings = [];
    
    // Initialize the app
    function initApp() {
        renderTeachers();
        renderBookings();
        setupEventListeners();
    }
    
    // Render teachers to the page
    function renderTeachers() {
        teachersContainer.innerHTML = '';
        
        teachers.forEach(teacher => {
            const teacherCard = document.createElement('div');
            teacherCard.className = 'teacher-card';
            teacherCard.innerHTML = `
                <div class="teacher-image">
                    <img src="${teacher.image}" alt="${teacher.name}">
                </div>
                <div class="teacher-info">
                    <h4 class="teacher-name">${teacher.name}</h4>
                    <p class="teacher-dept">${teacher.department} Department</p>
                    <p class="teacher-bio">${teacher.bio}</p>
                    <div class="rating">
                        ${renderStars(teacher.rating)}
                        <span>${teacher.rating} (${teacher.reviews} reviews)</span>
                    </div>
                    <button class="btn primary-btn book-btn" data-teacher-id="${teacher.id}">Book Appointment</button>
                </div>
            `;
            teachersContainer.appendChild(teacherCard);
        });
        
        // Add event listeners to book buttons
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', openBookingModal);
        });
    }
    
    // Render star ratings
    function renderStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    // Render bookings to the page
    function renderBookings() {
        bookingsContainer.innerHTML = '';
        
        if (bookings.length === 0) {
            bookingsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <p>You don't have any bookings yet</p>
                    <button class="btn primary-btn find-teachers-btn">Find Teachers</button>
                </div>
            `;
            
            document.querySelector('.find-teachers-btn')?.addEventListener('click', () => {
                navigateToSection('teachers');
            });
            return;
        }
        
        bookings.forEach(booking => {
            const teacher = teachers.find(t => t.id === booking.teacherId);
            if (!teacher) return;
            
            const bookingCard = document.createElement('div');
            bookingCard.className = 'booking-card';
            bookingCard.innerHTML = `
                <div class="booking-teacher">
                    <img src="${teacher.image}" alt="${teacher.name}">
                    <div class="booking-details">
                        <h5>${teacher.name}</h5>
                        <p>${teacher.department} Department</p>
                        <p>Purpose: ${booking.purpose}</p>
                    </div>
                </div>
                <div class="booking-time">
                    <div class="date">${formatDate(booking.date)}</div>
                    <div class="time">${booking.time}</div>
                    <button class="cancel-booking" data-booking-id="${booking.id}">Cancel</button>
                </div>
            `;
            bookingsContainer.appendChild(bookingCard);
        });
        
        // Add event listeners to cancel buttons
        document.querySelectorAll('.cancel-booking').forEach(btn => {
            btn.addEventListener('click', cancelBooking);
        });
    }
    
    // Format date for display
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                navigateToSection(section);
            });
        });
        
        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // Auth modal buttons
        loginBtn.addEventListener('click', () => {
            openAuthModal('login');
        });
        
        signupBtn.addEventListener('click', () => {
            openAuthModal('signup');
        });
        
        // Close modals
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        // Auth tabs
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                switchAuthTab(tabName);
            });
        });
        
        // Auth forms submission
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you would handle login here
            showToast('Logged in successfully!');
            closeAllModals();
        });
        
        document.getElementById('signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you would handle signup here
            showToast('Account created successfully!');
            closeAllModals();
        });
        
        // Booking form submission
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const teacherId = parseInt(bookingForm.getAttribute('data-teacher-id'));
            const date = document.getElementById('booking-date').value;
            const time = document.getElementById('booking-time').value;
            const purpose = document.getElementById('booking-purpose').value;
            
            if (!date || !time || !purpose) {
                showToast('Please fill all fields', 'error');
                return;
            }
            
            const newBooking = {
                id: Date.now(),
                teacherId,
                date,
                time,
                purpose,
                createdAt: new Date().toISOString()
            };
            
            bookings.unshift(newBooking);
            renderBookings();
            closeAllModals();
            showToast('Booking confirmed successfully!');
            
            // Reset form
            bookingForm.reset();
        });
        
        // Explore teachers button
        exploreBtn?.addEventListener('click', () => {
            navigateToSection('teachers');
        });
        
        // Find teachers button in empty bookings state
        findTeachersBtn?.addEventListener('click', () => {
            navigateToSection('teachers');
        });
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeAllModals();
                }
            });
        });
    }
    
    // Navigate to section
    function navigateToSection(section) {
        // Hide all sections
        contentSections.forEach(sec => {
            sec.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(`${section}-section`).classList.add('active');
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            }
        });
        
        // Close mobile menu if open
        mainNav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    // Open auth modal
    function openAuthModal(tab) {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        switchAuthTab(tab);
    }
    
    // Open booking modal
    function openBookingModal(e) {
        const teacherId = parseInt(e.currentTarget.getAttribute('data-teacher-id'));
        const teacher = teachers.find(t => t.id === teacherId);
        
        if (!teacher) return;
        
        // Update modal with teacher info
        const modal = bookingModal.querySelector('.teacher-info-modal');
        modal.querySelector('.teacher-avatar').src = teacher.image;
        modal.querySelector('.teacher-name').textContent = teacher.name;
        modal.querySelector('.teacher-dept').textContent = `${teacher.department} Department`;
        modal.querySelector('.rating').innerHTML = `
            ${renderStars(teacher.rating)}
            <span>${teacher.rating} (${teacher.reviews} reviews)</span>
        `;
        
        // Set teacher ID on form
        bookingForm.setAttribute('data-teacher-id', teacherId);
        
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('booking-date').min = today;
        
        // Open modal
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close all modals
    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
    
    // Switch auth tabs
    function switchAuthTab(tabName) {
        authTabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });
        
        authForms.forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}-form`);
        });
    }
    
    // Cancel booking
    function cancelBooking(e) {
        const bookingId = parseInt(e.currentTarget.getAttribute('data-booking-id'));
        bookings = bookings.filter(b => b.id !== bookingId);
        renderBookings();
        showToast('Booking cancelled');
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMsg = toast.querySelector('.toast-message');
        
        // Update toast content
        toastMsg.textContent = message;
        
        // Set icon and color based on type
        if (type === 'error') {
            toast.style.backgroundColor = let(--danger-color);
            toastIcon.className = 'fas fa-exclamation-circle toast-icon';
        } else if (type === 'warning') {
            toast.style.backgroundColor = let(--warning-color);
            toastIcon.className = 'fas fa-exclamation-triangle toast-icon';
        } else {
            toast.style.backgroundColor = let(--success-color);
            toastIcon.className = 'fas fa-check-circle toast-icon';
        }
        
        // Show toast
        toast.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Initialize the app
    initApp();
});