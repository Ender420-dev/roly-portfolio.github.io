
// Ensure all functions are properly defined
(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener("DOMContentLoaded", function() {
        document.addEventListener('click', function(e) {
            const dismissButton = e.target.closest('[data-bs-dismiss="modal"]');
            if (!dismissButton) {
                return;
            }

            const modalElement = dismissButton.closest('.modal');
            if (!modalElement || typeof bootstrap === 'undefined' || !bootstrap.Modal) {
                return;
            }

            const modalInstance = bootstrap.Modal.getInstance(modalElement) || bootstrap.Modal.getOrCreateInstance(modalElement);
            modalInstance.hide();
        });

        if (typeof bootstrap !== 'undefined') {
            var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
            dropdownElementList
                .filter(function(dropdownToggleEl) {
                    return !dropdownToggleEl.closest('.user-box');
                })
                .forEach(function(dropdownToggleEl) {
                    new bootstrap.Dropdown(dropdownToggleEl);
                });
        }

        const userMenuButtons = document.querySelectorAll('.user-box .dropdown-toggle');

        function updateUserMenuChevron(button, isOpen) {
            const chevron = button.querySelector('.bi-chevron-up, .bi-chevron-down');
            if (!chevron) {
                return;
            }

            chevron.classList.toggle('bi-chevron-up', !isOpen);
            chevron.classList.toggle('bi-chevron-down', isOpen);
        }

        function closeUserMenu(button, menu) {
            menu.classList.remove('show');
            button.setAttribute('aria-expanded', 'false');
            updateUserMenuChevron(button, false);
        }

        userMenuButtons.forEach(function(button) {
            const menu = button.parentElement.querySelector('.dropdown-menu');
            if (!menu) {
                return;
            }

            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const shouldOpen = !menu.classList.contains('show');

                document.querySelectorAll('.user-box .dropdown-toggle').forEach(function(otherButton) {
                    const otherMenu = otherButton.parentElement.querySelector('.dropdown-menu');
                    if (!otherMenu || otherButton === button) {
                        return;
                    }

                    closeUserMenu(otherButton, otherMenu);
                });

                if (shouldOpen) {
                    menu.classList.add('show');
                    button.setAttribute('aria-expanded', 'true');
                } else {
                    menu.classList.remove('show');
                    button.setAttribute('aria-expanded', 'false');
                }

                updateUserMenuChevron(button, shouldOpen);
            });

            menu.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });

        document.addEventListener('click', function(e) {
            userMenuButtons.forEach(function(button) {
                const menu = button.parentElement.querySelector('.dropdown-menu');
                if (!menu) {
                    return;
                }

                if (!button.contains(e.target) && !menu.contains(e.target)) {
                    closeUserMenu(button, menu);
                }
            });
        });
        // ============= REAL-TIME CLOCK FOR PHILIPPINE TIME =============
        function updatePhilippineTime() {
            const timeElements = document.querySelectorAll('.time-display, .breadcrumb-time, [data-ph-time]');
            
            if (timeElements.length > 0) {
                // Create a new date object for Philippine Time
                const options = {
                    timeZone: 'Asia/Manila',
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                };
                
                const phTime = new Date().toLocaleString('en-US', options);
                
                // Add ordinal suffix
                const day = new Date().getDate();
                const ordinal = getOrdinalSuffix(day);
                
                // Format with ordinal
                const phTimeWithOrdinal = phTime.replace(
                    new RegExp(day.toString()), 
                    day + ordinal
                ) + ' PHT';
                
                // Update all time displays
                timeElements.forEach(el => {
                    el.textContent = phTimeWithOrdinal;
                });
            }
        }

        function getOrdinalSuffix(day) {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        }

        // Update time immediately and then every minute
        updatePhilippineTime();
        setInterval(updatePhilippineTime, 60000);

        // ============= LOADER FUNCTIONALITY =============
        const loader = document.getElementById("loader");

        if (loader) {
            window.addEventListener("load", function() {
                setTimeout(function() {
                    loader.classList.add("fade-out");
                    setTimeout(function() {
                        loader.style.display = "none";
                    }, 300);
                }, 300);
            });

            // Handle PHP link clicks with loader
            document.querySelectorAll("a[href$='.php']").forEach(function(link) {
                link.addEventListener("click", function(e) {
                    const href = link.getAttribute("href");
                    if (href && href !== "#" && !href.startsWith("javascript:")) {
                        e.preventDefault();
                        loader.style.display = "flex";
                        loader.classList.remove("fade-out");
                        setTimeout(function() {
                            window.location.href = href;
                        }, 400);
                    }
                });
            });
        }

        // ============= SIDEBAR FUNCTIONALITY =============
        const sidebar = document.getElementById("sidebar");
        const toggleBtn = document.getElementById("toggleSidebarBtn");
        const closeBtn = document.getElementById("closeSidebarBtn");
        const mainContent = document.querySelector(".main-content");

        // Create overlay if it doesn't exist
        let overlay = document.getElementById("sidebarOverlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "sidebarOverlay";
            overlay.className = "sidebar-overlay";
            document.body.appendChild(overlay);
        }

        if (sidebar && mainContent) {
            function isMobile() {
                return window.innerWidth <= 768;
            }

            // Desktop state from localStorage
            let sidebarVisible = localStorage.getItem("sidebarVisible") !== "false";

            function applyDesktopState() {
                if (!isMobile()) {
                    if (sidebarVisible) {
                        sidebar.classList.remove("hidden");
                        mainContent.style.marginLeft = "260px";
                        mainContent.classList.remove("sidebar-hidden");
                        
                        // Update fixed elements when sidebar is visible
                        document.querySelectorAll('.fixed-breadcrumbs, .navbar').forEach(function(el) {
                            if (el) el.style.left = "260px";
                        });
                    } else {
                        sidebar.classList.add("hidden");
                        mainContent.style.marginLeft = "0";
                        mainContent.classList.add("sidebar-hidden");
                        
                        // Update fixed elements when sidebar is hidden
                        document.querySelectorAll('.fixed-breadcrumbs, .navbar').forEach(function(el) {
                            if (el) el.style.left = "0";
                        });
                    }
                }
            }

            // Mobile sidebar functions
            window.openMobileSidebar = function() {
                sidebar.classList.add("show");
                overlay.classList.add("active");
                document.body.style.overflow = "hidden";
            };

            window.closeMobileSidebar = function() {
                sidebar.classList.remove("show");
                overlay.classList.remove("active");
                document.body.style.overflow = "";
            };

            // Initial state
            applyDesktopState();

            // Desktop toggle button click
            if (toggleBtn) {
                toggleBtn.addEventListener("click", function() {
                    if (isMobile()) {
                        // Mobile toggle
                        if (sidebar.classList.contains("show")) {
                            window.closeMobileSidebar();
                        } else {
                            window.openMobileSidebar();
                        }
                    } else {
                        // Desktop toggle
                        sidebarVisible = !sidebarVisible;
                        localStorage.setItem("sidebarVisible", sidebarVisible);

                        if (sidebarVisible) {
                            sidebar.classList.remove("hidden");
                            mainContent.style.marginLeft = "260px";
                            mainContent.classList.remove("sidebar-hidden");
                            
                            // Update fixed elements
                            document.querySelectorAll('.fixed-breadcrumbs, .navbar').forEach(function(el) {
                                if (el) el.style.left = "260px";
                            });
                        } else {
                            sidebar.classList.add("hidden");
                            mainContent.style.marginLeft = "0";
                            mainContent.classList.add("sidebar-hidden");
                            
                            // Update fixed elements
                            document.querySelectorAll('.fixed-breadcrumbs, .navbar').forEach(function(el) {
                                if (el) el.style.left = "0";
                            });
                        }
                    }
                });
            }

            // Close button for mobile
            if (closeBtn) {
                closeBtn.addEventListener("click", function() {
                    window.closeMobileSidebar();
                });
            }

            // Overlay click for mobile
            overlay.addEventListener("click", function() {
                if (isMobile()) {
                    window.closeMobileSidebar();
                }
            });

            // Handle escape key
            document.addEventListener("keydown", function(e) {
                if (
                    e.key === "Escape" &&
                    isMobile() &&
                    sidebar.classList.contains("show")
                ) {
                    window.closeMobileSidebar();
                }
            });

            // Handle resize
            let resizeTimer;
            window.addEventListener("resize", function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    if (!isMobile()) {
                        // Switching to desktop
                        window.closeMobileSidebar();
                        applyDesktopState();
                        document.body.style.overflow = "";
                    } else {
                        // Switching to mobile
                        sidebar.classList.remove("hidden");
                        mainContent.classList.remove("sidebar-hidden");
                        mainContent.style.marginLeft = "0";
                        
                        // Reset fixed elements for mobile
                        document.querySelectorAll('.fixed-breadcrumbs, .navbar').forEach(function(el) {
                            if (el) el.style.left = "0";
                        });
                        
                        window.closeMobileSidebar();
                    }
                }, 250);
            });

            // Close sidebar when clicking on a nav link (mobile only)
            document.querySelectorAll(".nav-link").forEach(function(link) {
                link.addEventListener("click", function() {
                    if (isMobile()) {
                        window.closeMobileSidebar();
                    }
                });
            });
        }

        // ============= ACTIVE NAV LINK =============
        // Add active class to current page nav link
        const currentPage = window.location.pathname.split("/").pop();
        document.querySelectorAll(".nav-link").forEach(function(link) {
            const href = link.getAttribute("href");
            if (href && href.includes(currentPage)) {
                link.classList.add("active");
            }
        });

        // Highlight active page in dropdown menus
        function setActiveDropdownItems() {
            const currentPage = window.location.pathname.split("/").pop();
            const dropdownItems = document.querySelectorAll(
                "#navDropdown .dropdown-item, #mobileNavDropdown .dropdown-item",
            );

            dropdownItems.forEach(function(item) {
                const href = item.getAttribute("href");
                if (href && href.includes(currentPage)) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });
        }

        setActiveDropdownItems();

        // ============= BREADCRUMB POSITIONING =============
        function adjustBreadcrumbPosition() {
            const navbar = document.querySelector('.navbar');
            const breadcrumbs = document.querySelector('.fixed-breadcrumbs');
            
            if (navbar && breadcrumbs) {
                const navbarHeight = navbar.offsetHeight;
                breadcrumbs.style.top = navbarHeight + 'px';
            }
        }

        // Adjust on load and resize
        adjustBreadcrumbPosition();
        window.addEventListener('resize', adjustBreadcrumbPosition);
    });

    // ============= SWIPE FUNCTIONALITY =============
    // This is completely separate and more robust

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;

    // Add touchstart listener
    document.addEventListener(
        "touchstart",
        function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = true;
        },
        { passive: true },
    );

    // Add touchmove listener to detect horizontal vs vertical scrolling
    document.addEventListener(
        "touchmove",
        function(e) {
            if (!isSwiping) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;

            const diffX = Math.abs(currentX - touchStartX);
            const diffY = Math.abs(currentY - touchStartY);

            // If horizontal movement is greater than vertical, prevent default to avoid page scroll
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
            }
        },
        { passive: false },
    );

    // Add touchend listener
    document.addEventListener(
        "touchend",
        function(e) {
            if (!isSwiping) return;

            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;

            handleSwipeGesture();
            isSwiping = false;
        },
        { passive: true },
    );

    // Handle the swipe gesture
    function handleSwipeGesture() {
        const sidebar = document.getElementById("sidebar");
        if (!sidebar) return;

        const swipeThreshold = 50; // Minimum distance for swipe
        const edgeZone = 30; // Swipe from left edge within 30px

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Only proceed if horizontal movement is greater than vertical
        if (Math.abs(deltaX) < Math.abs(deltaY)) return;

        // Check if on mobile
        if (window.innerWidth > 768) return;

        // SWIPE RIGHT TO OPEN - must start from left edge
        if (deltaX > swipeThreshold && touchStartX < edgeZone) {
            if (!sidebar.classList.contains("show")) {
                if (window.openMobileSidebar) {
                    window.openMobileSidebar();
                } else {
                    // Fallback if function not available
                    sidebar.classList.add("show");
                    const overlay = document.getElementById("sidebarOverlay");
                    if (overlay) overlay.classList.add("active");
                    document.body.style.overflow = "hidden";
                }
            }
        }

        // SWIPE LEFT TO CLOSE - can happen anywhere
        if (deltaX < -swipeThreshold && sidebar.classList.contains("show")) {
            if (window.closeMobileSidebar) {
                window.closeMobileSidebar();
            } else {
                // Fallback if function not available
                sidebar.classList.remove("show");
                const overlay = document.getElementById("sidebarOverlay");
                if (overlay) overlay.classList.remove("active");
                document.body.style.overflow = "";
            }
        }
    }
    // Also add click/tap outside to close (as fallback)
    document.addEventListener("click", function(e) {
        const sidebar = document.getElementById("sidebar");
        const toggleBtn = document.getElementById("toggleSidebarBtn");
        const closeBtn = document.getElementById("closeSidebarBtn");

        if (!sidebar) return;
        if (window.innerWidth > 768) return;

        // If sidebar is open and click is outside sidebar and not on toggle/close buttons
        if (sidebar.classList.contains("show")) {
            if (
                !sidebar.contains(e.target) &&
                (!toggleBtn || !toggleBtn.contains(e.target)) &&
                (!closeBtn || !closeBtn.contains(e.target))
            ) {
                if (window.closeMobileSidebar) {
                    window.closeMobileSidebar();
                }
            }
        }
    });
    // Add this to your main JavaScript file or in a script tag
function startHeartbeat() {
    // Send heartbeat every 2 minutes to keep status online
    setInterval(function() {
        fetch('../../heartbeat.php', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Heartbeat sent at', new Date().toLocaleTimeString());
            }
        })
        .catch(error => {
            console.error('Heartbeat error:', error);
        });
    }, 120000); // 2 minutes
}

// Start heartbeat when page loads
document.addEventListener('DOMContentLoaded', function() {
    startHeartbeat();
});

// Update status before page unload
window.addEventListener('beforeunload', function() {
    // Use sendBeacon to ensure the request is sent even when page is closing
    navigator.sendBeacon('../../heartbeat.php?offline=1');
});

})();
