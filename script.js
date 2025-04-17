/**
 * Enhanced 3D Cube JavaScript for the Coding Club website
 * Improved with fixed hover functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation buttons and the cube
    const navButtons = document.querySelectorAll('.nav-btn');
    const cube = document.querySelector('.cube');
    const cubeFaces = document.querySelectorAll('.cube__face');
    const modal = document.getElementById('panel-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.querySelector('.close-modal');
    const scene = document.querySelector('.scene');
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    
    // Set dark mode as default theme
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.checked = true;
    localStorage.setItem('theme', 'dark');
    
    // Handle theme toggle changes
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Track last clicked button and time for double-click detection
    let lastClickedButton = null;
    let lastClickTime = 0;
    
    // Function to handle button clicks for navigation
    function handleNavClick(event) {
        const currentTime = new Date().getTime();
        const face = event.target.getAttribute('data-face');
        
        // Check if we're already on the clicked face by examining the cube's current class
        const currentFace = getCurrentActiveFace();
        if (currentFace === face) {
            // Already on this face, open the detail panel directly
            openPanelModal(face);
            return;
        }
        
        // Check for double-click (same button clicked within 500ms)
        if (lastClickedButton === event.target && (currentTime - lastClickTime) < 500) {
            // Double-click detected - open detail panel directly
            openPanelModal(face);
            return;
        }
        
        // Update tracking variables for double-click detection
        lastClickedButton = event.target;
        lastClickTime = currentTime;
        
        // Remove active class from all buttons
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        event.target.classList.add('active');
        
        // Remove all show classes from the cube
        cube.className = 'cube';
        
        // Add the appropriate show class with animation
        setTimeout(() => {
            cube.classList.add(`show-${face}`);
            
            // Focus on the button of the front-facing cube face after rotation completes
            setTimeout(() => {
                focusActiveFaceButton(face);
            }, 1000); // Wait for cube rotation animation to complete
        }, 50);
    }
    
    // Function to determine which face is currently active based on cube's class
    function getCurrentActiveFace() {
        const cubeClasses = cube.className.split(' ');
        for (const className of cubeClasses) {
            if (className.startsWith('show-')) {
                return className.replace('show-', '');
            }
        }
        return 'front'; // Default to front if no face is explicitly shown
    }
    
    // Function to open detail panel
    function openDetailPanel(face) {
        // Get panel content from the panelDetails object
        const panel = panelDetails[face];
        if (panel) {
            modalContent.innerHTML = panel.content;
            modal.style.display = 'block';
        }
    }
    
    // Add click event listeners to all navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', handleNavClick);
    });
    
    // Set the initial active state to the Home button
    const homeButton = document.querySelector('[data-face="front"]');
    if (homeButton) {
        homeButton.classList.add('active');
        cube.classList.add('show-front');
        
        // Focus on the front face button initially
        setTimeout(() => {
            focusActiveFaceButton('front');
        }, 500);
    }
    
    // Function to focus on the button of the currently visible face
    function focusActiveFaceButton(face) {
        // Find the button on the active face
        const activeFace = document.querySelector(`.cube__face--${face}`);
        if (activeFace) {
            // Make sure the face is interactive
            activeFace.style.pointerEvents = 'auto';
            activeFace.style.zIndex = '1';
            
            // Reset pointer events for all other faces
            cubeFaces.forEach(otherFace => {
                if (otherFace !== activeFace) {
                    otherFace.style.zIndex = '0';
                }
            });
            
            const button = activeFace.querySelector('.detail-btn');
            if (button) {
                // Focus the button
                button.focus();
                // Make sure the button is interactive
                button.style.pointerEvents = 'auto';
            }
        }
    }
    
    // Panel content data
    const panelDetails = {
        front: {
            title: "Home",
            content: `
                <h2>Welcome to Coding Club</h2>
                <div class="panel-detail">
                    <p>The Coding Club is a vibrant community where students of all skill levels come together to learn, collaborate, and build amazing projects.</p>
                    
                    <h3>What We Offer</h3>
                    <ul>
                        <li>Coding sessions and workshops</li>
                        <li>Mentorship from experienced developers</li>
                        <li>Collaborative project opportunities</li>
                        <li>Networking with industry professionals</li>
                        <li>Hackathons and coding competitions</li>
                    </ul>
                    
                    <h3>Join Us</h3>
                    <p>Whether you're just starting your coding journey or you're an experienced developer, there's a place for you here!</p>
                    <p>Our next meeting is on <strong>date and time</strong> with following URL:</p>
                    
                    <div class="cta-button">
                        <button onclick="window.open('https://your-signup-form-link.com', '_blank')">Sign Up Now</button>
                    </div>
                </div>
            `
        },
        right: {
            title: "Events",
            content: `
                <h2>Upcoming Events</h2>
                <div class="panel-detail">
                    <div class="event-card">
                        <h3>Web Development Workshop</h3>
                        <p class="event-date">October 15, 2023 | 3:00 PM - 5:00 PM</p>
                        <p>Learn the fundamentals of modern web development with HTML, CSS, and JavaScript. Perfect for beginners!</p>
                        <button class="event-register">Register</button>
                    </div>
                    
                    <div class="event-card">
                        <h3>Hackathon: Code for Good</h3>
                        <p class="event-date">November 5-7, 2023 | All Weekend</p>
                        <p>Join us for a weekend of coding, collaboration, and innovation as we build solutions for local non-profit organizations.</p>
                        <button class="event-register">Register</button>
                    </div>
                    
                    <div class="event-card">
                        <h3>Tech Talk: AI and Machine Learning</h3>
                        <p class="event-date">November 20, 2023 | 6:00 PM</p>
                        <p>Guest speaker from Google will discuss the latest trends in AI and machine learning.</p>
                        <button class="event-register">Register</button>
                    </div>
                </div>
            `
        },
        back: {
            title: "Projects",
            content: `
                <h2>Our Projects</h2>
                <div class="panel-detail">
                    <p>Explore some of the exciting projects our members have been working on:</p>
                    
                    <div class="project-grid">
                        <div class="project-card">
                            <h3>Campus Navigator App</h3>
                            <p>A mobile application to help students navigate the campus, find classrooms, and discover resources.</p>
                            <p><strong>Technologies:</strong> React Native, Firebase, Google Maps API</p>
                            <button class="project-view">View Project</button>
                        </div>
                        
                        <div class="project-card">
                            <h3>Study Group Finder</h3>
                            <p>Web platform that connects students for collaborative study sessions based on courses and schedules.</p>
                            <p><strong>Technologies:</strong> MERN Stack (MongoDB, Express, React, Node.js)</p>
                            <button class="project-view">View Project</button>
                        </div>
                        
                        <div class="project-card">
                            <h3>Sustainable Campus Initiative</h3>
                            <p>IoT system for monitoring and reducing energy consumption in campus buildings.</p>
                            <p><strong>Technologies:</strong> Arduino, Raspberry Pi, Python, MQTT</p>
                            <button class="project-view">View Project</button>
                        </div>
                    </div>
                </div>
            `
        },
        left: {
            title: "About Us",
            content: `
                <h2>About Coding Club</h2>
                <div class="panel-detail">
                    <h3>Our Mission</h3>
                    <p>The Coding Club is dedicated to fostering a collaborative learning environment where students can develop their programming skills, work on meaningful projects, and prepare for careers in technology.</p>
                    
                    <h3>Our History</h3>
                    <p>Founded in 2018 by a group of passionate computer science students, the Coding Club has grown from a small study group to a thriving community with over 150 active members.</p>
                    
                    <h3>Meet the Team</h3>
                    <div class="team-grid">
                        <div class="team-member">
                            <h4>Pushkar Kumar Vats</h4>
                            <p>General Secretary</p>
                            <p><a href="mailto:v.pushkar@op.iitg.ac.in">v.pushkar@op.iitg.ac.in</a></p>
                        </div>
                        
                        <div class="team-member">
                            <h4>Sumit Rana</h4>
                            <p>Coordinator</p>
                            <p><a href="mailto:sumit.rana@op.iitg.ac.in">sumit.rana@op.iitg.ac.in</a></p>
                        </div>
                        
                        <div class="team-member">
                            <h4>Devarpana Tribedi</h4>
                            <p>Coordinator</p>
                            <p><a href="mailto:t.devarpana@op.iitg.ac.in">t.devarpana@op.iitg.ac.in</a></p>
                        </div>

                        <div class="team-member">
                            <h4>Anish Raj</h4>
                            <p>Coordinator</p>
                            <p><a href="mailto:r.anish@op.iitg.ac.in">r.anish@op.iitg.ac.in</a></p>
                        </div>                        
                    </div>
                </div>
            `
        },
        top: {
            title: "Resources",
            content: `
                <h2>Learning Resources</h2>
                <div class="panel-detail">
                    <h3>Recommended Courses</h3>
                    <ul class="resource-list">
                        <li>
                            <h4>Web Development Fundamentals</h4>
                            <p>Learn HTML, CSS, and JavaScript from scratch</p>
                            <a href="https://www.theodinproject.com/paths/foundations" class="resource-link" target="_blank">Access Course</a>
                        </li>
                        <li>
                            <h4>Python Programming</h4>
                            <p>Master Python for data science, automation, and web development</p>
                            <a href="https://www.learnpython.org/" class="resource-link" target="_blank">Access Course</a>
                        </li>
                        <li>
                            <h4>SQL for Beginners</h4>
                            <p>Learn how to query databases and understand data using SQL</p>
                            <a href="https://sqlbolt.com/" class="resource-link" target="_blank">Access Course</a>
                        </li>
                    </ul>
                </div>
            `
        },
        bottom: {
            title: "Contact Us",
            content: `
                <h2>Get in Touch</h2>
                <div class="panel-detail">
                    <div class="contact-info">
                        <h3>Contact Information</h3>
                        <p><strong>Email:</strong> codingclub@university.edu</p>
                        <p><strong>Location:</strong> Computer Science Building, Room 302</p>
                        <p><strong>Meeting Times:</strong> Fridays, 5:00 PM - 7:00 PM</p>
                    </div>
                    <form action="https://formsubmit.co/youremail@email.com" method="POST">
                        <div class="form-group">
                            <div class="contact-form">
                                <h3>Send Us a Message</h3>
                                <form id="contact-form">
                                    <div class="form-group">
                                        <label for="name">Name</label>
                                        <input type="text" id="name" name="name" required>
                                    </div>
                            
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input type="email" id="email" name="email" required>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="message">Message</label>
                                        <textarea id="message" name="message" rows="5" required></textarea>
                                    </div>
                                    
                                    <button type="submit" class="submit-btn">Send Message</button>
                                </form>
                            </div>
                    </div>
                </div>
            `
        }
    };
    
    // Function to open modal with panel details
    function openPanelModal(face) {
        // Set modal content based on the face
        const panelData = panelDetails[face];
        if (panelData) {
            modalContent.innerHTML = panelData.content;
            document.querySelector('.modal-content').setAttribute('data-panel', face);
            
            // Show modal with animation
            modal.classList.add('show');
            
            // Add event listeners for any buttons in the modal content
            setupModalInteractions();
        } else {
            console.log('No panel data found for face:', face);
        }
    }
    
    // Function to close modal
    function closePanelModal() {
        modal.classList.remove('show');
    }
    
    // Setup interactions within the modal
    function setupModalInteractions() {
        // Example: Handle form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you soon.');
                closePanelModal();
            });
        }
        
        // Example: Handle registration buttons
        const registerButtons = document.querySelectorAll('.event-register');
        registerButtons.forEach(button => {
            button.addEventListener('click', function() {
                alert('Registration successful! Check your email for details.');
            });
        });
        
        // Add more interactions as needed
    }
    
    // Function to handle detail button clicks
    function handleDetailButtonClick(event) {
        // Get the face type from the button's data attribute
        const faceType = event.target.getAttribute('data-face');
        
        // Open modal with the face details
        openPanelModal(faceType);
        
        // Prevent the event from bubbling up to the cube face
        event.stopPropagation();
    }
    
    // Add click event listeners to all detail buttons
    document.querySelectorAll('.detail-btn').forEach(button => {
        button.addEventListener('click', handleDetailButtonClick);
    });
    
    // Remove click handlers from cube faces since we now use buttons
    cubeFaces.forEach(face => {
        // Remove pointer cursor from content elements
        const faceContent = face.querySelector('.content');
        if (faceContent) {
            faceContent.style.cursor = 'default';
            
            // Reset cursor on titles
            const faceTitle = faceContent.querySelector('h2');
            if (faceTitle) {
                faceTitle.style.cursor = 'default';
            }
            
            // Reset cursor on paragraphs
            const faceParagraphs = faceContent.querySelectorAll('p');
            faceParagraphs.forEach(p => {
                p.style.cursor = 'default';
            });
        }
    });

    
    // Close modal when clicking the close button
    closeModal.addEventListener('click', closePanelModal);
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePanelModal();
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        let currentFace = '';
        
        // Find which face is currently shown
        for (let className of cube.classList) {
            if (className.startsWith('show-')) {
                currentFace = className.replace('show-', '');
                break;
            }
        }
        
        let newFace = '';
        
        // Handle arrow keys
        switch(event.key) {
            case 'ArrowRight':
                if (currentFace === 'front') newFace = 'right';
                else if (currentFace === 'right') newFace = 'back';
                else if (currentFace === 'back') newFace = 'left';
                else if (currentFace === 'left') newFace = 'front';
                break;
            case 'ArrowLeft':
                if (currentFace === 'front') newFace = 'left';
                else if (currentFace === 'left') newFace = 'back';
                else if (currentFace === 'back') newFace = 'right';
                else if (currentFace === 'right') newFace = 'front';
                break;
            case 'ArrowUp':
                if (currentFace !== 'top') newFace = 'top';
                break;
            case 'ArrowDown':
                if (currentFace !== 'bottom') newFace = 'bottom';
                break;
            case 'Escape':
                closePanelModal();
                break;
        }
        
        if (newFace) {
            // Find and click the corresponding navigation button
            const navButton = document.querySelector(`[data-face="${newFace}"]`);
            if (navButton) navButton.click();
        }
    });
    
    // Variables for touch handling
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isDragging = false;
    let lastRotateX = 0;
    let lastRotateY = 0;
    
    // Touch event handlers for mobile devices
    scene.addEventListener('touchstart', function(e) {
        // Prevent default only if we're not touching an interactive element
        if (!e.target.closest('button') && !e.target.closest('a') && !e.target.closest('input') && !e.target.closest('h2')) {
            e.preventDefault();
        }
        
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isDragging = true;
        
        // Store current rotation
        const transform = getComputedStyle(cube).transform;
        if (transform !== 'none') {
            // Extract rotation values if needed
            // This is simplified - in a real app you might need matrix decomposition
            lastRotateX = 0;
            lastRotateY = 0;
        }
    }, { passive: false });
    
    scene.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        // Prevent default scrolling behavior
        e.preventDefault();
        
        const touch = e.touches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
        
        // Calculate the difference
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Only apply manual rotation if we're not showing a specific face
        if (!modal.classList.contains('show') && diffX * diffX + diffY * diffY > 100) {
            // Convert touch movement to rotation
            const rotateY = lastRotateY - diffX * 0.5;
            const rotateX = lastRotateX + diffY * 0.5;
            
            // Apply rotation (limited range to prevent excessive spinning)
            cube.style.transform = `translateZ(-300px) rotateX(${Math.min(30, Math.max(-30, rotateX))}deg) rotateY(${rotateY}deg)`;
        }
    }, { passive: false });
    
    scene.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        isDragging = false;
        
        // Calculate the difference for swipe detection
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Minimum distance for a swipe
        const minSwipeDistance = 50;
        
        // Find current face
        let currentFace = 'front';
        for (let className of cube.classList) {
            if (className.startsWith('show-')) {
                currentFace = className.replace('show-', '');
                break;
            }
        }
        
        // Detect swipe direction and change face
        let newFace = '';
        
        // Horizontal swipe (stronger than vertical)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            // Right swipe
            if (diffX > 0) {
                if (currentFace === 'front') newFace = 'left';
                else if (currentFace === 'left') newFace = 'back';
                else if (currentFace === 'back') newFace = 'right';
                else if (currentFace === 'right') newFace = 'front';
            }
            // Left swipe
            else {
                if (currentFace === 'front') newFace = 'right';
                else if (currentFace === 'right') newFace = 'back';
                else if (currentFace === 'back') newFace = 'left';
                else if (currentFace === 'left') newFace = 'front';
            }
        }
        // Vertical swipe
        else if (Math.abs(diffY) > minSwipeDistance) {
            // Down swipe
            if (diffY > 0) {
                if (currentFace !== 'bottom') newFace = 'bottom';
            }
            // Up swipe
            else {
                if (currentFace !== 'top') newFace = 'top';
            }
        }
        
        if (newFace) {
            // Reset any manual transform
            cube.style.transform = '';
            
            // Find and click the corresponding navigation button
            const navButton = document.querySelector(`[data-face="${newFace}"]`);
            if (navButton) navButton.click();
        } else {
            // If no swipe detected, reset to current face
            cube.style.transform = '';
            cube.className = 'cube';
            cube.classList.add(`show-${currentFace}`);
        }
    });
    
    // Add 3D effect on mouse move (only for non-touch devices) - FIXED VERSION
    if (window.matchMedia('(hover: hover)').matches) {
        scene.addEventListener('mousemove', function(e) {
            // Only apply effect if no modal is shown
            if (!modal.classList.contains('show')) {
                const rect = scene.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // Calculate rotation based on mouse position relative to center
                const xRotation = (e.clientY - centerY) / 40;
                const yRotation = (centerX - e.clientX) / 40;
                
                // Find current face
                let currentFace = 'front';
                for (let className of cube.classList) {
                    if (className.startsWith('show-')) {
                        currentFace = className.replace('show-', '');
                        break;
                    }
                }
                
                // Apply subtle rotation based on mouse position while preserving the current face
                // This is the key fix - we maintain the current face's rotation and just add a small tilt
                switch(currentFace) {
                    case 'front':
                        cube.style.transform = `translateZ(-300px) rotateY(${Math.min(10, Math.max(-10, yRotation))}deg) rotateX(${Math.min(10, Math.max(-10, xRotation))}deg)`;
                        break;
                    case 'right':
                        cube.style.transform = `translateZ(-300px) rotateY(${-90 + Math.min(10, Math.max(-10, yRotation))}deg) rotateX(${Math.min(10, Math.max(-10, xRotation))}deg)`;
                        break;
                    case 'back':
                        cube.style.transform = `translateZ(-300px) rotateY(${-180 + Math.min(10, Math.max(-10, yRotation))}deg) rotateX(${Math.min(10, Math.max(-10, xRotation))}deg)`;
                        break;
                    case 'left':
                        cube.style.transform = `translateZ(-300px) rotateY(${90 + Math.min(10, Math.max(-10, yRotation))}deg) rotateX(${Math.min(10, Math.max(-10, xRotation))}deg)`;
                        break;
                    case 'top':
                        cube.style.transform = `translateZ(-300px) rotateX(${-90 + Math.min(10, Math.max(-10, xRotation))}deg) rotateY(${Math.min(10, Math.max(-10, yRotation))}deg)`;
                        break;
                    case 'bottom':
                        cube.style.transform = `translateZ(-300px) rotateX(${90 + Math.min(10, Math.max(-10, xRotation))}deg) rotateY(${Math.min(10, Math.max(-10, yRotation))}deg)`;
                        break;
                }
            }
        });
        
        // Reset cube position when mouse leaves
        scene.addEventListener('mouseleave', function() {
            // Find current face class
            let currentFace = 'front';
            for (let className of cube.classList) {
                if (className.startsWith('show-')) {
                    currentFace = className.replace('show-', '');
                    break;
                }
            }
            
            // Reset to the current face without the mouse-based rotation
            cube.style.transform = '';
            cube.className = 'cube';
            cube.classList.add(`show-${currentFace}`);
        });
    }
    
    // Handle window resize to adjust cube dimensions
    window.addEventListener('resize', function() {
        // Reset any manual transform
        cube.style.transform = '';
        
        // Find current face
        let currentFace = 'front';
        for (let className of cube.classList) {
            if (className.startsWith('show-')) {
                currentFace = className.replace('show-', '');
                break;
            }
        }
        
        // Reapply the current face class
        cube.className = 'cube';
        cube.classList.add(`show-${currentFace}`);
    });
});