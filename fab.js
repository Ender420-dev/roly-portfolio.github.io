(function() {
    // ----- DOM elements -----
    const mainFab = document.getElementById('radialMainFab');
    const circularMenu = document.getElementById('circularMenu');
    const actionButtons = document.querySelectorAll('.circular-action');
    
    let isOpen = false;
    let tooltipInstances = [];
    let currentRadius = 110;   // radius in pixels (distance from center)
    
    // Function to calculate and apply circular positions based on radius & center offset
    // The circular-menu container is positioned absolutely relative to the main FAB's bottom-right corner.
    // We want the center of the circle to match the center of the main FAB button.
    // Main FAB dimensions: width 68px (or 56px on mobile). We'll compute dynamically.
    function positionCircularButtons() {
      // get main FAB dimensions and center point relative to .circular-menu container
      const fabRect = mainFab.getBoundingClientRect();
      const containerRect = circularMenu.getBoundingClientRect();
      
      // The .circular-menu is positioned absolute with bottom: 34px; right: 34px relative to fab container.
      // But to make it perfectly center, we need to compute offset from the container's top-left.
      // Better: Use CSS transforms relative to the menu container. Let's set left/top origin as the center of main FAB.
      // The .circular-menu has no explicit width/height, but its children are absolutely positioned.
      // We'll set the transform origin for each child. Simpler: compute left/top offsets based on radius and angle.
      
      // Get center of main FAB relative to the .circular-menu's parent? Actually we set .circular-menu position absolute,
      // and we want the center of the circle to be at (mainFabWidth/2, mainFabHeight/2) relative to .circular-menu's top-left.
      // Since .circular-menu is positioned exactly at the same start point as main FAB's top-left? No: mainFab is inside .fab-radial-container.
      // The .circular-menu is also inside .fab-radial-container, positioned absolute with bottom:34px; right:34px.
      // To get exact center match, we need to set left/top of .circular-menu to match main FAB's center.
      
      // Approach: dynamically compute radius and set left/top for each action button using CSS left/top relative to .circular-menu.
      // But since .circular-menu has no explicit dimensions, we can just compute positions relative to main FAB center via JS.
      
      // Obtain main FAB center coordinates relative to viewport, but we need relative to .circular-menu container.
      // Better: Get bounding rect of mainFab and circular-menu.
      const menuRect = circularMenu.getBoundingClientRect();
      const centerX = fabRect.left + fabRect.width / 2 - menuRect.left;
      const centerY = fabRect.top + fabRect.height / 2 - menuRect.top;
      
      // Number of buttons = 5
      const count = actionButtons.length;
      // Angles: start from -90deg (top) to 180deg? We want nice circular arc: from 135deg to 225deg? Actually we want a semi-circle or full circle?
      // To look like a circular spread around the main FAB: better to use angles between 150° to 210° (bottom right quadrant) but since menu is bottom-right,
      // we want buttons to pop out upwards and leftwards, so a half circle from -130deg to -50deg or symmetrical around -90deg? Let's choose angles from -135deg to -45deg (upward-left arc).
      // For best aesthetics, buttons should form a nice circular arc around the top-left side of the main FAB. Since main FAB is at bottom right, the arc should go up and left.
      // Angles: -135° (top-left) to -45° (top-right relative). But we want 5 equally spaced points in a 90° arc? Actually full 180° arc gives a beautiful fan.
      // Use 180° arc from -135° to 45°? Let's do from -150° to -30° (120° arc) or 140° arc for nicer spacing.
      // I'll use 150° arc from -135° to -15° (sweep = 120°). Actually use 130° sweep: startAngle = -140°, endAngle = -10°.
      const startAngle = -180 * Math.PI / 180;
      const endAngle = -90 * Math.PI / 180;
      const totalSweep = endAngle - startAngle;
      
      // Responsive radius: based on screen width (min 85px, max 125px)
      let radius = currentRadius;
      if (window.innerWidth <= 576) radius = 120;
      else if (window.innerWidth <= 768) radius = 120;
      else radius = 140;
      
      // Apply positions
      for (let i = 0; i < count; i++) {
        const t = (totalSweep === 0) ? 0 : i / (count - 1);
        const angle = startAngle + t * totalSweep;
        const xOffset = Math.cos(angle) * radius;
        const yOffset = Math.sin(angle) * radius;
        const leftPos = centerX + xOffset - (actionButtons[i].offsetWidth / 2);
        const topPos = centerY + yOffset - (actionButtons[i].offsetHeight / 2);
        
        actionButtons[i].style.position = 'absolute';
        actionButtons[i].style.left = `${leftPos}px`;
        actionButtons[i].style.top = `${topPos}px`;
        actionButtons[i].style.right = 'auto';
        actionButtons[i].style.bottom = 'auto';
      }
    }
    
    // Initialize / refresh tooltips
    function initTooltips() {
      if (tooltipInstances.length) {
        tooltipInstances.forEach(t => { if (t && t.dispose) t.dispose(); });
        tooltipInstances = [];
      }
      actionButtons.forEach(btn => {
        const tooltip = new bootstrap.Tooltip(btn, {
          placement: 'left',
          trigger: 'hover focus',
          delay: { show: 100, hide: 50 },
          boundary: 'window'
        });
        tooltipInstances.push(tooltip);
      });
    }
    
    // Update positions on window resize or orientation change
    let resizeTimer;
    function handleResize() {
      if (isOpen) {
        // recalc positions while menu is open
        positionCircularButtons();
      }
      // also update tooltips positions
      if (tooltipInstances.length) {
        tooltipInstances.forEach(t => { if (t && t.update) t.update(); });
      }
    }
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    });
    
    // Open menu: shows circular positioned buttons with animation
    function openMenu() {
      if (isOpen) return;
      isOpen = true;
      circularMenu.classList.add('active');
      mainFab.classList.add('open');
      mainFab.setAttribute('aria-expanded', 'true');
      // Force position calculation before making visible (so positions are correct)
      positionCircularButtons();
      // small delay to ensure positions applied and CSS transitions run smoothly
    }
    
    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;
      circularMenu.classList.remove('active');
      mainFab.classList.remove('open');
      mainFab.setAttribute('aria-expanded', 'false');
      // hide any active tooltips to avoid leftovers
      if (tooltipInstances.length) {
        tooltipInstances.forEach(t => { if (t && t.hide) t.hide(); });
      }
    }
    
    function toggleMenu() {
      if (isOpen) closeMenu();
      else openMenu();
    }
    
    // Click main FAB to toggle
    mainFab.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });
    
    // Click outside to close menu
    function handleOutsideClick(e) {
      const container = document.querySelector('.fab-radial-container');
      if (isOpen && container && !container.contains(e.target)) {
        closeMenu();
      }
    }
    document.addEventListener('click', handleOutsideClick);
    
    // Escape key closes menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });
    
    // Action button handlers (demo feedback)
    const actionMessages = {
      share: '📤 Share action triggered!',
      edit: '✏️ Edit mode activated.',
      favorite: '❤️ Added to favorites!',
      notify: '🔔 Notification panel opened.',
      settings: '⚙️ Settings menu opened.'
    };
    
    function showFloatingMessage(msg) {
      const toastDiv = document.createElement('div');
      toastDiv.className = 'position-fixed top-0 start-50 translate-middle-x mt-3 p-2 z-3';
      toastDiv.style.zIndex = '9999';
      toastDiv.style.pointerEvents = 'none';
      toastDiv.innerHTML = `
        <div class="d-flex align-items-center gap-2 bg-dark text-white px-4 py-2 rounded-pill shadow-lg" style="background: #1e2a3ae6; backdrop-filter: blur(8px); font-weight: 500;">
          <i class="bi bi-check-circle-fill text-success"></i>
          <span>${escapeHtml(msg)}</span>
        </div>
      `;
      document.body.appendChild(toastDiv);
      setTimeout(() => {
        toastDiv.style.transition = 'opacity 0.2s';
        toastDiv.style.opacity = '0';
        setTimeout(() => toastDiv.remove(), 200);
      }, 1500);
    }
    
    function escapeHtml(str) {
      return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
    }
    
    actionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Get the target href from the button
        const targetId = btn.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
          // Smooth scroll to target
          target.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Close the menu after clicking
        closeMenu();
        
        // Optional: show feedback message
        const action = btn.getAttribute('data-action');
        console.log(`Circular FAB clicked: ${action} -> scrolling to ${targetId}`);
      });
    });
    
    // Initial tooltips setup
    initTooltips();
    
    // After fonts and layout are fully loaded, ensure positions if menu was open (not open initially)
    // but we also listen for any dynamic changes.
    // Additionally, detect orientation changes:
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (isOpen) positionCircularButtons();
      }, 30);
    });
    
    // On window load, make sure that if any unexpected style issues, but menu is closed by default.
    // Also adjust for initial radius setting (just set)
    // For smoothness, ensure that each circular button has its initial transform origin.
    // Add a mutation observer? Not needed.
    
    // A small tweak: force a repaint on first open to guarantee positions.
    // Also ensure that when menu is opened first time, the positions are perfectly centered.
    // We'll call positionCircularButtons inside openMenu after adding class? Already called.
    // Also recalc after any transition end? Not required.
    
    // Support for dynamic tooltip reposition when menu opens and hover.
    // Also due to absolute positioning, tooltips might overlap but placement left works well.
    
    // For mobile devices, touch tooltips appear on long press, okay.
    
    // Add custom style to ensure circular-menu container has no overflow clipping.
    circularMenu.style.overflow = 'visible';
    
    // Final check: If the user clicks on mainFab while menu open, it toggles close.
    // All good.
    
    // Also when window resizes while menu open, reposition buttons perfectly.
    window.addEventListener('resize', () => {
      if (isOpen) {
        requestAnimationFrame(() => {
          positionCircularButtons();
        });
      }
    });
    
    // optional: handle device rotation with setTimeout.
    console.log('Radial circular menu ready — 5 buttons positioned in circular arc');
  })();