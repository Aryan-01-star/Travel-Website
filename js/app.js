/**
 * TRIP-STAR CORE APPLICATION ENGINE (LIGHT MODE)
 * Seamless Apple-inspired interactions, state management, and user experience.
 */

const TripStar = (() => {
  // Key Storage Keys
  const STORAGE_KEYS = {
    USER: 'tripstar_current_user',
    ACCOUNTS: 'tripstar_user_accounts',
    WISHLIST: 'tripstar_wishlist_ids',
    BOOKINGS: 'tripstar_bookings_list',
    REVIEWS: 'tripstar_community_reviews'
  };

  // Helper: Get from storage
  function getStorage(key, defaultVal = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  // Helper: Set in storage
  function setStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error("Storage error", e);
    }
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    let toast = document.getElementById('appleToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appleToast';
      toast.className = 'apple-toast';
      document.body.appendChild(toast);
    }

    const iconMap = {
      success: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
      info: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
      heart: '<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
      error: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'
    };

    toast.innerHTML = `
      <div class="toast-icon">${iconMap[type] || iconMap.info}</div>
      <div class="toast-message">${message}</div>
    `;

    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3600);
  }

  // User Account Management System
  function initAccounts() {
    let accounts = getStorage(STORAGE_KEYS.ACCOUNTS, null);
    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      accounts = [
        {
          name: "Alex Vance",
          email: "alex@tripstar.com",
          password: "password123",
          country: "United States",
          tier: "Diamond Ambassador",
          memberSince: "2024"
        },
        {
          name: "Sophia Laurent",
          email: "sophia@tripstar.com",
          password: "password123",
          country: "France",
          tier: "Platinum Explorer",
          memberSince: "2025"
        }
      ];
      setStorage(STORAGE_KEYS.ACCOUNTS, accounts);
    }
    return accounts;
  }

  function getAccounts() {
    return initAccounts();
  }

  function registerAccount(fullName, email, password, country) {
    const accounts = initAccounts();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (fullName || '').trim();

    if (!cleanName) {
      return { success: false, message: "Please enter your full name." };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: "Please enter a valid email address." };
    }
    if (!password || password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters." };
    }

    const existing = accounts.find(acc => acc.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: "An account with this email already exists. Please sign in instead."
      };
    }

    const newUser = {
      name: cleanName,
      email: cleanEmail,
      password: password,
      country: country || "United States",
      tier: "Explorer",
      memberSince: "2026"
    };

    accounts.push(newUser);
    setStorage(STORAGE_KEYS.ACCOUNTS, accounts);
    setCurrentUser(newUser);

    return {
      success: true,
      user: newUser
    };
  }

  function loginAccount(emailOrUsername, password) {
    const accounts = initAccounts();
    const cleanInput = (emailOrUsername || '').trim().toLowerCase();

    if (!cleanInput) {
      return { success: false, message: "Please enter your email or username." };
    }
    if (!password) {
      return { success: false, message: "Please enter your password." };
    }

    const found = accounts.find(acc =>
      acc.email.toLowerCase() === cleanInput ||
      acc.name.toLowerCase() === cleanInput
    );

    if (!found) {
      return {
        success: false,
        message: "No account found with this email. Please check your spelling or create an account."
      };
    }

    if (found.password !== password) {
      return {
        success: false,
        message: "Incorrect password. Please verify and try again."
      };
    }

    setCurrentUser(found);
    return {
      success: true,
      user: found
    };
  }

  // Current User State
  function getCurrentUser() {
    return getStorage(STORAGE_KEYS.USER, null);
  }

  function setCurrentUser(user) {
    setStorage(STORAGE_KEYS.USER, user);
    renderNavbarAuthState();
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    renderNavbarAuthState();
    showToast("Signed out successfully. See you on your next journey!", "info");
    setTimeout(() => {
      if (window.location.pathname.includes('signin.html') || window.location.pathname.includes('signup.html')) {
        window.location.href = 'index.html';
      }
    }, 800);
  }

  // Wishlist Manager
  function getWishlist() {
    return getStorage(STORAGE_KEYS.WISHLIST, []);
  }

  function toggleWishlist(id, title = "Destination") {
    let list = getWishlist();
    let isAdded = false;
    if (list.includes(id)) {
      list = list.filter(item => item !== id);
      showToast(`Removed "${title}" from favorites`, "info");
    } else {
      list.push(id);
      isAdded = true;
      showToast(`Saved "${title}" to favorites`, "heart");
    }
    setStorage(STORAGE_KEYS.WISHLIST, list);
    updateHeartIcons();
    return isAdded;
  }

  function updateHeartIcons() {
    const list = getWishlist();
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      const id = btn.getAttribute('data-wishlist-id');
      if (list.includes(id)) {
        btn.classList.add('favorited');
        btn.innerHTML = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      } else {
        btn.classList.remove('favorited');
        btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      }
    });
  }

  // Dynamic Navigation Setup
  function initNavbar() {
    const nav = document.querySelector('.apple-navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });

    // Active link matching
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Mobile menu toggle
    const toggleBtn = document.querySelector('.nav-mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggleBtn && navLinks) {
      const hamburgerSvg = `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      const closeSvg = `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('mobile-open');
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.innerHTML = isOpen ? closeSvg : hamburgerSvg;
      });

      document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) {
          navLinks.classList.remove('mobile-open');
          toggleBtn.classList.remove('active');
          toggleBtn.innerHTML = hamburgerSvg;
        }
      });

      navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('mobile-open');
          toggleBtn.classList.remove('active');
          toggleBtn.innerHTML = hamburgerSvg;
        });
      });
    }

    renderNavbarAuthState();
  }

  // Render User Auth in Nav
  function renderNavbarAuthState() {
    const actions = document.querySelector('.nav-actions');
    if (!actions) return;

    const user = getCurrentUser();
    if (user && user.name) {
      actions.innerHTML = `
        <div class="user-profile-badge" id="userMenuToggle" title="Click to view account">
          <div class="user-avatar-circle">${user.name.charAt(0).toUpperCase()}</div>
          <span class="user-profile-name">${user.name.split(' ')[0]}</span>
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div id="userDropdown" style="display:none; position:absolute; top:calc(100% + 8px); right:24px; background:#FFFFFF; border:1px solid #E5E5EA; border-radius:16px; padding:10px; box-shadow:0 12px 32px rgba(0,0,0,0.1); min-width:200px; z-index:1001;">
          <div style="font-size:0.8rem; color:var(--label-secondary); margin-bottom:8px; padding:6px 10px; border-bottom:1px solid #F5F5F7;">
            Signed in as <strong style="color:var(--label-primary); display:block; word-break:break-all;">${user.email || user.name}</strong>
          </div>
          <a href="listing.html" style="display:block; padding:8px 10px; border-radius:8px; font-size:0.88rem; color:var(--label-primary);" onmouseover="this.style.background='#F5F5F7'" onmouseout="this.style.background='transparent'">Explore Stays</a>
          <a href="knowmore.html" style="display:block; padding:8px 10px; border-radius:8px; font-size:0.88rem; color:var(--label-primary);" onmouseover="this.style.background='#F5F5F7'" onmouseout="this.style.background='transparent'">My Rewards</a>
          <button id="logoutBtn" style="width:100%; text-align:left; background:none; border:none; padding:8px 10px; border-radius:8px; font-size:0.88rem; color:#D90429; cursor:pointer;" onmouseover="this.style.background='rgba(217,4,41,0.06)'" onmouseout="this.style.background='transparent'">Sign Out</button>
        </div>
      `;

      const menuToggle = document.getElementById('userMenuToggle');
      const dropdown = document.getElementById('userDropdown');
      const logoutBtn = document.getElementById('logoutBtn');

      if (menuToggle && dropdown) {
        menuToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', () => {
          dropdown.style.display = 'none';
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
      }
    } else {
      actions.innerHTML = `
        <a href="signin.html" class="btn-auth-pill">
          Sign In
        </a>
      `;
    }
  }

  // Finalize confirmed reservation
  function finalizeReservation(stayData, bookingPayload, user, overlay) {
    const bookings = getStorage(STORAGE_KEYS.BOOKINGS, []);
    const newBooking = {
      id: 'TS-' + Math.floor(100000 + Math.random() * 900000),
      title: stayData.title,
      location: stayData.location,
      checkIn: bookingPayload.checkIn,
      checkOut: bookingPayload.checkOut,
      guests: bookingPayload.guests || 2,
      total: bookingPayload.total,
      userEmail: user.email,
      userName: user.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    bookings.push(newBooking);
    setStorage(STORAGE_KEYS.BOOKINGS, bookings);

    if (overlay) {
      overlay.classList.remove('active');
    }

    showToast(`Reservation confirmed, ${user.name}! Booking ID: ${newBooking.id}`, 'success');
  }

  // Auth Required Prompt before booking confirmation
  function renderLoginPrompt(stayData, bookingPayload, overlay) {
    overlay.innerHTML = `
      <div class="apple-modal-content" style="max-width:480px; text-align:center;">
        <button class="modal-close-btn" id="closeAuthPromptModal" aria-label="Close">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div style="width:58px; height:58px; border-radius:50%; background:rgba(0,113,227,0.1); color:var(--apple-blue); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
          <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
        </div>

        <h3 style="font-size:1.35rem; font-weight:700; color:var(--label-primary); margin-bottom:6px;">Please Sign In to Book</h3>
        <p style="font-size:0.88rem; color:var(--label-secondary); line-height:1.5; margin-bottom:18px;">
          To complete your reservation for <strong>${stayData.title}</strong>, please sign in or create an account.
        </p>

        <!-- Selected Stay Mini Summary -->
        <div style="background:var(--bg-canvas); border:1px solid var(--border-card); border-radius:14px; padding:12px 16px; margin-bottom:20px; display:flex; align-items:center; gap:12px; text-align:left;">
          <img src="${stayData.img}" alt="${stayData.title}" style="width:52px; height:52px; border-radius:10px; object-fit:cover; border:1px solid var(--border-card);">
          <div style="flex:1; min-width:0;">
            <div style="font-weight:700; font-size:0.92rem; color:var(--label-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${stayData.title}</div>
            <div style="font-size:0.78rem; color:var(--label-secondary); margin-top:2px;">
              ${bookingPayload.checkIn} &rarr; ${bookingPayload.checkOut} &bull; ${bookingPayload.guests} Guests
            </div>
          </div>
          <div style="font-weight:800; font-size:1.1rem; color:var(--label-primary);">${bookingPayload.total}</div>
        </div>

        <!-- Inline Quick Sign In Form -->
        <form id="inlineAuthForm" onsubmit="event.preventDefault();" style="text-align:left;">
          <div id="inlineAuthError" style="display:none; margin-bottom:14px; padding:10px 14px; border-radius:10px; background:rgba(217,4,41,0.08); border:1px solid rgba(217,4,41,0.2); color:#D90429; font-size:0.84rem; font-weight:500;"></div>

          <div class="apple-form-group" style="margin-bottom:12px;">
            <label class="apple-form-label" style="font-size:0.8rem;">Email or Username</label>
            <input type="text" id="inlineLoginEmail" class="apple-form-input" placeholder="e.g. alex@tripstar.com" required style="padding:11px 14px; font-size:0.9rem;">
          </div>

          <div class="apple-form-group" style="margin-bottom:16px;">
            <label class="apple-form-label" style="font-size:0.8rem;">Password</label>
            <input type="password" id="inlineLoginPassword" class="apple-form-input" placeholder="Enter password" required style="padding:11px 14px; font-size:0.9rem;">
          </div>

          <button type="submit" class="btn-apple btn-apple-primary btn-apple-lg" id="btnInlineSignIn" style="width:100%; margin-bottom:14px;">
            Sign In & Confirm Reservation
          </button>

          <!-- 1-Click Demo Explorer Chip -->
          <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:18px; font-size:0.8rem; color:var(--label-secondary);">
            <span>Sample explorer:</span>
            <button type="button" id="btnFillDemoInline" style="background:rgba(0,113,227,0.08); border:1px solid rgba(0,113,227,0.2); color:var(--apple-blue); border-radius:20px; padding:3px 12px; font-size:0.8rem; font-weight:600; cursor:pointer;">
              alex@tripstar.com (1-click)
            </button>
          </div>
        </form>

        <!-- Secondary Navigation Actions -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-glass); padding-top:16px; font-size:0.85rem;">
          <button type="button" id="btnBackToDates" style="background:none; border:none; color:var(--label-secondary); cursor:pointer; font-weight:600; padding:0; display:flex; align-items:center; gap:4px;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Dates
          </button>
          <div style="display:flex; align-items:center; gap:10px;">
            <a href="signup.html" id="btnGoToSignUp" style="color:var(--apple-blue); font-weight:700; text-decoration:none;">Create Account &rarr;</a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('closeAuthPromptModal').addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    document.getElementById('btnBackToDates').addEventListener('click', () => {
      openBookingModal(stayData, bookingPayload);
    });

    document.getElementById('btnFillDemoInline').addEventListener('click', () => {
      document.getElementById('inlineLoginEmail').value = 'alex@tripstar.com';
      document.getElementById('inlineLoginPassword').value = 'password123';
      document.getElementById('inlineAuthError').style.display = 'none';
      showToast('Demo account credentials filled!', 'info');
    });

    document.getElementById('btnGoToSignUp').addEventListener('click', () => {
      sessionStorage.setItem('tripstar_pending_booking', JSON.stringify({
        ...stayData,
        ...bookingPayload,
        returnUrl: window.location.href
      }));
    });

    document.getElementById('inlineAuthForm').addEventListener('submit', () => {
      const email = document.getElementById('inlineLoginEmail').value.trim();
      const pass = document.getElementById('inlineLoginPassword').value;
      const errorBox = document.getElementById('inlineAuthError');
      const submitBtn = document.getElementById('btnInlineSignIn');

      errorBox.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Signing In & Reserving...';

      setTimeout(() => {
        const loginRes = loginAccount(email, pass);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign In & Confirm Reservation';

        if (!loginRes.success) {
          errorBox.textContent = loginRes.message;
          errorBox.style.display = 'block';
          return;
        }

        // Successfully signed in! Finalize the reservation
        finalizeReservation(stayData, bookingPayload, loginRes.user, overlay);
      }, 400);
    });
  }

  // Booking Modal Flow
  function openBookingModal(stayData, savedValues = {}) {
    let overlay = document.getElementById('bookingModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'bookingModalOverlay';
      overlay.className = 'apple-modal-overlay';
      document.body.appendChild(overlay);
    }

    const defaultNights = 3;
    const nightlyPrice = stayData.price || 120;
    const cleaningFee = 45;
    const serviceFee = 25;
    const initialTotal = (nightlyPrice * defaultNights) + cleaningFee + serviceFee;
    const currentUser = getCurrentUser();

    overlay.innerHTML = `
      <div class="apple-modal-content">
        <button class="modal-close-btn" id="closeBookingModal" aria-label="Close">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
          <img src="${stayData.img}" alt="${stayData.title}" style="width:72px; height:72px; border-radius:14px; object-fit:cover; border:1px solid #E5E5EA;">
          <div>
            <h3 style="font-size:1.25rem; font-weight:700; color:var(--label-primary);">${stayData.title}</h3>
            <div style="font-size:0.88rem; color:var(--label-secondary);">${stayData.location} &bull; Verified Sanctuary</div>
            ${currentUser ? `
              <div style="display:inline-flex; align-items:center; gap:6px; font-size:0.78rem; color:#059669; font-weight:600; margin-top:4px; background:rgba(5,150,105,0.08); padding:2px 8px; border-radius:var(--radius-full);">
                <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#059669;"></span>
                Booking as ${currentUser.name}
              </div>
            ` : `
              <div style="display:inline-flex; align-items:center; gap:6px; font-size:0.78rem; color:var(--gold-warm); font-weight:600; margin-top:4px; background:rgba(217,119,6,0.08); padding:2px 8px; border-radius:var(--radius-full);">
                <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Sign in required to confirm
              </div>
            `}
          </div>
        </div>

        <form id="bookingForm" onsubmit="event.preventDefault();">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
            <div class="apple-form-group" style="margin-bottom:0;">
              <label class="apple-form-label">Check-in</label>
              <input type="date" class="apple-form-input" id="checkInDate" required value="${savedValues.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0]}">
            </div>
            <div class="apple-form-group" style="margin-bottom:0;">
              <label class="apple-form-label">Check-out</label>
              <input type="date" class="apple-form-input" id="checkOutDate" required value="${savedValues.checkOut || new Date(Date.now() + (86400000 * 4)).toISOString().split('T')[0]}">
            </div>
          </div>

          <div class="apple-form-group">
            <label class="apple-form-label">Guests</label>
            <select class="apple-form-select" id="guestCount">
              <option value="1" ${savedValues.guests == 1 ? 'selected' : ''}>1 Guest</option>
              <option value="2" ${!savedValues.guests || savedValues.guests == 2 ? 'selected' : ''}>2 Guests</option>
              <option value="3" ${savedValues.guests == 3 ? 'selected' : ''}>3 Guests</option>
              <option value="4" ${savedValues.guests == 4 ? 'selected' : ''}>4 Guests</option>
              <option value="5" ${savedValues.guests >= 5 ? 'selected' : ''}>5+ Guests</option>
            </select>
          </div>

          <div style="background:var(--bg-canvas); border:1px solid var(--border-card); border-radius:16px; padding:16px; margin:20px 0;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem; color:var(--label-secondary);">
              <span id="rateCalculationLabel">$${nightlyPrice} × <span id="nightsCountDisplay">${defaultNights}</span> nights</span>
              <span id="baseTotalDisplay" style="color:var(--label-primary); font-weight:600;">$${nightlyPrice * defaultNights}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem; color:var(--label-secondary);">
              <span>Hospitality & Cleaning</span>
              <span style="color:var(--label-primary); font-weight:600;">$${cleaningFee}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:0.9rem; color:var(--label-secondary);">
              <span>Guest Concierge Protection</span>
              <span style="color:var(--label-primary); font-weight:600;">$${serviceFee}</span>
            </div>
            <div style="border-top:1px solid var(--border-glass); padding-top:12px; display:flex; justify-content:space-between; align-items:baseline;">
              <span style="font-weight:700; font-size:1rem; color:var(--label-primary);">Total</span>
              <span id="finalGrandTotal" style="font-size:1.35rem; font-weight:800; color:var(--label-primary);">${savedValues.total || '$' + initialTotal}</span>
            </div>
          </div>

          <button type="submit" class="btn-apple btn-apple-primary btn-apple-lg" id="confirmBookingBtn" style="width:100%;">
            Confirm Reservation
          </button>
        </form>
      </div>
    `;

    overlay.classList.add('active');

    const checkIn = document.getElementById('checkInDate');
    const checkOut = document.getElementById('checkOutDate');
    const nightsDisplay = document.getElementById('nightsCountDisplay');
    const baseTotalDisplay = document.getElementById('baseTotalDisplay');
    const grandTotalDisplay = document.getElementById('finalGrandTotal');

    function updatePricing() {
      const d1 = new Date(checkIn.value);
      const d2 = new Date(checkOut.value);
      let diffDays = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      if (diffDays < 1) diffDays = 1;
      nightsDisplay.textContent = diffDays;
      const base = nightlyPrice * diffDays;
      baseTotalDisplay.textContent = `$${base}`;
      grandTotalDisplay.textContent = `$${base + cleaningFee + serviceFee}`;
    }

    checkIn.addEventListener('change', updatePricing);
    checkOut.addEventListener('change', updatePricing);
    updatePricing();

    document.getElementById('closeBookingModal').addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });

    document.getElementById('bookingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const user = getCurrentUser();
      const bookingPayload = {
        title: stayData.title,
        location: stayData.location,
        img: stayData.img,
        checkIn: checkIn.value,
        checkOut: checkOut.value,
        guests: document.getElementById('guestCount').value,
        total: grandTotalDisplay.textContent,
        price: nightlyPrice
      };

      if (!user) {
        // User has NOT logged in yet: first ask them to login!
        renderLoginPrompt(stayData, bookingPayload, overlay);
        return;
      }

      // User is logged in: finalize reservation
      finalizeReservation(stayData, bookingPayload, user, overlay);
    });
  }

  // Country Explorer Modal
  function openCountryModal(countryData) {
    let overlay = document.getElementById('countryModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'countryModalOverlay';
      overlay.className = 'apple-modal-overlay';
      document.body.appendChild(overlay);
    }

    const highlightsList = countryData.highlights.map(h => `
      <div style="display:flex; align-items:center; gap:8px; padding:9px 12px; background:var(--bg-canvas); border-radius:10px; border:1px solid var(--border-card);">
        <span style="color:var(--gold-warm); font-size:0.8rem;">●</span>
        <span style="font-size:0.88rem; color:var(--label-primary); font-weight:500;">${h}</span>
      </div>
    `).join('');

    overlay.innerHTML = `
      <div class="apple-modal-content" style="max-width:640px;">
        <button class="modal-close-btn" id="closeCountryModal" aria-label="Close">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div style="position:relative; height:220px; margin:-32px -32px 20px -32px; overflow:hidden; border-radius:var(--radius-xl) var(--radius-xl) 0 0;">
          <img src="${countryData.img}" style="width:100%; height:100%; object-fit:cover;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%);"></div>
          <div style="position:absolute; bottom:20px; left:28px; right:28px; color:#fff;">
            <div style="display:inline-block; font-size:0.72rem; font-weight:700; text-transform:uppercase; color:#fff; background:rgba(17,17,17,0.78); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.2); padding:3px 12px; border-radius:20px; margin-bottom:6px;">${countryData.continent}</div>
            <h2 style="font-size:1.8rem; font-weight:800; color:#fff;">${countryData.name}</h2>
          </div>
        </div>

        <p style="font-size:1rem; color:var(--label-secondary); line-height:1.6; margin-bottom:20px;">
          ${countryData.desc}
        </p>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:22px; text-align:center;">
          <div style="background:var(--bg-canvas); border:1px solid var(--border-card); padding:12px; border-radius:12px;">
            <div style="font-size:0.7rem; text-transform:uppercase; color:var(--label-tertiary); font-weight:700;">Best Season</div>
            <div style="font-size:0.9rem; font-weight:600; color:var(--label-primary); margin-top:2px;">${countryData.season || 'May - Oct'}</div>
          </div>
          <div style="background:var(--bg-canvas); border:1px solid var(--border-card); padding:12px; border-radius:12px;">
            <div style="font-size:0.7rem; text-transform:uppercase; color:var(--label-tertiary); font-weight:700;">Vibe</div>
            <div style="font-size:0.9rem; font-weight:600; color:var(--label-primary); margin-top:2px;">${countryData.vibe || 'Cultural'}</div>
          </div>
          <div style="background:var(--bg-canvas); border:1px solid var(--border-card); padding:12px; border-radius:12px;">
            <div style="font-size:0.7rem; text-transform:uppercase; color:var(--label-tertiary); font-weight:700;">Key Landmarks</div>
            <div style="font-size:0.9rem; font-weight:700; color:var(--label-primary); margin-top:2px;">${countryData.highlights.length}+ Curated</div>
          </div>
        </div>

        <h4 style="font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--label-tertiary); margin-bottom:10px;">Recommended Attractions</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:24px;">
          ${highlightsList}
        </div>

        <div style="display:flex; gap:10px;">
          <a href="listing.html?dest=${encodeURIComponent(countryData.name)}" class="btn-apple btn-apple-primary" style="flex:1;">
            Explore Stays in ${countryData.name}
          </a>
          <button class="btn-apple btn-apple-secondary" id="wishlistCountryBtn" data-country="${countryData.name}" style="display:inline-flex; align-items:center; gap:6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Save
          </button>
        </div>
      </div>
    `;

    overlay.classList.add('active');

    document.getElementById('closeCountryModal').addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });

    document.getElementById('wishlistCountryBtn').addEventListener('click', () => {
      toggleWishlist('dest_' + countryData.name, countryData.name);
    });
  }

  // =========================================================================
  // TRIP-STAR ANIMATED CONCIERGE CHARACTER & CHAT AI ASSISTANT (BOTTOM-RIGHT)
  // Physics bobbing character, eye blinking, soft shadow pulsation, zero emojis
  // =========================================================================
  function getAnimatedCharacterSvg(size = 58) {
    return `
      <svg class="character-svg-container" width="${size}" height="${size}" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="charBodyGrad" x1="10" y1="12" x2="50" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#2D3748"/>
            <stop offset="100%" stop-color="#121212"/>
          </linearGradient>
          <linearGradient id="charVisorGrad" x1="16" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#1A202C"/>
            <stop offset="100%" stop-color="#0A0D12"/>
          </linearGradient>
          <linearGradient id="charGoldGrad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#F7EFE4"/>
            <stop offset="50%" stop-color="#C5A880"/>
            <stop offset="100%" stop-color="#9A7B4F"/>
          </linearGradient>
        </defs>

        <!-- Antenna & Glowing Beacon -->
        <path d="M30 14V6" stroke="url(#charGoldGrad)" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="30" cy="5" r="3.2" fill="#FFE29F" class="char-antenna-light"/>

        <!-- Headphone Band & Ear Cups -->
        <path d="M10 24C10 13 50 13 50 24" stroke="url(#charGoldGrad)" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <rect x="5" y="23" width="6.5" height="17" rx="3.25" fill="#1A202C" stroke="url(#charGoldGrad)" stroke-width="1.5"/>
        <rect x="48.5" y="23" width="6.5" height="17" rx="3.25" fill="#1A202C" stroke="url(#charGoldGrad)" stroke-width="1.5"/>

        <!-- Main Outer Shell -->
        <circle cx="30" cy="32" r="21" fill="url(#charBodyGrad)" stroke="url(#charGoldGrad)" stroke-width="1.6"/>

        <!-- High-Gloss Visor Screen -->
        <rect x="16" y="23" width="28" height="18" rx="9" fill="url(#charVisorGrad)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        
        <!-- Visor Reflection Sheen -->
        <path d="M19 25.5C23 24.5 37 24.5 41 25.5" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"/>

        <!-- Animated Blinking Eyes -->
        <ellipse cx="23.5" cy="31" rx="2.8" ry="3.8" fill="#FFE29F" class="char-eye"/>
        <ellipse cx="36.5" cy="31" rx="2.8" ry="3.8" fill="#FFE29F" class="char-eye"/>

        <!-- Friendly Smile -->
        <path d="M27 36.5C28.5 38 31.5 38 33 36.5" stroke="#C5A880" stroke-width="1.6" stroke-linecap="round"/>

        <!-- Minimal Cheek Tone -->
        <circle cx="19.5" cy="34" r="1.5" fill="rgba(224, 90, 71, 0.45)"/>
        <circle cx="40.5" cy="34" r="1.5" fill="rgba(224, 90, 71, 0.45)"/>
      </svg>
    `;
  }

  function initAiAssistant() {
    if (document.getElementById('appleAiChatToggle')) return;

    // 1. Create floating animated character button at bottom-right (compact icon, zero text clutter)
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'appleAiChatToggle';
    toggleBtn.className = 'apple-ai-character-trigger';
    toggleBtn.setAttribute('aria-label', 'Atlas - AI Travel Concierge');
    toggleBtn.setAttribute('title', 'Atlas - AI Travel Concierge');
    toggleBtn.innerHTML = `
      <div class="character-avatar-wrap">
        ${getAnimatedCharacterSvg(42)}
        <div class="character-shadow"></div>
      </div>
    `;

    // 2. Create the floating chat panel
    const panel = document.createElement('div');
    panel.id = 'appleAiChatPanel';
    panel.className = 'apple-ai-chat-panel';
    panel.innerHTML = `
      <div class="ai-chat-header">
        <div class="ai-chat-header-left">
          <div style="width:38px; height:38px; display:flex; align-items:center; justify-content:center;">
            ${getAnimatedCharacterSvg(38)}
          </div>
          <div>
            <div class="ai-header-title">Atlas &bull; AI Concierge</div>
            <div class="ai-header-status">
              <span class="ai-header-status-dot"></span>
              <span>Online &bull; Interactive Travel Guide</span>
            </div>
          </div>
        </div>
        <div class="ai-chat-header-actions">
          <button class="ai-header-icon-btn" id="aiClearChatBtn" title="Clear Conversation" aria-label="Clear Chat">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
          <button class="ai-header-icon-btn" id="aiCloseChatBtn" title="Close Assistant" aria-label="Close Chat">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="ai-chat-suggestions">
        <button class="ai-suggestion-chip" data-query="Find luxury chalets in Switzerland">Chalets in Switzerland</button>
        <button class="ai-suggestion-chip" data-query="Recommend cliffside villas in Santorini">Villas in Santorini</button>
        <button class="ai-suggestion-chip" data-query="Best season to visit Kyoto Japan">Kyoto Seasons</button>
        <button class="ai-suggestion-chip" data-query="What flights and airlines are supported?">Aviation Partners</button>
        <button class="ai-suggestion-chip" data-query="How does the ambassador rewards program work?">Rewards Program</button>
      </div>

      <div class="ai-chat-body" id="aiChatBody">
        <div class="ai-msg-row assistant">
          <div class="ai-bubble">
            Hello! I am Atlas, your TripStar AI Travel Concierge. I can guide you through our handpicked luxury chalets, cliffside villas, and city penthouses, or answer questions about destinations, weather, and reservations. Where would you like to travel?
          </div>
          <div class="ai-msg-time">Atlas</div>
        </div>
      </div>

      <form class="ai-chat-input-bar" id="aiChatForm" onsubmit="event.preventDefault();">
        <input type="text" id="aiChatInput" class="ai-chat-input" placeholder="Ask Atlas anything..." autocomplete="off">
        <button type="submit" class="ai-send-btn" id="aiSendBtn" aria-label="Send Message">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </form>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    toggleBtn.addEventListener('click', () => {
      const isActive = panel.classList.toggle('active');
      if (isActive) {
        document.getElementById('aiChatInput').focus();
      }
    });

    document.getElementById('aiCloseChatBtn').addEventListener('click', () => {
      panel.classList.remove('active');
    });

    document.getElementById('aiClearChatBtn').addEventListener('click', () => {
      const body = document.getElementById('aiChatBody');
      body.innerHTML = `
        <div class="ai-msg-row assistant">
          <div class="ai-bubble">
            Conversation refreshed. How may Atlas assist your travel plans today?
          </div>
          <div class="ai-msg-time">Atlas</div>
        </div>
      `;
      showToast('Chat history cleared', 'info');
    });

    panel.querySelectorAll('.ai-suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        sendAiMessage(query);
      });
    });

    document.getElementById('aiChatForm').addEventListener('submit', () => {
      const input = document.getElementById('aiChatInput');
      const val = input.value.trim();
      if (val) {
        input.value = '';
        sendAiMessage(val);
      }
    });
  }

  function formatAiReply(text) {
    if (!text) return '';
    let html = escapeHtml(text);
    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code `text`
    html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.06); padding:2px 6px; border-radius:4px; font-size:0.86em; font-family:monospace;">$1</code>');
    // Bullet points: • item
    html = html.replace(/^• (.*)$/gm, '<li style="margin-left:18px; margin-bottom:3px; list-style-type:disc;">$1</li>');
    html = html.replace(/(<li.*<\/li>\n?)+/g, '<ul style="margin:6px 0; padding-left:0;">$&</ul>');
    // Numbered points: 1. item
    html = html.replace(/^(\d+)\. (.*)$/gm, '<li style="margin-left:18px; margin-bottom:3px; list-style-type:decimal;">$2</li>');
    // Newlines to linebreaks and spacing
    html = html.replace(/\n\n/g, '<div style="height:8px;"></div>').replace(/\n/g, '<br>');
    return html;
  }

  async function sendAiMessage(userText) {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;

    const userRow = document.createElement('div');
    userRow.className = 'ai-msg-row user';
    userRow.innerHTML = `
      <div class="ai-bubble">${escapeHtml(userText)}</div>
      <div class="ai-msg-time">You</div>
    `;
    chatBody.appendChild(userRow);

    const typingRow = document.createElement('div');
    typingRow.className = 'ai-msg-row assistant typing-row';
    typingRow.innerHTML = `
      <div class="ai-typing-dots">
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
      </div>
    `;
    chatBody.appendChild(typingRow);
    chatBody.scrollTop = chatBody.scrollHeight;

    let replyText = "";
    let recommendedStays = [];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      if (res.ok) {
        const data = await res.json();
        replyText = data.reply;
        recommendedStays = data.recommendedStays || [];
      } else {
        throw new Error('API unavailable');
      }
    } catch (e) {
      const fallback = localAiFallback(userText);
      replyText = fallback.reply;
      recommendedStays = fallback.recommendedStays || [];
    }

    typingRow.remove();

    const assistantRow = document.createElement('div');
    assistantRow.className = 'ai-msg-row assistant';

    let staysHtml = '';
    if (recommendedStays && recommendedStays.length > 0) {
      staysHtml = recommendedStays.map(stay => `
        <div class="ai-stay-mini-card">
          <div class="ai-stay-mini-media">
            <img src="${stay.img}" alt="${stay.title}" loading="lazy">
            <span class="ai-stay-mini-badge">${stay.badge || 'Luxury'}</span>
          </div>
          <div class="ai-stay-mini-body">
            <div class="ai-stay-mini-title">${stay.title}</div>
            <div class="ai-stay-mini-loc">${stay.location}</div>
            <div class="ai-stay-mini-footer">
              <span class="ai-stay-mini-price">$${stay.price}<span style="font-size:0.75rem; font-weight:normal; color:var(--label-secondary);"> / night</span></span>
              <button class="ai-stay-book-btn" onclick="TripStar.openBookingModal(${JSON.stringify(stay).replace(/"/g, '&quot;')})">Book Now</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    assistantRow.innerHTML = `
      <div class="ai-bubble">
        ${formatAiReply(replyText)}
        ${staysHtml}
      </div>
      <div class="ai-msg-time">Atlas</div>
    `;
    chatBody.appendChild(assistantRow);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function localAiFallback(userText) {
    if (typeof TripStarAi !== 'undefined' && typeof TripStarAi.answerTravelQuery === 'function') {
      return TripStarAi.answerTravelQuery(userText);
    }
    return {
      reply: "Welcome to TripStar! I am Atlas, your AI Travel Concierge. I can help you discover luxury chalets, cliffside villas, and city penthouses across Switzerland, Greece, Japan, France, Indonesia, and New York. What destination or stay would you like to explore?",
      recommendedStays: []
    };
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    updateHeartIcons();
    initAiAssistant();

    document.body.addEventListener('click', (e) => {
      const heartBtn = e.target.closest('[data-wishlist-id]');
      if (heartBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = heartBtn.getAttribute('data-wishlist-id');
        const title = heartBtn.getAttribute('data-wishlist-title') || "Destination";
        toggleWishlist(id, title);
      }
    });
  });

  return {
    showToast,
    getCurrentUser,
    setCurrentUser,
    logout,
    registerAccount,
    loginAccount,
    initAccounts,
    getAccounts,
    toggleWishlist,
    getWishlist,
    openBookingModal,
    openCountryModal,
    initAiAssistant,
    getStorage,
    setStorage,
    STORAGE_KEYS
  };
})();
