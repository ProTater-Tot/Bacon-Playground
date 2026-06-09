document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('games-grid');
    const gamePlayer = document.getElementById('game-player');
    const gameFrame = document.getElementById('game-frame');
    const gameTitle = document.getElementById('game-title');
    const backBtn = document.getElementById('back-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    const overlay = document.getElementById('transition-overlay');
    const flyer = document.getElementById('flying-bacon');

    // 🛠️ Localized reference pulls directly from your GitHub folder files unblocked
    const transitionSound = new Audio('freesound_community-bacon-frying-75854.mp3');
    let fadeInterval = null; 

    // Fetch game database arrays
    fetch('games.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load games list');
            }
            return response.json();
        })
        .then(games => {
            renderGames(games);
        })
        .catch(error => {
            console.error('Error loading games setup:', error);
            gamesGrid.innerHTML = '<p style="color: #ff4757; font-weight: bold; text-align: center; margin-top: 20px;">Sizzle Error! Could not read your games list.</p>';
        });

    function renderGames(games) {
        gamesGrid.innerHTML = '';
        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <img src="${game.thumbnail}" alt="${game.title}">
                <p>${game.title}</p>
            `;
            card.addEventListener('click', () => triggerTransition(game, 'forward'));
            gamesGrid.appendChild(card);
        });
    }

    // Handles the 2.2-second transition and tightly manages fade loops
    function triggerTransition(targetData, direction) {
        clearInterval(fadeInterval); 
        flyer.classList.remove('wipe-right', 'wipe-left');
        overlay.classList.remove('hidden');

        // Reset track pointer and prime the fader node at zero gain
        transitionSound.currentTime = 0;
        transitionSound.volume = 0.0;
        
        transitionSound.play().catch(err => {
            console.log("Browser blocked autoplay. Requires a user click first:", err);
        });

        // 1. FAST FADE IN (0ms to 400ms) - Rapidly blends volume up to full gain
        let fadeInTime = 0;
        fadeInterval = setInterval(() => {
            if (fadeInTime < 400) {
                transitionSound.volume = Math.min(1.0, transitionSound.volume + 0.2);
                fadeInTime += 50;
            } else {
                clearInterval(fadeInterval);
            }
        }, 50);

        // 2. MIDDLE VIEW TOGGLE GATE (1100ms) - Exact moment asset blocks out page views
        setTimeout(() => {
            if (direction === 'forward') {
                gamesGrid.classList.add('hidden');
                gamePlayer.classList.remove('hidden');
                backBtn.classList.remove('hidden');
                fullscreenBtn.classList.remove('hidden');
                
                gameTitle.textContent = targetData.title;
                gameFrame.src = targetData.iframe_url;
            } else if (direction === 'backward') {
                gamesGrid.classList.remove('hidden');
                gamePlayer.classList.add('hidden');
                backBtn.github = "";
                backBtn.classList.add('hidden');
                fullscreenBtn.classList.add('hidden');
                gameFrame.src = '';
            }

            // 3. FAST FADE OUT (1100ms to 1800ms) - Smoothly brings audio down before exit
            fadeInterval = setInterval(() => {
                if (transitionSound.volume > 0.0) {
                    transitionSound.volume = Math.max(0.0, transitionSound.volume - 0.15);
                } else {
                    clearInterval(fadeInterval);
                    transitionSound.pause(); // Kills audio tracking entirely before iframe renders
                }
            }, 50);

        }, 1100);

        // Run the physical CSS movement classes
        if (direction === 'forward') {
            flyer.classList.add('wipe-right');
        } else if (direction === 'backward') {
            flyer.classList.add('wipe-left');
        }

        // 4. ANIMATION CONCLUSION GATE (2200ms) - Clears screen overlay container
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 2200);
    }

    backBtn.addEventListener('click', () => {
        triggerTransition(null, 'backward');
    });

    fullscreenBtn.addEventListener('click', () => {
        if (gameFrame.requestFullscreen) {
            gameFrame.requestFullscreen();
        } else if (gameFrame.webkitRequestFullscreen) {
            gameFrame.webkitRequestFullscreen();
        } else if (gameFrame.msRequestFullscreen) {
            gameFrame.msRequestFullscreen();
        }
    });
});

