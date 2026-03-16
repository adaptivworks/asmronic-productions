// ── Album definitions ──
const albums = [
  {
    id: 'havoc',
    tracks: [
      { name: 'IN',              display: 'IN',                           file: 'albums/havoc/01 IN.mp3',                  duration: '1:05' },
      { name: 'HAVOC',           display: 'HAVOC',                        file: 'albums/havoc/02 HAVOC.mp3',               duration: '2:42' },
      { name: 'DAFNE',           display: 'DAFNE',                        file: 'albums/havoc/03 DAFNE.mp3',               duration: '2:42' },
      { name: 'WIPERS - Int.',   display: 'WIPERS\u2002-\u2002\u2002\u2002Int.',  file: 'albums/havoc/04 WIPERS - Int..mp3',  duration: '0:32' },
      { name: 'UNEVEN',          display: 'UNEVEN',                       file: 'albums/havoc/05 UNEVEN.mp3',              duration: '2:43' },
      { name: 'ANTICS',          display: 'ANTICS',                       file: 'albums/havoc/06 ANTICS.mp3',              duration: '3:15' },
      { name: 'DRUNKEN BAKER',   display: 'DRUNKEN\u2002\u2002\u2002BAKER',      file: 'albums/havoc/07 DRUNKEN BAKER.mp3',  duration: '1:38' },
      { name: 'HALVED',          display: 'HALVED',                       file: 'albums/havoc/08 HALVED.mp3',              duration: '0:34' },
      { name: 'AMBIEN',          display: 'AMBIEN',                       file: 'albums/havoc/09 AMBIEN.mp3',              duration: '2:51' },
      { name: 'CHASE',           display: 'CHASE',                        file: 'albums/havoc/10 CHASE.mp3',               duration: '2:10' },
      { name: 'OUT - Int.',      display: 'OUT\u2002-\u2002\u2002\u2002Int.',     file: 'albums/havoc/11 OUT - Int..mp3',     duration: '0:32' },
      { name: 'ASIA',            display: 'ASIA',                         file: 'albums/havoc/12 ASIA.mp3',                duration: '3:16' },
    ],
    videoRate: 0.6,
  },
  {
    id: 'hunted-by-nothing',
    tracks: [
      { name: 'ONE PLACE',         display: 'ONE PLACE',                            file: 'albums/hunted-by-nothing/01 One place.mp3',            duration: '1:27', ytId: 'mUEOipHmBjY', ytStart: 3, ytRate: 0.8 },
      { name: 'HUNTED BY NOTHING', display: 'HUNTED\u2002BY\u2002\u2002\u2002NOTHING',  file: 'albums/hunted-by-nothing/02 Hunted by nothing.mp3',    duration: '3:48', ytId: 'mUEOipHmBjY', ytStart: 460 },
      { name: 'SEMANTICS',         display: 'SEMANTICS',                            file: 'albums/hunted-by-nothing/03 Semantics.mp3',             duration: '2:43', ytId: 'QI2IlA3ztIo', ytStart: 179 },
      { name: 'TAD',               display: 'TAD',                                  file: 'albums/hunted-by-nothing/04 Tad.mp3',                   duration: '1:05', ytId: '4rBPgGWW0VA', ytStart: 106 },
      { name: 'THICK OF IT',       display: 'THICK\u2002OF\u2002\u2002\u2002IT',        file: 'albums/hunted-by-nothing/05 Thick Of It.mp3',           duration: '3:15', ytId: 'OacVy8_nJi0', ytStart: 7 },
      { name: 'HOLDING THE LINE',  display: 'HOLDING\u2002THE\u2002\u2002\u2002LINE',   file: 'albums/hunted-by-nothing/06 Holding the line.mp3',      duration: '2:10', ytId: '4rBPgGWW0VA', ytStart: 12 },
    ],
    videoRate: 0.42,
  },
  {
    id: 'indian-bites',
    tracks: [
      { name: 'में',              display: 'में',                                    file: 'albums/indian-bites/0_में.mp3',                  duration: '1:59' },
      { name: 'CHALO ft. Skhema', display: 'CHALO\u2002ft.\u2002\u2002\u2002Skhema',  file: 'albums/indian-bites/01_CHALO ft.Skhema.mp3',    duration: '2:08' },
      { name: 'GUTKA',            display: 'GUTKA',                                  file: 'albums/indian-bites/03_GUTKA.mp3',              duration: '2:10' },
      { name: 'HERO',             display: 'HERO',                                   file: 'albums/indian-bites/04_HERO.mp3',               duration: '2:06' },
      { name: 'RAVI',             display: 'RAVI',                                   file: 'albums/indian-bites/05_RAVI.mp3',               duration: '2:14' },
      { name: 'INDIGO',           display: 'INDIGO',                                 file: 'albums/indian-bites/06_INDIGO.mp3',             duration: '1:38' },
    ],
    videoRate: 0.5,
  }
];

