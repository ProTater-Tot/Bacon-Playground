document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('games-grid');
    const gamePlayer = document.getElementById('game-player');
    const gameFrame = document.getElementById('game-frame');
    const gameTitle = document.getElementById('game-title');
    const backBtn = document.getElementById('back-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

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
        fullscreenBtn.classList.remove('hidden'); // Only reveals when a game is actively loaded
        
        gameTitle.textContent = game.title;
        gameFrame.src = game.iframe_url;
    }

    // Trigger browser Native Fullscreen mode on the game frame
    fullscreenBtn.addEventListener('click', () => {
        if (gameFrame.requestFullscreen) {
            gameFrame.requestFullscreen();
        } else if (gameFrame.webkitRequestFullscreen) { /* Safari */
            gameFrame.webkitRequestFullscreen();
        } else if (gameFrame.msRequestFullscreen) { /* IE11 */
            gameFrame.msRequestFullscreen();
        }
    });

    // Reset layout elements and kill the iframe process
    backBtn.addEventListener('click', () => {
        gamesGrid.classList.remove('hidden');
        gamePlayer.classList.add('hidden');
        backBtn.classList.add('hidden');
        fullscreenBtn.classList.add('hidden'); // Safely hides the fullscreen asset away again
        
        gameFrame.src = '';
    });
});

