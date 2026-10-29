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
      success: '✓',
      info: 'ℹ',
      heart: '♥',
      error: '✕'
    };

    toast.innerHTML = `
      <div class="toast-icon">${iconMap[type] || 'ℹ'}</div>
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
        <button class="modal-close-btn" id="closeAuthPromptModal" aria-label="Close">✕</button>

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
        <button class="modal-close-btn" id="closeBookingModal" aria-label="Close">✕</button>
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
                <span>🔒</span> Sign in required to confirm
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
        <button class="modal-close-btn" id="closeCountryModal" aria-label="Close">✕</button>
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
          <button class="btn-apple btn-apple-secondary" id="wishlistCountryBtn" data-country="${countryData.name}">
            ♥ Save
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

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    updateHeartIcons();

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
    getStorage,
    setStorage,
    STORAGE_KEYS
  };
})();
