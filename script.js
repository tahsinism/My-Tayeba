/**
 * ================================================================
 * KAWAII ROMANTIC PROPOSAL - SCRIPT.JS
 * Complete interactive logic, Web Audio synthesizer, custom animations,
 * particle systems, and responsive touch controls.
 * ================================================================
 */

function initApp() {
  // --------------------------------------------------------------
  // 1. STATE & CONSTANTS
  // --------------------------------------------------------------
  let noClickCount = 0;
  let isAudioPlaying = true;
  let audioContext = null;
  let musicInterval = null;
  let isRunawayActive = false;
  let isCelebrated = false;

  // NO Button Message List
  const noMessages = [
    "Are you sure, Tayeba? 🥺",
    "Really, Tayeba?",
    "Think again, my heart...",
    "Please Tayeba...",
    "Don't do this...",
    "I can cook for you 🍜",
    "I'll buy you ice cream 🍦",
    "You're breaking my heart 💔",
    "Please Tayeba...",
    "Pretty please, Tayeba?",
    "I promise I'll make you smile.",
    "Don't leave me hanging, Tayeba.",
    "Still no?",
    "You clicked NO again 😭",
    "You know you want YES 😌",
    "Tayeba, stop bullying me 😂",
    "Tayeba, you're too cute to say no.",
    "I won't give up on Tayeba!",
    "One more chance, my heart?",
    "Final answer, Tayeba?",
    "Last warning Tayeba 😤❤️"
  ];

  // YES Scale Progression Steps
  const yesScales = [
    1, 1.15, 1.35, 1.6, 2.0, 2.6, 3.2, 4.0, 5.0, 6.2, 7.5, 9.0, 11.0
  ];

  // DOM Element References
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const noMsgText = document.getElementById('no-msg-text');
  const audioBtn = document.getElementById('audio-btn');
  const audioStatus = document.getElementById('audio-status');
  const kittenContainer = document.getElementById('kitten-container');
  const kittenSvg = document.getElementById('kitten-svg');
  const successModal = document.getElementById('success-modal');
  const btnHug = document.getElementById('btn-hug');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const hugBanner = document.getElementById('hug-banner');
  const bgContainer = document.getElementById('bg-container');
  const particleCanvas = document.getElementById('particle-canvas');
  const cursorCanvas = document.getElementById('cursor-canvas');

  // Setup Canvases
  const pCtx = particleCanvas.getContext('2d');
  const cCtx = cursorCanvas.getContext('2d');

  function resizeCanvases() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
  }
  resizeCanvases();
  window.addEventListener('resize', resizeCanvases);

  // --------------------------------------------------------------
  // 2. WEB AUDIO SYNTHESIZER (LO-FI MELODY & SOUND EFFECTS)
  // --------------------------------------------------------------
  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  // Cute Pop / Click Sound FX
  function playPopSound(freq = 520, duration = 0.1) {
    initAudioContext();
    if (!audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, audioContext.currentTime + duration);

    gain.gain.setValueAtTime(0.15, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
  }

  // Purr / Meow Sound FX for Kitten
  function playKittenSound() {
    initAudioContext();
    if (!audioContext) return;

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.35);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(now + 0.35);
  }

  // Victory Celebration Chime
  function playVictorySound() {
    initAudioContext();
    if (!audioContext) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const now = audioContext.currentTime + idx * 0.12;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    });
  }

  // Procedural Romantic Synthesizer Melody Loop (Increased Volume & Sweet Romantic Tune)
  function startLoFiMusic() {
    initAudioContext();
    if (!audioContext) return;
    if (musicInterval) return; // Prevent duplicate loops

    // Sweet romantic melody sequence (Notes in Hz: E5, G5, A5, C6, B5, G5, E5, D5, C5...)
    const romanticMelody = [
      { melody: 659.25, bass: 261.63 }, // E5, C4
      { melody: 783.99, bass: 329.63 }, // G5, E4
      { melody: 880.00, bass: 392.00 }, // A5, G4
      { melody: 1046.50, bass: 523.25 },// C6, C5
      { melody: 987.77, bass: 220.00 }, // B5, A3
      { melody: 880.00, bass: 261.63 }, // A5, C4
      { melody: 783.99, bass: 329.63 }, // G5, E4
      { melody: 659.25, bass: 440.00 }, // E5, A4
      { melody: 698.46, bass: 174.61 }, // F5, F3
      { melody: 783.99, bass: 261.63 }, // G5, C4
      { melody: 880.00, bass: 349.23 }, // A5, F4
      { melody: 1046.50, bass: 440.00 },// C6, A4
      { melody: 987.77, bass: 196.00 }, // B5, G3
      { melody: 783.99, bass: 246.94 }, // G5, B3
      { melody: 659.25, bass: 293.66 }, // E5, D4
      { melody: 587.33, bass: 392.00 }  // D5, G4
    ];

    let step = 0;

    musicInterval = setInterval(() => {
      if (!isAudioPlaying) return;

      const now = audioContext.currentTime;
      const currentStep = romanticMelody[step % romanticMelody.length];

      // Play Melody Note (High register, rich bell/piano sine+triangle synth with high volume)
      const mOsc1 = audioContext.createOscillator();
      const mOsc2 = audioContext.createOscillator();
      const mGain = audioContext.createGain();

      mOsc1.type = 'sine';
      mOsc2.type = 'triangle';

      mOsc1.frequency.setValueAtTime(currentStep.melody, now);
      mOsc2.frequency.setValueAtTime(currentStep.melody * 1.002, now); // subtle warmth chorus

      // Increased volume (0.28 peak gain)
      mGain.gain.setValueAtTime(0.28, now);
      mGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      mOsc1.connect(mGain);
      mOsc2.connect(mGain);
      mGain.connect(audioContext.destination);

      mOsc1.start(now);
      mOsc2.start(now);
      mOsc1.stop(now + 0.85);
      mOsc2.stop(now + 0.85);

      // Play Soft Bass/Harmony Support Note
      if (step % 2 === 0) {
        const bOsc = audioContext.createOscillator();
        const bGain = audioContext.createGain();

        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(currentStep.bass, now);

        bGain.gain.setValueAtTime(0.18, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        bOsc.connect(bGain);
        bGain.connect(audioContext.destination);

        bOsc.start(now);
        bOsc.stop(now + 0.9);
      }

      step++;
    }, 420);
  }

  function stopLoFiMusic() {
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  }

  // Audio Toggle Button Event
  audioBtn.style.borderColor = "#FF2E92";
  
  audioBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent global interaction trigger loop
    initAudioContext();
    isAudioPlaying = !isAudioPlaying;

    if (isAudioPlaying) {
      audioStatus.innerText = "Music: ON 💕";
      audioBtn.style.borderColor = "#FF2E92";
      startLoFiMusic();
      playPopSound(600);
    } else {
      audioStatus.innerText = "Music: OFF";
      audioBtn.style.borderColor = "var(--btn-pink)";
      stopLoFiMusic();
      playPopSound(350);
    }
  });

  // Auto-Start Music on First User Gesture (Bypasses Browser Autoplay Lock)
  function handleFirstUserInteraction() {
    if (isAudioPlaying) {
      initAudioContext();
      startLoFiMusic();
    }
    window.removeEventListener('pointerdown', handleFirstUserInteraction);
    window.removeEventListener('touchstart', handleFirstUserInteraction);
    window.removeEventListener('click', handleFirstUserInteraction);
    window.removeEventListener('keydown', handleFirstUserInteraction);
  }

  window.addEventListener('pointerdown', handleFirstUserInteraction, { once: true });
  window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });
  window.addEventListener('click', handleFirstUserInteraction, { once: true });
  window.addEventListener('keydown', handleFirstUserInteraction, { once: true });

  // --------------------------------------------------------------
  // 3. CURSOR TRAIL & PARALLAX EFFECT
  // --------------------------------------------------------------
  const cursorParticles = [];
  const heartPath = new Path2D('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');

  window.addEventListener('mousemove', (e) => {
    // Parallax background movement
    const moveX = (e.clientX - window.innerWidth / 2) * 0.015;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.015;

    document.querySelectorAll('.parallax-layer').forEach((layer, idx) => {
      const speed = (idx + 1) * 0.4;
      layer.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
    });

    // Spawn tiny heart particles on cursor move
    if (Math.random() < 0.4) {
      cursorParticles.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 6,
        alpha: 1,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.5 - 0.5,
        color: Math.random() > 0.5 ? '#FF2E92' : '#FF85C0'
      });
    }

    // Check runaway NO button proximity if runaway active
    if (isRunawayActive && !isCelebrated) {
      const rect = btnNo.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
      if (dist < 100) {
        moveNoButton();
      }
    }
  });

  // Draw Cursor Trail Frame
  function animateCursorTrail() {
    cCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    for (let i = cursorParticles.length - 1; i >= 0; i--) {
      const p = cursorParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;

      if (p.alpha <= 0) {
        cursorParticles.splice(i, 1);
        continue;
      }

      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.scale(p.size / 24, p.size / 24);
      cCtx.fillStyle = p.color;
      cCtx.globalAlpha = p.alpha;
      cCtx.fill(heartPath);
      cCtx.restore();
    }

    requestAnimationFrame(animateCursorTrail);
  }
  animateCursorTrail();

  // --------------------------------------------------------------
  // 4. MAIN INTERACTION (NO BUTTON & YES GROWTH)
  // --------------------------------------------------------------
  btnNo.addEventListener('click', (e) => {
    e.stopPropagation();
    noClickCount++;

    playPopSound(400 - Math.min(noClickCount * 10, 200));

    // Update Message
    const msgIndex = Math.min(noClickCount - 1, noMessages.length - 1);
    const selectedMsg = noClickCount <= noMessages.length 
      ? noMessages[msgIndex] 
      : noMessages[Math.floor(Math.random() * noMessages.length)];

    // Smooth message fade-in
    noMsgText.classList.add('fade-out');
    setTimeout(() => {
      noMsgText.innerText = selectedMsg;
      noMsgText.classList.remove('fade-out');
      noMsgText.classList.add('fade-in');
      setTimeout(() => noMsgText.classList.remove('fade-in'), 300);
    }, 150);

    // Scale YES Button
    const scale = noClickCount < yesScales.length ? yesScales[noClickCount] : yesScales[yesScales.length - 1] + (noClickCount - yesScales.length) * 1.5;
    btnYes.style.transform = `scale(${scale})`;

    // Around 12 clicks, make YES take huge prominence
    if (noClickCount >= 12) {
      btnYes.style.width = '100%';
      btnYes.style.maxWidth = '360px';
    }

    // After 20 clicks, enable runaway mode
    if (noClickCount >= 20 && !isRunawayActive) {
      isRunawayActive = true;
      btnNo.classList.add('runaway');
      moveNoButton();
    } else if (isRunawayActive) {
      moveNoButton();
    }
  });

  // Move NO Button to Random Viewport Position (Mobile-friendly safe bounds)
  function moveNoButton() {
    const padX = Math.min(24, window.innerWidth * 0.05);
    const padY = Math.min(60, window.innerHeight * 0.1);
    const viewWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const viewHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const btnWidth = btnNo.offsetWidth || 90;
    const btnHeight = btnNo.offsetHeight || 44;

    const maxX = Math.max(padX, viewWidth - btnWidth - padX);
    const maxY = Math.max(padY, viewHeight - btnHeight - padY);

    const randomX = Math.floor(padX + Math.random() * Math.max(1, maxX - padX));
    const randomY = Math.floor(padY + Math.random() * Math.max(1, maxY - padY));

    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
  }

  // Touch device runaway support
  btnNo.addEventListener('touchstart', (e) => {
    if (isRunawayActive) {
      e.preventDefault();
      moveNoButton();
      playPopSound(300);
    }
  }, { passive: false });

  // --------------------------------------------------------------
  // 5. KITTEN INTERACTION
  // --------------------------------------------------------------
  kittenContainer.addEventListener('click', () => {
    playKittenSound();
    
    // Add bounce animation
    kittenSvg.classList.remove('kitten-bounce');
    void kittenSvg.offsetWidth; // Trigger reflow
    kittenSvg.classList.add('kitten-bounce');

    // Spawn floating heart above kitten
    spawnHeartAboveKitten();
  });

  function spawnHeartAboveKitten() {
    const rect = kittenContainer.getBoundingClientRect();
    const heart = document.createElement('div');
    heart.innerText = '💖';
    heart.style.position = 'fixed';
    heart.style.left = `${rect.left + rect.width / 2 - 12}px`;
    heart.style.top = `${rect.top}px`;
    heart.style.fontSize = '24px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '999';
    heart.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = 'translateY(-50px) scale(1.3)';
      heart.style.opacity = '0';
    });

    setTimeout(() => heart.remove(), 850);
  }

  // --------------------------------------------------------------
  // 6. CELEBRATION & YES CLICK LOGIC
  // --------------------------------------------------------------
  btnYes.addEventListener('click', () => {
    if (isCelebrated) return;
    isCelebrated = true;

    playVictorySound();
    playPopSound(700);

    // Brighter festive background
    bgContainer.classList.add('celebrate-bg');

    // Kitten jumps for joy
    kittenSvg.classList.add('kitten-bounce');

    // Launch Particle Burst
    launchCelebrationParticles();

    // Show Success Popup Modal after short delay
    setTimeout(() => {
      successModal.classList.add('active');
    }, 500);
  });

  // Particle System
  const celebrationParticles = [];

  function launchCelebrationParticles() {
    const count = 120;
    const colors = ['#FF2E92', '#FF85C0', '#FFD6EC', '#FFD700', '#FFFFFF', '#FF60B2'];

    for (let i = 0; i < count; i++) {
      celebrationParticles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        size: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        gravity: 0.25,
        alpha: 1,
        type: Math.random() > 0.4 ? 'heart' : 'circle'
      });
    }

    animateParticles();
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    for (let i = celebrationParticles.length - 1; i >= 0; i--) {
      const p = celebrationParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= 0.008;

      if (p.alpha <= 0) {
        celebrationParticles.splice(i, 1);
        continue;
      }

      pCtx.save();
      pCtx.translate(p.x, p.y);
      pCtx.globalAlpha = p.alpha;
      pCtx.fillStyle = p.color;

      if (p.type === 'heart') {
        pCtx.scale(p.size / 24, p.size / 24);
        pCtx.fill(heartPath);
      } else {
        pCtx.beginPath();
        pCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        pCtx.fill();
      }

      pCtx.restore();
    }

    if (celebrationParticles.length > 0) {
      requestAnimationFrame(animateParticles);
    }
  }

  // --------------------------------------------------------------
  // 7. SUCCESS POPUP & HUG INTERACTION
  // --------------------------------------------------------------
  btnHug.addEventListener('click', () => {
    playPopSound(800);
    playVictorySound();

    // Close modal
    successModal.classList.remove('active');

    // Show big animated "I LOVE YOU ❤️" banner
    hugBanner.classList.add('active');

    // Continuous floating hearts waterfall
    const heartWaterfall = setInterval(() => {
      const heart = document.createElement('div');
      heart.innerText = ['❤️', '💖', '💕', '🌸', '✨'][Math.floor(Math.random() * 5)];
      heart.style.position = 'fixed';
      heart.style.left = `${Math.random() * window.innerWidth}px`;
      heart.style.bottom = '-30px';
      heart.style.fontSize = `${Math.random() * 20 + 20}px`;
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '850';
      heart.style.transition = 'transform 3.5s linear, opacity 3.5s ease-out';
      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.transform = `translateY(-${window.innerHeight + 80}px) rotate(${Math.random() * 360}deg)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 3600);
    }, 150);

    // Stop waterfall after 10 seconds
    setTimeout(() => clearInterval(heartWaterfall), 10000);
  });

  btnCloseModal.addEventListener('click', () => {
    playPopSound(300);
    successModal.classList.remove('active');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
