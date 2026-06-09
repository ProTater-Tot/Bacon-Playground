document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('games-grid');
    const gamePlayer = document.getElementById('game-player');
    const gameFrame = document.getElementById('game-frame');
    const gameTitle = document.getElementById('game-title');
    const backBtn = document.getElementById('back-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    const overlay = document.getElementById('transition-overlay');
    const flyer = document.getElementById('flying-bacon');

    // 🛠️ PLACE YOUR LONG CUSTOM AUDIO LINK INSIDE THE QUOTES BELOW
    const transitionSound = new Audio('Sound Effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=75854">freesound_community</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=75854">Pixabay</a>');
    let fadeInterval = null; // Keeps track of audio fade processing loops

    // Fetch game data mapping arrays
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

    // Handles coordinated view toggles, image swaps, and audio volume cross-fades
    function triggerTransition(targetData, direction) {
        clearInterval(fadeInterval); // Halt any conflicting audio fade timers running in background
        flyer.classList.remove('wipe-right', 'wipe-left');
        overlay.classList.remove('hidden');

        // Reset track pointer and prime the fader node at zero gain
        transitionSound.currentTime = 0;
        transitionSound.volume = 0.0;
        
        transitionSound.play().catch(err => {
            console.log("Browser blocked autoplay. Requires a user click first:", err);
        });

        // 1. FADE IN LOOP (0ms to 600ms) - Gradually moves volume up to full gain
        let fadeInTime = 0;
        fadeInterval = setInterval(() => {
            if (fadeInTime < 600) {
                transitionSound.volume = Math.min(1.0, transitionSound.volume + 0.15);
                fadeInTime += 50;
            } else {
                clearInterval(fadeInterval);
            }
        }, 50);

        // 2. MIDDLE VIEW TOGGLE GATE (1100ms) - Swaps HTML contents behind giant asset
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
                backBtn.classList.add('hidden');
                fullscreenBtn.classList.add('hidden');
                gameFrame.src = '';
            }

            // 3. FADE OUT LOOP (Starts immediately after midpoint as bacon slides away)
            fadeInterval = setInterval(() => {
                if (transitionSound.volume > 0.0) {
                    transitionSound.volume = Math.max(0.0, transitionSound.volume - 0.1);
                } else {
                    clearInterval(fadeInterval);
                    transitionSound.pause(); // Stops track playback tracking completely
                }
            }, 60);

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

