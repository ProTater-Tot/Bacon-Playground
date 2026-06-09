document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('games-grid');
    const gamePlayer = document.getElementById('game-player');
    const gameFrame = document.getElementById('game-frame');
    const gameTitle = document.getElementById('game-title');
    const backBtn = document.getElementById('back-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // New Transition Elements
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

    // Handles the coordinated timed transition animation
    function triggerTransition(targetData, direction) {
        // Reset old motion classes
        flyer.classList.remove('wipe-right', 'wipe-left');
        overlay.classList.remove('hidden');

        if (direction === 'forward') {
            flyer.classList.add('wipe-right');
            
            // Midpoint trigger (600ms) - Swap data while screen is completely covered
            setTimeout(() => {
                gamesGrid.classList.add('hidden');
                gamePlayer.classList.remove('hidden');
                backBtn.classList.remove('hidden');
                fullscreenBtn.classList.remove('hidden');
                
                gameTitle.textContent = targetData.title;
                gameFrame.src = targetData.iframe_url;
            }, 600);

        } else if (direction === 'backward') {
            flyer.classList.add('wipe-left');

            // Midpoint trigger (600ms) - Hide iframe and bring back store dashboard
            setTimeout(() => {
                gamesGrid.classList.remove('hidden');
                gamePlayer.classList.add('hidden');
                backBtn.classList.add('hidden');
                fullscreenBtn.classList.add('hidden');
                gameFrame.src = '';
            }, 600);
        }

        // Full transition animation ends (1200ms) - Hide overlay layer away safely
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 1200);
    }

    // Connect Back Button to transition router
    backBtn.addEventListener('click', () => {
        triggerTransition(null, 'backward');
    });

    // Fullscreen Event Handler
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