// ── DOM refs ──
const audio = document.getElementById('audio');
const barFill = document.querySelector('.bar__fill');
const bar = document.querySelector('.bar');
const cursor = document.querySelector('.custom-cursor');
const scrollContainer = document.querySelector('.scroll-container');
const sections = document.querySelectorAll('.album-section');

// ── State ──
let activeAlbum = 0;
let currentIndex = -1;
let isPlaying = false;
let hoveredIndex = -1;
let isTransitioning = false;
let isYtActive = false;
let ytPlayer;

// ── YouTube API ──
const SKHEMA_ALBUM_INDEX = 1;
const toggleYtBtn = document.querySelector('.toggle-youtube');
const skhemaSection = sections[SKHEMA_ALBUM_INDEX];

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-bg-player', {
    playerVars: {
      autoplay: 0,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      loop: 1,
      fs: 0,
      autohide: 0
    },
    events: {
      onReady: function(event) {
        event.target.mute();
      },
      onStateChange: function(event) {
        if (event.data === YT.PlayerState.ENDED) {
          ytPlayer.playVideo();
        }
        if (event.data === YT.PlayerState.PLAYING && currentIndex !== -1 && activeAlbum === SKHEMA_ALBUM_INDEX) {
          const rate = albums[SKHEMA_ALBUM_INDEX].tracks[currentIndex].ytRate || 1.0;
          event.target.setPlaybackRate(rate);
        }
      }
    }
  });
};

// ── YouTube Toggle ──
if (toggleYtBtn) {
  toggleYtBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isYtActive = !isYtActive;
    toggleYtBtn.classList.toggle('is-active', isYtActive);

    if (isYtActive) {
      skhemaSection.classList.add('album-section--youtube-active');
      const bgVideo = skhemaSection.querySelector('.album-section__bg-video');
      if (bgVideo) bgVideo.pause();

      if (activeAlbum === SKHEMA_ALBUM_INDEX && currentIndex !== -1 && ytPlayer && ytPlayer.loadVideoById) {
        const t = albums[SKHEMA_ALBUM_INDEX].tracks[currentIndex];
        ytPlayer.loadVideoById({ videoId: t.ytId, startSeconds: t.ytStart });
        if (isPlaying) ytPlayer.playVideo();
      }
    } else {
      skhemaSection.classList.remove('album-section--youtube-active');
      if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
      if (isPlaying && activeAlbum === SKHEMA_ALBUM_INDEX) {
        const bgVideo = skhemaSection.querySelector('.album-section__bg-video');
        if (bgVideo) bgVideo.play();
      }
    }
  });
}

