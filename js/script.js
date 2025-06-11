// js/script.js

// Global variables
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let currentRating = 0;
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Navigation functionality
    setupNavigation();
    
    // Review functionality
    setupReviews();
    
    // Booking functionality
    setupBooking();
    
    // Back to top functionality
    setupBackToTop();
    
    // Load existing reviews
    displayReviews();
    
    // Smooth scrolling for navigation links
    setupSmoothScrolling();
}

// Navigation Setup
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Reviews Setup
function setupReviews() {
    const leaveReviewBtn = document.getElementById('leave-review-btn');
    const reviewModal = document.getElementById('review-modal');
    const closeBtn = reviewModal.querySelector('.close');
    const reviewForm = document.getElementById('review-form');
    const starRating = document.getElementById('star-rating');
    
    // Open review modal
    leaveReviewBtn.addEventListener('click', function() {
        reviewModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Close review modal
    closeBtn.addEventListener('click', function() {
        closeModal(reviewModal);
    });
    
    // Close modal when clicking outside
    reviewModal.addEventListener('click', function(e) {
        if (e.target === reviewModal) {
            closeModal(reviewModal);
        }
    });
    
    // Star rating functionality
    const stars = starRating.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            currentRating = index + 1;
            updateStarDisplay(stars, currentRating);
        });
        
        star.addEventListener('mouseenter', function() {
            updateStarDisplay(stars, index + 1);
        });
    });
    
    starRating.addEventListener('mouseleave', function() {
        updateStarDisplay(stars, currentRating);
    });
    
    // Review form submission
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitReview();
    });
}

function updateStarDisplay(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitReview() {
    const reviewText = document.getElementById('review-text').value;
    const reviewerName = document.getElementById('reviewer-name').value;
    
    if (currentRating === 0) {
        alert('Please select a star rating');
        return;
    }
    
    const newReview = {
        id: Date.now(),
        rating: currentRating,
        text: reviewText,
        name: reviewerName,
        date: new Date().toLocaleDateString()
    };
    
    reviews.unshift(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    displayReviews();
    closeModal(document.getElementById('review-modal'));
    
    // Reset form
    document.getElementById('review-form').reset();
    currentRating = 0;
    updateStarDisplay(document.querySelectorAll('.star'), 0);
    
    // Show success message
    showNotification('Thank you for your review!');
}

function displayReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    
    if (reviews.length === 0) {
        // Show placeholder review
        reviewsContainer.innerHTML = `
            <div class="review-card">
                <div class="stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <p>"Tell me how I did as your personal finance coach!"</p>
                <div class="reviewer">- Future Client</div>
            </div>
        `;
    } else {
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="stars">
                    ${generateStars(review.rating)}
                </div>
                <p>"${review.text}"</p>
                <div class="reviewer">- ${review.name}</div>
            </div>
        `).join('');
    }
}

function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    return starsHTML;
}

// Booking Setup
function setupBooking() {
    const bookBtn = document.getElementById('book-consultation');
    const bookingModal = document.getElementById('booking-modal');
    const closeBtn = bookingModal.querySelector('.close');
    const consultationForm = document.getElementById('consultation-form');
    
    // Open booking modal
    bookBtn.addEventListener('click', function() {
        bookingModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        generateCalendar();
    });
    
    // Close booking modal
    closeBtn.addEventListener('click', function() {
        closeModal(bookingModal);
        resetBookingForm();
    });
    
    // Close modal when clicking outside
    bookingModal.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            closeModal(bookingModal);
            resetBookingForm();
        }
    });
    
    // Calendar navigation
    document.getElementById('prev-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar();
    });
    
    // Consultation form submission
    consultationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitConsultation();
    });
}

function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
    
    // Generate calendar grid
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const dayDate = new Date(year, month, day);
        
        // Disable past dates
        if (dayDate < today.setHours(0, 0, 0, 0)) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', function() {
                selectDate(year, month, day);
            });
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function selectDate(year, month, day) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Select new date
    event.target.classList.add('selected');
    selectedDate = new Date(year, month, day);
    
    // Show time slots
    generateTimeSlots();
}

function generateTimeSlots() {
    const timeSlotsSection = document.getElementById('time-slots');
    const timeGrid = document.getElementById('time-grid');
    
    timeSlotsSection.style.display = 'block';
    timeGrid.innerHTML = '';
    
    // Generate time slots from 6 AM to 9 PM
    for (let hour = 6; hour <= 21; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        
        const time12 = hour > 12 ? `${hour - 12}:00 PM` : 
                     hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
        
        timeSlot.textContent = time12;
        timeSlot.addEventListener('click', function() {
            selectTime(hour, time12);
        });
        
        timeGrid.appendChild(timeSlot);
    }
}

function selectTime(hour, timeString) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Select new time
    event.target.classList.add('selected');
    selectedTime = { hour, string: timeString };
    
    // Show booking form
    document.getElementById('booking-form').style.display = 'block';
}

function submitConsultation() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    if (!selectedDate || !selectedTime) {
        alert('Please select a date and time');
        return;
    }
    
    const consultationData = {
        date: selectedDate.toLocaleDateString(),
        time: selectedTime.string,
        firstName,
        lastName,
        phone,
        email,
        timestamp: new Date().toISOString()
    };
    
    // In a real application, you would send this data to your server
    // For now, we'll simulate sending an email by showing the data
    console.log('Consultation booking data:', consultationData);
    
    // Create email content for the user to copy
    const emailContent = `
New Consultation Booking:

Date: ${consultationData.date}
Time: ${consultationData.time}
Name: ${firstName} ${lastName}
Phone: ${phone}
Email: ${email}
Booked on: ${new Date().toLocaleString()}
    `;
    
    // Show success message with email content
    showConsultationSuccess(emailContent);
    
    closeModal(document.getElementById('booking-modal'));
    resetBookingForm();
}

function showConsultationSuccess(emailContent) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>Consultation Booked Successfully!</h3>
            <p>Thank you for booking your free consultation. Matt will contact you soon to confirm your appointment.</p>
            
            <div style="margin-top: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 10px;">
                <h4>Booking Details:</h4>
                <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${emailContent}</pre>
            </div>
            
            <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                <strong>Note:</strong> Please copy the above information and email it to MattJEllis1@gmail.com 
                to ensure Matt receives your booking details.
            </p>
            
            <button onclick="this.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" 
                    style="margin-top: 1rem; padding: 1rem 2rem; background: var(--huntington-green); 
                           color: white; border: none; border-radius: 10px; cursor: pointer;">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.querySelector('.close').addEventListener('click', function() {
        modal.remove();
        document.body.style.overflow = 'auto';
    });
}

// Back to Top Setup
function setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
}

// Utility Functions
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function resetBookingForm() {
    selectedDate = null;
    selectedTime = null;
    
    document.getElementById('time-slots').style.display = 'none';
    document.getElementById('booking-form').style.display = 'none';
    document.getElementById('consultation-form').reset();
    
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelectorAll('.time-slot.selected').forEach(el => {
        el.classList.remove('selected');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--huntington-green);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);
