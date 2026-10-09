/* ==========================================================================
   TRUPESH WEDS RASHMI - INTERACTIVE LOGIC & ANIMATIONS
   GSAP, Audio, Petals Canvas, Calendar .ics, Countdown & Guestbook
   ========================================================================== */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Toast Notification Helper
  // --------------------------------------------------------------------------
  const toastEl = document.getElementById('toast-notice');
  let toastTimer = null;

  function showToast(message, duration = 3000) {
    if (!toastEl) return;
    toastEl.querySelector('.toast-text').textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  // --------------------------------------------------------------------------
  // 2. Preloader & Invitation Curtain
  // --------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  const enterBtn = document.getElementById('btn-enter-invitation');

  function dismissPreloader() {
    if (!preloader) return;
    preloader.classList.add('preloader-hidden');
    // Attempt audio unlock on first deliberate click
    tryStartAudio();
    // Trigger entrance confetti/petal flutter
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#e5c365', '#d4af37', '#ffffff', '#a81c2d']
      });
    }
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', dismissPreloader);
  }

  window.addEventListener('load', () => {
    // Show ready state on button
    if (enterBtn) {
      enterBtn.innerHTML = `<span>Open Royal Invitation</span> <span style="font-size:1.2em;">💌</span>`;
    }
  });

  // --------------------------------------------------------------------------
  // 3. Audio Controller (Background Wedding Shehnai)
  // --------------------------------------------------------------------------
  const bgAudio = document.getElementById('bg-music-audio');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  let isMusicPlaying = false;
  const STORAGE_KEY_MUSIC = 'trupesh_rashmi_music_pref';

  function updateMusicUI(playing) {
    if (!musicToggleBtn) return;
    if (playing) {
      musicToggleBtn.classList.add('playing', 'active');
      musicToggleBtn.querySelector('.music-toggle-label').textContent = 'Music On';
    } else {
      musicToggleBtn.classList.remove('playing', 'active');
      musicToggleBtn.querySelector('.music-toggle-label').textContent = 'Music';
    }
  }

  function tryStartAudio() {
    if (!bgAudio) return;
    // Check saved preference; default to true once user clicks Open
    const savedPref = localStorage.getItem(STORAGE_KEY_MUSIC);
    if (savedPref === 'false') return;

    bgAudio.volume = 0.5;
    bgAudio.play()
      .then(() => {
        isMusicPlaying = true;
        localStorage.setItem(STORAGE_KEY_MUSIC, 'true');
        updateMusicUI(true);
      })
      .catch(() => {
        isMusicPlaying = false;
        updateMusicUI(false);
      });
  }

  function toggleAudio() {
    if (!bgAudio) return;
    if (isMusicPlaying) {
      bgAudio.pause();
      isMusicPlaying = false;
      localStorage.setItem(STORAGE_KEY_MUSIC, 'false');
      updateMusicUI(false);
      showToast('Music paused');
    } else {
      bgAudio.volume = 0.5;
      bgAudio.play()
        .then(() => {
          isMusicPlaying = true;
          localStorage.setItem(STORAGE_KEY_MUSIC, 'true');
          updateMusicUI(true);
          showToast('Playing Shehnai & Flute ♪');
        })
        .catch(err => {
          console.warn('Audio play failed:', err);
          showToast('Tap again to enable audio');
        });
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleAudio);
  }

  // --------------------------------------------------------------------------
  // 4. Petals & Sparkles Floating Canvas
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('petals-canvas');
  let ctx = null;
  let animationFrameId = null;
  let petals = [];
  let isPetalsEnabled = true;
  const petalsToggleBtn = document.getElementById('petals-toggle-btn');

  if (canvas && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Petal types: Mogra (white Jasmine), Marigold (yellow/orange), Gold Sparkle
    const petalColors = [
      { r: 250, g: 249, b: 245, a: 0.85, type: 'mogra' },     // White Mogra
      { r: 245, g: 166, b: 35, a: 0.85, type: 'marigold' },  // Haldi Yellow
      { r: 229, g: 195, b: 101, a: 0.9, type: 'gold' },      // Gold foil
      { r: 201, g: 36, b: 58, a: 0.75, type: 'rose' }        // Sindoor Rose
    ];

    const MAX_PETALS = window.innerWidth < 600 ? 24 : 40;

    class Petal {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : -20;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 0.9 + 0.6;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.8 - 0.4;
        this.angle = Math.random() * 360;
        this.angularSpeed = (Math.random() - 0.5) * 1.5;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
        this.oscillation = Math.random() * Math.PI * 2;
        this.oscillationSpeed = Math.random() * 0.03 + 0.01;
      }
      update() {
        this.y += this.speedY;
        this.oscillation += this.oscillationSpeed;
        this.x += this.speedX + Math.sin(this.oscillation) * 0.7;
        this.angle += this.angularSpeed;

        if (this.y > canvas.height + 25 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset(false);
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;

        if (this.color.type === 'gold') {
          // Sparkle diamond
          ctx.beginPath();
          ctx.moveTo(0, -this.size * 0.8);
          ctx.lineTo(this.size * 0.5, 0);
          ctx.lineTo(0, this.size * 0.8);
          ctx.lineTo(-this.size * 0.5, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // Petal curve
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < MAX_PETALS; i++) {
      petals.push(new Petal());
    }

    function renderPetals() {
      if (!isPetalsEnabled || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
      }
      animationFrameId = requestAnimationFrame(renderPetals);
    }
    renderPetals();

    if (petalsToggleBtn) {
      petalsToggleBtn.addEventListener('click', () => {
        isPetalsEnabled = !isPetalsEnabled;
        if (isPetalsEnabled) {
          petalsToggleBtn.classList.add('active');
          renderPetals();
          showToast('Flower shower active 🌸');
        } else {
          petalsToggleBtn.classList.remove('active');
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          showToast('Flower shower paused');
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 5. Live Countdown Timer (Target: 26 November 2026, Hastha Melap 4:45 PM IST)
  // --------------------------------------------------------------------------
  const weddingDate = new Date('2026-11-26T16:45:00+05:30');

  const daysVal = document.getElementById('countdown-days');
  const hoursVal = document.getElementById('countdown-hours');
  const minsVal = document.getElementById('countdown-mins');
  const secsVal = document.getElementById('countdown-secs');

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      if (daysVal) daysVal.textContent = '00';
      if (hoursVal) hoursVal.textContent = '00';
      if (minsVal) minsVal.textContent = '00';
      if (secsVal) secsVal.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (daysVal) daysVal.textContent = String(days).padStart(2, '0');
    if (hoursVal) hoursVal.textContent = String(hours).padStart(2, '0');
    if (minsVal) minsVal.textContent = String(mins).padStart(2, '0');
    if (secsVal) secsVal.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --------------------------------------------------------------------------
  // 6. Add to Calendar (iCalendar .ics generator & Google Calendar)
  // --------------------------------------------------------------------------
  const WEDDING_EVENTS_DATA = [
    {
      id: 'all',
      title: 'Trupesh Weds Rashmi - Complete Wedding Celebrations',
      desc: 'Join the Nandoliya & Panchal families for the auspicious wedding festivities of Trupesh and Rashmi in Mira Road.',
      location: 'Mira Road East, Maharashtra 401107',
      start: '20261124T160000',
      end: '20261126T230000',
      gcal: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Trupesh+Weds+Rashmi+-+Wedding+Celebrations&dates=20261124T103000Z/20261126T183000Z&details=Trupesh+Weds+Rashmi+Wedding+Festivities+(Manglik+Prasang,+Mamera,+Dandiya+Ras,+Hastha+Melap)&location=Mira+Road+East,+Maharashtra+401107'
    },
    {
      id: 'sanjee',
      title: 'Manglik Prasang & Sanjee Na Geet - Trupesh & Rashmi',
      desc: 'Sanjee Na Geet and auspicious pre-wedding songs (Kartak Sud Punam)',
      location: 'Bapa Sitaram Garden, Behind Ayyappa Temple, Opp. Indraprasth Bldg., Poonam Vihar, Mira Road (E) 401107',
      start: '20261124T160000',
      end: '20261124T190000',
      gcal: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Manglik+Prasang+%26+Sanjee+Na+Geet+-+Trupesh+%26+Rashmi&dates=20261124T103000Z/20261124T133000Z&details=Kartak+Sud+Punam+Manglik+Prasang+and+Sanjee+Na+Geet&location=Bapa+Sitaram+Garden,+Mira+Road+East+401107'
    },
    {
      id: 'mamera',
      title: 'Mandap Murat & Ruda Mamera - Trupesh & Rashmi',
      desc: 'Auspicious Mandap Murat (8:15 AM) followed by Ruda Mamera (11:00 AM)',
      location: 'Bapa Sitaram Garden, Behind Ayyappa Temple, Opp. Indraprasth Bldg., Poonam Vihar, Mira Road (E) 401107',
      start: '20261125T081500',
      end: '20261125T130000',
      gcal: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mandap+Murat+%26+Ruda+Mamera+-+Trupesh+%26+Rashmi&dates=20261125T024500Z/20261125T073000Z&details=Mandap+Murat+(8:15+AM)+and+Ruda+Mamera+(11:00+AM)&location=Bapa+Sitaram+Garden,+Mira+Road+East+401107'
    },
    {
      id: 'dandiya',
      title: 'Dandiya Ras & Garba Night - Trupesh & Rashmi',
      desc: 'Vibrant traditional Gujarati Dandiya Ras & Garba celebration (7:00 PM – 10:00 PM)',
      location: 'Bapa Sitaram Garden, Behind Ayyappa Temple, Opp. Indraprasth Bldg., Poonam Vihar, Mira Road (E) 401107',
      start: '20261125T190000',
      end: '20261125T220000',
      gcal: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Dandiya+Ras+-+Trupesh+%26+Rashmi&dates=20261125T133000Z/20261125T163000Z&details=Festive+Dandiya+Ras+and+Garba+Night&location=Bapa+Sitaram+Garden,+Mira+Road+East+401107'
    },
    {
      id: 'wedding',
      title: 'Trupesh Weds Rashmi - Shubh Vivah, Hastha Melap & Reception',
      desc: 'Jan Prasthan (2:00 PM), Sacred Hastha Melap (4:45 PM) and Grand Reception (8:30 PM)',
      location: 'Maa Laxmi Garden near MBMC, near Rassaz Greens, Medetiya Nagar, Mira Road East, Mira Bhayandar, Maharashtra 401107',
      start: '20261126T140000',
      end: '20261126T233000',
      gcal: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Trupesh+Weds+Rashmi+-+Shubh+Vivah+%26+Reception&dates=20261126T083000Z/20261126T180000Z&details=Jan+Prasthan+(2:00+PM),+Hastha+Melap+(4:45+PM),+Reception+(8:30+PM)&location=Maa+Laxmi+Garden,+Mira+Road+East+401107'
    }
  ];

  function downloadICS(eventId) {
    const event = WEDDING_EVENTS_DATA.find(e => e.id === eventId) || WEDDING_EVENTS_DATA[0];
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Trupesh and Rashmi Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}-20261126@trupesh-rashmi-wedding`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;TZID=Asia/Kolkata:${event.start}`,
      `DTEND;TZID=Asia/Kolkata:${event.end}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.desc}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}-trupesh-weds-rashmi.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Event added to Calendar file (.ics)');
  }

  // Bind all calendar buttons
  document.querySelectorAll('[data-cal-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventId = btn.getAttribute('data-cal-id');
      downloadICS(eventId);
    });
  });

  // --------------------------------------------------------------------------
  // 7. Web Share & Clipboard Copy
  // --------------------------------------------------------------------------
  const shareBtn = document.getElementById('share-invite-btn');

  function handleShare() {
    const shareData = {
      title: 'Trupesh Weds Rashmi | Wedding Invitation',
      text: 'You are cordially invited to celebrate the wedding festivities of Trupesh & Rashmi! Nandoliya Family Invites You.',
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(err => {
        if (err.name !== 'AbortError') {
          copyInviteLink();
        }
      });
    } else {
      copyInviteLink();
    }
  }

  function copyInviteLink() {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        showToast('Invitation link copied to clipboard! 📋');
      })
      .catch(() => {
        showToast('Please copy the URL from your browser address bar');
      });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', handleShare);
  }

  // Copy Address Buttons
  document.querySelectorAll('[data-copy-addr]').forEach(btn => {
    btn.addEventListener('click', () => {
      const addr = btn.getAttribute('data-copy-addr');
      navigator.clipboard.writeText(addr)
        .then(() => {
          showToast('Venue address copied! 📍');
        })
        .catch(() => {
          showToast('Address: ' + addr);
        });
    });
  });

  // --------------------------------------------------------------------------
  // 8. Event Day Filter Tabs
  // --------------------------------------------------------------------------
  const dayTabs = document.querySelectorAll('.day-tab-btn');
  const eventCards = document.querySelectorAll('.timeline-event-card');
  const dayHeaders = document.querySelectorAll('.timeline-day-header');

  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dayTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterDay = tab.getAttribute('data-filter-day');

      if (filterDay === 'all') {
        eventCards.forEach(card => card.style.display = 'block');
        dayHeaders.forEach(header => header.style.display = 'flex');
      } else {
        eventCards.forEach(card => {
          if (card.getAttribute('data-day') === filterDay) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
        dayHeaders.forEach(header => {
          if (header.getAttribute('data-day') === filterDay) {
            header.style.display = 'flex';
          } else {
            header.style.display = 'none';
          }
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. Family Section Filter Tabs
  // --------------------------------------------------------------------------
  const familyTabs = document.querySelectorAll('.family-tab-btn');
  const familyPanes = document.querySelectorAll('.family-tab-pane');

  familyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      familyTabs.forEach(t => t.classList.remove('active'));
      familyPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(tab.getAttribute('data-target-pane'));
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 10. Traditional Kankotri Script Switcher (Gujarati Lipi ⇄ English Script)
  // --------------------------------------------------------------------------
  const langBtns = document.querySelectorAll('.lang-btn');
  const kankotriGujarati = document.getElementById('kankotri-gujarati-text');
  const kankotriEnglish = document.getElementById('kankotri-english-text');

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.getAttribute('data-lang');

      if (lang === 'gu') {
        if (kankotriGujarati) kankotriGujarati.style.display = 'block';
        if (kankotriEnglish) kankotriEnglish.style.display = 'none';
      } else {
        if (kankotriGujarati) kankotriGujarati.style.display = 'none';
        if (kankotriEnglish) kankotriEnglish.style.display = 'block';
      }
    });
  });

  // --------------------------------------------------------------------------
  // 11. Interactive Guest Blessings & Wishes
  // --------------------------------------------------------------------------
  const wishesForm = document.getElementById('wishes-form');
  const wishesList = document.getElementById('wishes-feed-list');
  const wishInputName = document.getElementById('wish-sender-name');
  const wishInputMsg = document.getElementById('wish-message');
  const quickTags = document.querySelectorAll('.quick-tag-btn');
  const STORAGE_KEY_WISHES = 'trupesh_rashmi_wishes_list';

  // Seed initial heartfelt blessings
  const DEFAULT_WISHES = [
    {
      name: 'Nileshbhai Sondagar (Mama)',
      msg: 'મારા વાહલા ત્રુપેશ અને રશ્મિ ને પ્રભુતામાં પગલાં પાડવાના આ મંગળ અવસરે ખૂબ ખૂબ આશીર્વાદ! સદા સુખી રહો!',
      time: 'Just now'
    },
    {
      name: 'Dharmashbhai & Naynaben Kalsara',
      msg: 'Wishing Trupesh and Rashmi a lifetime of endless joy, love, togetherness and divine blessings! ❤️',
      time: 'Earlier today'
    },
    {
      name: 'Snehi Swajan',
      msg: 'લગ્નના પવિત્ર બંધનમાં બંધાવા જઈ રહેલા નવદંપતી ને હાર્દિક શુભકામનાઓ! 🌸',
      time: 'Yesterday'
    }
  ];

  function loadWishes() {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY_WISHES)) || [];
    } catch (e) {
      saved = [];
    }
    const combined = [...saved, ...DEFAULT_WISHES];
    renderWishes(combined);
  }

  function renderWishes(wishes) {
    if (!wishesList) return;
    wishesList.innerHTML = wishes.map(w => `
      <div class="wish-item-bubble">
        <div class="wish-item-header">
          <span class="wish-sender-name">${escapeHTML(w.name)}</span>
          <span class="wish-time-ago">${escapeHTML(w.time || 'Recent')}</span>
        </div>
        <p class="wish-item-msg">${escapeHTML(w.msg)}</p>
      </div>
    `).join('');
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  quickTags.forEach(tag => {
    tag.addEventListener('click', () => {
      if (wishInputMsg) {
        wishInputMsg.value = tag.getAttribute('data-tag-text');
        wishInputMsg.focus();
      }
    });
  });

  if (wishesForm) {
    wishesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (wishInputName?.value || '').trim();
      const msg = (wishInputMsg?.value || '').trim();

      if (!name || !msg) {
        showToast('Please enter your name and blessing message');
        return;
      }

      const newWish = {
        name,
        msg,
        time: 'Just now'
      };

      let currentSaved = [];
      try {
        currentSaved = JSON.parse(localStorage.getItem(STORAGE_KEY_WISHES)) || [];
      } catch (err) {
        currentSaved = [];
      }
      currentSaved.unshift(newWish);
      localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(currentSaved));

      loadWishes();
      wishInputName.value = '';
      wishInputMsg.value = '';
      showToast('Thank you! Your blessing was showered upon the couple ❤️');

      // Celebration burst
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#e5c365', '#d4af37', '#a81c2d', '#ffffff']
        });
      }
    });
  }

  loadWishes();

  // --------------------------------------------------------------------------
  // 12. Grand Finale Confetti & Petals Shower Button
  // --------------------------------------------------------------------------
  const celebrateBtn = document.getElementById('btn-celebrate-shower');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      if (typeof confetti === 'function') {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          colors: ['#e5c365', '#d4af37', '#a81c2d', '#f5a623', '#ffffff']
        };

        function fire(particleRatio, opts) {
          confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
          }));
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      }
      showToast('Blessings & Joy Showered upon Trupesh & Rashmi! 🌸✨');
    });
  }

  // --------------------------------------------------------------------------
  // 13. Pre-Wedding Moments Luxury Lightbox Controller
  // --------------------------------------------------------------------------
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxTagGu = document.getElementById('lightbox-tag-gu');
  const lightboxQuote = document.getElementById('lightbox-quote');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  let currentGalleryIndex = 0;

  function getGalleryData() {
    return galleryItems.map(item => ({
      img: item.getAttribute('data-img'),
      title: item.getAttribute('data-title'),
      titleGu: item.getAttribute('data-title-gu'),
      quote: item.getAttribute('data-quote')
    }));
  }

  const galleryDataList = getGalleryData();

  function openLightbox(index) {
    if (!lightboxModal || !galleryDataList.length) return;
    currentGalleryIndex = (index + galleryDataList.length) % galleryDataList.length;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const data = galleryDataList[currentGalleryIndex];
    if (!data) return;

    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      lightboxImg.src = data.img;
      lightboxImg.onload = () => {
        lightboxImg.style.opacity = '1';
      };
    }
    if (lightboxTitle) lightboxTitle.textContent = data.title;
    if (lightboxTagGu) lightboxTagGu.textContent = data.titleGu;
    if (lightboxQuote) lightboxQuote.innerHTML = `&ldquo;${data.quote}&rdquo;`;
    if (lightboxCounter) lightboxCounter.textContent = `${currentGalleryIndex + 1} of ${galleryDataList.length}`;
  }

  function showNextPhoto() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryDataList.length;
    updateLightboxContent();
  }

  function showPrevPhoto() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryDataList.length) % galleryDataList.length;
    updateLightboxContent();
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextPhoto(); });
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevPhoto(); });

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') showNextPhoto();
    else if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  // Touch Swipe for mobile Lightbox
  let touchStartX = 0;
  let touchEndX = 0;
  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        showNextPhoto(); // swiped left
      } else if (touchEndX - touchStartX > 50) {
        showPrevPhoto(); // swiped right
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 14. Active Bottom Dock Highlight on Scroll
  // --------------------------------------------------------------------------
  const navItems = document.querySelectorAll('.nav-dock-item');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // --------------------------------------------------------------------------
  // 15. GSAP & ScrollTrigger Animations
  // --------------------------------------------------------------------------
  if (window.gsap && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Reveal Timeline
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl.from('.auspicious-invocations', {
      opacity: 0,
      y: -25,
      duration: 1.1,
      ease: 'power3.out'
    })
    .from('.royal-crest-wrap', {
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      ease: 'back.out(1.7)'
    }, '-=0.6')
    .from('.hero-names-block', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=0.7')
    .from('.hero-family-invite-line, .hero-family-invite-sub', {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out'
    }, '-=0.6')
    .from('.hero-bottom-callout', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5');

    // ScrollTrigger Stagger for Sections
    if (window.ScrollTrigger) {
      // Story Couple Frame
      gsap.from('.story-couple-showcase', {
        scrollTrigger: {
          trigger: '.story-couple-showcase',
          start: 'top 85%'
        },
        opacity: 0,
        scale: 0.92,
        duration: 1,
        ease: 'power3.out'
      });

      // Gallery Items Stagger
      gsap.utils.toArray('.gallery-item').forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 88%'
          },
          opacity: 0,
          y: 35,
          duration: 0.85,
          delay: (index % 2) * 0.12,
          ease: 'power2.out'
        });
      });

      gsap.utils.toArray('.parent-card').forEach(card => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          },
          opacity: 0,
          y: 35,
          duration: 0.9,
          ease: 'power2.out'
        });
      });

      gsap.utils.toArray('.timeline-event-card').forEach(card => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%'
          },
          opacity: 0,
          x: 25,
          duration: 0.8,
          ease: 'power2.out'
        });
      });

      gsap.utils.toArray('.venue-card').forEach(card => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'power2.out'
        });
      });

      gsap.from('.engraved-date-plate', {
        scrollTrigger: {
          trigger: '.engraved-date-plate',
          start: 'top 80%'
        },
        opacity: 0,
        scale: 0.92,
        duration: 1.1,
        ease: 'power3.out'
      });

      gsap.from('.kankotri-scroll-card', {
        scrollTrigger: {
          trigger: '.kankotri-scroll-card',
          start: 'top 82%'
        },
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out'
      });
    }
  }

})();