// ── Scramble ──
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*_`"\'.:;/\\|';
const SCRAMBLE_INTERVAL = 94;
let scrambleTimer = null;

function getTrackEls(albumIdx) {
  return sections[albumIdx].querySelectorAll('.album-section__track');
}

function scrambleTick() {
  sections.forEach((section, albumIdx) => {
    const trackEls = getTrackEls(albumIdx);
    const tracks = albums[albumIdx].tracks;
    trackEls.forEach((el, i) => {
      // Skip active track of active album, and hovered track
      if (albumIdx === activeAlbum && (i === currentIndex || i === hoveredIndex)) return;
      const nameEl = el.querySelector('.album-section__track-name');
      const original = tracks[i].display;
      let scrambled = '';
      for (let c = 0; c < original.length; c++) {
        const ch = original[c];
        if (ch === ' ' || ch === '\u2002') {
          scrambled += ch;
        } else {
          scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      nameEl.textContent = scrambled;
    });
  });
}

function startScramble() {
  if (scrambleTimer) return;
  scrambleTimer = setInterval(scrambleTick, SCRAMBLE_INTERVAL);
  scrambleTick();
}

function stopScramble() {
  if (scrambleTimer) {
    clearInterval(scrambleTimer);
    scrambleTimer = null;
  }
  sections.forEach((section, albumIdx) => {
    const trackEls = getTrackEls(albumIdx);
    const tracks = albums[albumIdx].tracks;
    trackEls.forEach((el, i) => {
      el.querySelector('.album-section__track-name').textContent = tracks[i].display;
    });
  });
}

// Lock tracklist widths
sections.forEach((section) => {
  const tl = section.querySelector('.album-section__tracklist');
  if (tl) tl.style.width = tl.offsetWidth + 'px';
});

startScramble();

// ── Set video playback rates ──
sections.forEach((section, idx) => {
  const video = section.querySelector('.album-section__bg-video');
  if (video) video.playbackRate = albums[idx].videoRate;
});

// ── Track management ──
function loadTrack(albumIdx, trackIdx) {
  // If switching albums, reset previous
  if (albumIdx !== activeAlbum && currentIndex !== -1) {
    clearActiveTrack(activeAlbum);
  }
  activeAlbum = albumIdx;
  currentIndex = trackIdx;
  audio.src = albums[albumIdx].tracks[trackIdx].file;
  updateActiveTrack();

  // Sync YouTube video if active and on Skhema
  if (isYtActive && albumIdx === SKHEMA_ALBUM_INDEX && ytPlayer && ytPlayer.loadVideoById) {
    const t = albums[SKHEMA_ALBUM_INDEX].tracks[trackIdx];
    ytPlayer.loadVideoById({ videoId: t.ytId, startSeconds: t.ytStart });
  }
}

function clearActiveTrack(albumIdx) {
  const trackEls = getTrackEls(albumIdx);
  const tracks = albums[albumIdx].tracks;
  trackEls.forEach((el, i) => {
    el.classList.remove('album-section__track--active');
    const marker = el.querySelector('.album-section__track-marker');
    if (marker) marker.textContent = '';
    const durationEl = el.querySelector('.album-section__track-duration');
    if (durationEl) durationEl.textContent = tracks[i].duration;
  });
}

function updateActiveTrack() {
  // Clear all sections first
  sections.forEach((s, idx) => {
    if (idx !== activeAlbum) clearActiveTrack(idx);
  });

  const trackEls = getTrackEls(activeAlbum);
  const tracks = albums[activeAlbum].tracks;

  trackEls.forEach((el, i) => {
    const isActive = i === currentIndex;
    el.classList.toggle('album-section__track--active', isActive);

    const marker = el.querySelector('.album-section__track-marker');
    if (marker) marker.textContent = isActive ? '+' : '';

    if (isActive) {
      el.querySelector('.album-section__track-name').textContent = tracks[i].display;
    } else {
      const durationEl = el.querySelector('.album-section__track-duration');
      if (durationEl) durationEl.textContent = tracks[i].duration;
    }
  });
}

// ── Playback ──
function play() {
  audio.play();
  isPlaying = true;
  if (!isYtActive || activeAlbum !== SKHEMA_ALBUM_INDEX) {
    const video = sections[activeAlbum].querySelector('.album-section__bg-video');
    if (video) video.play();
  } else if (isYtActive && ytPlayer && ytPlayer.playVideo) {
    ytPlayer.playVideo();
  }
  updateCursorState();
}

function pause() {
  audio.pause();
  isPlaying = false;
  sections.forEach((s) => {
    const v = s.querySelector('.album-section__bg-video');
    if (v) v.pause();
  });
  if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
  updateCursorState();
}

function togglePlay() {
  if (isPlaying) pause();
  else play();
}

// ── Cursor ──
function updateCursorState() {
  if (!cursor) return;
  cursor.classList.toggle('custom-cursor--paused', !isPlaying);
}

document.addEventListener('mousemove', (e) => {
  if (!cursor) return;
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ── Dot cursor on artwork and tracks ──
document.querySelectorAll('.album-section__artwork').forEach((artwork) => {
  artwork.addEventListener('mouseenter', () => {
    if (cursor) cursor.classList.add('custom-cursor--dot');
  });
  artwork.addEventListener('mouseleave', () => {
    if (cursor) cursor.classList.remove('custom-cursor--dot');
  });
});

sections.forEach((section, albumIdx) => {
  const trackEls = getTrackEls(albumIdx);
  trackEls.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('custom-cursor--dot');
      const idx = parseInt(el.dataset.index, 10);
      hoveredIndex = idx;
      el.querySelector('.album-section__track-name').textContent = albums[albumIdx].tracks[idx].display;
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('custom-cursor--dot');
      hoveredIndex = -1;
    });
  });
});

// ── Cover lightbox ──
const lightbox = document.getElementById('cover-lightbox');
const lightboxImg = document.getElementById('cover-lightbox-img');

document.querySelectorAll('.album-section__artwork').forEach((artwork) => {
  artwork.addEventListener('click', (e) => {
    e.stopPropagation();
    const img = artwork.querySelector('.album-section__artwork-img');
    if (img) {
      lightboxImg.src = img.src;
      lightbox.classList.add('is-open');
    }
  });
});

lightbox.addEventListener('click', () => {
  lightbox.classList.remove('is-open');
});

// ── Click on section (play/pause) ──
sections.forEach((section, albumIdx) => {
  section.addEventListener('click', (e) => {
    if (e.target.closest('.album-section__track') || e.target.closest('.bar') || e.target.closest('.toggle-youtube') || e.target.closest('.album-section__artwork')) return;

    if (activeAlbum !== albumIdx || currentIndex === -1 || !audio.src || audio.src === window.location.href) {
      loadTrack(albumIdx, 0);
      play();
    } else {
      togglePlay();
    }
  });
});

// ── Click on track ──
sections.forEach((section, albumIdx) => {
  const trackEls = getTrackEls(albumIdx);
  trackEls.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(el.dataset.index, 10);
      loadTrack(albumIdx, index);
      play();
    });
  });
});

// ── Time formatting ──
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// ── Progress bar ──
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    barFill.style.width = pct + '%';

    if (currentIndex !== -1) {
      const trackEls = getTrackEls(activeAlbum);
      const activeTrackEl = trackEls[currentIndex];
      const durationEl = activeTrackEl.querySelector('.album-section__track-duration');
      if (durationEl) {
        const remaining = Math.max(0, audio.duration - audio.currentTime);
        durationEl.textContent = formatTime(remaining);
      }
    }
  }
});

// ── Seek bar ──
bar.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!audio.duration) return;
  const rect = bar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

// ── Auto-advance ──
audio.addEventListener('ended', () => {
  const tracks = albums[activeAlbum].tracks;
  if (currentIndex < tracks.length - 1) {
    loadTrack(activeAlbum, currentIndex + 1);
    play();
  } else {
    // Album finished — reset
    loadTrack(activeAlbum, 0);
    barFill.style.width = '0%';
    isPlaying = false;
    updateCursorState();
  }
});

// ── Scroll-based album switching ──
let lastScrollTop = 0;
scrollContainer.addEventListener('scroll', () => {
  const scrollTop = scrollContainer.scrollTop;
  const viewHeight = window.innerHeight;

  // Pause immediately when user starts scrolling away
  if (Math.abs(scrollTop - lastScrollTop) > 10 && isPlaying) {
    pause();
  }
  lastScrollTop = scrollTop;

  const newAlbum = Math.round(scrollTop / viewHeight);

  if (newAlbum !== activeAlbum && newAlbum >= 0 && newAlbum < albums.length) {
    // Stop and reset current album
    if (isPlaying) pause();
    if (currentIndex !== -1) clearActiveTrack(activeAlbum);

    // Deactivate YouTube if leaving Skhema
    if (activeAlbum === SKHEMA_ALBUM_INDEX && isYtActive) {
      isYtActive = false;
      toggleYtBtn.classList.remove('is-active');
      skhemaSection.classList.remove('album-section--youtube-active');
      if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
    }

    activeAlbum = newAlbum;
    currentIndex = -1;
    barFill.style.width = '0%';
    audio.src = '';
  }
});

// ── Keyboard controls ──
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!audio.src || audio.src === window.location.href) {
      loadTrack(activeAlbum, 0);
      play();
    } else {
      togglePlay();
    }
  }
  if (e.code === 'ArrowRight') {
    e.preventDefault();
    const tracks = albums[activeAlbum].tracks;
    if (currentIndex < tracks.length - 1) {
      loadTrack(activeAlbum, currentIndex + 1);
      play();
    }
  }
  if (e.code === 'ArrowLeft') {
    e.preventDefault();
    if (currentIndex > 0) {
      loadTrack(activeAlbum, currentIndex - 1);
      play();
    }
  }
  if (e.code === 'ArrowDown') {
    e.preventDefault();
    if (activeAlbum < albums.length - 1) {
      scrollContainer.scrollTo({
        top: (activeAlbum + 1) * window.innerHeight,
        behavior: 'smooth'
      });
    }
  }
  if (e.code === 'ArrowUp') {
    e.preventDefault();
    if (activeAlbum > 0) {
      scrollContainer.scrollTo({
        top: (activeAlbum - 1) * window.innerHeight,
        behavior: 'smooth'
      });
    }
  }
});

// ── Hash-based album navigation (from homepage) ──
if (window.location.hash) {
  const albumIdx = parseInt(window.location.hash.slice(1), 10);
  if (!isNaN(albumIdx) && albumIdx >= 0 && albumIdx < albums.length) {
    activeAlbum = albumIdx;
    scrollContainer.scrollTo({ top: albumIdx * window.innerHeight, behavior: 'instant' });
  }
}

