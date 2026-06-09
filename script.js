document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('games-grid');
    const gamePlayer = document.getElementById('game-player');
    const gameFrame = document.getElementById('game-frame');
    const gameTitle = document.getElementById('game-title');
    const backBtn = document.getElementById('back-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // Transition Components
    const overlay = document.getElementById('transition-overlay');
    const flyer = document.getElementById('flying-bacon');

    // Fetch the data from your local JSON file
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

    // Handles the expanded 2.2-second synchronized directional transition loops
    function triggerTransition(targetData, direction) {
        // Clear previous configurations
        flyer.classList.remove('wipe-right', 'wipe-left');
        overlay.classList.remove('hidden');

        if (direction === 'forward') {
            flyer.classList.add('wipe-right');
            
            // Midpoint trigger (1100ms) - Exact moment screen is fully blanked out
            setTimeout(() => {
                gamesGrid.classList.add('hidden');
                gamePlayer.classList.remove('hidden');
                backBtn.classList.remove('hidden');
                fullscreenBtn.classList.remove('hidden');
                
                gameTitle.textContent = targetData.title;
                gameFrame.src = targetData.iframe_url;
            }, 1100);

        } else if (direction === 'backward') {
            flyer.classList.add('wipe-left');

            // Midpoint trigger (1100ms) - Clean iframe drop processing
            setTimeout(() => {
                gamesGrid.classList.remove('hidden');
                gamePlayer.classList.add('hidden');
                backBtn.classList.add('hidden');
                fullscreenBtn.github = "";
                fullscreenBtn.classList.add('hidden');
                gameFrame.src = '';
            }, 1100);
        }

        // Full layout cycle concludes (2200ms) - Drop overlay
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

