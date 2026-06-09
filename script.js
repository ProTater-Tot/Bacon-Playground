document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('games-grid');
    const gamePlayer = document.getElementById('game-player');
    const gameFrame = document.getElementById('game-frame');
    const gameTitle = document.getElementById('game-title');
    const backBtn = document.getElementById('back-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn'); // New element

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
            gamesGrid.innerHTML = '<p style="color: #ff4757;">Error loading games. Make sure files are committed.</p>';
        });

    // Generate individual cards and append them to the main grid
    function renderGames(games) {
        gamesGrid.innerHTML = '';
        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <img src="${game.thumbnail}" alt="${game.title}">
                <p>${game.title}</p>
            `;
            card.addEventListener('click', () => loadGame(game));
            gamesGrid.appendChild(card);
        });
    }

    // Toggle views and load the requested game into the iframe
    function loadGame(game) {
        gamesGrid.classList.add('hidden');
        gamePlayer.classList.remove('hidden');
        backBtn.classList.remove('hidden');
        fullscreenBtn.classList.remove('hidden'); // Show fullscreen button
        
        gameTitle.textContent = game.title;
        gameFrame.src = game.iframe_url;
    }

    // Trigger true browser Fullscreen on the game frame element
    fullscreenBtn.addEventListener('click', () => {
        if (gameFrame.requestFullscreen) {
            gameFrame.requestFullscreen();
        } else if (gameFrame.webkitRequestFullscreen) { /* Safari support */
            gameFrame.webkitRequestFullscreen();
        } else if (gameFrame.msRequestFullscreen) { /* IE11 support */
            gameFrame.msRequestFullscreen();
        }
    });

    // Reset layout elements and kill the iframe process
    backBtn.addEventListener('click', () => {
        gamesGrid.classList.remove('hidden');
        gamePlayer.classList.add('hidden');
        backBtn.classList.add('hidden');
        fullscreenBtn.classList.add('hidden'); // Hide fullscreen button
        
        gameFrame.src = '';
    });
});

