const API_BASE = '/api';

function createTile(activity, isClicked) {
    const tile = document.createElement('div');
    tile.className = 'tile admin-tile';
    if (isClicked) {
        tile.classList.add('clicked');
    }
    tile.textContent = activity;
    return tile;
}

function renderGrid(tilesOrder, clickedTiles) {
    const grid = document.getElementById('adminBingoGrid');
    grid.innerHTML = '';

    tilesOrder.forEach((activity) => {
        const tile = createTile(activity, clickedTiles.includes(activity));
        grid.appendChild(tile);
    });
}

async function fetchUsers() {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) {
        throw new Error('Could not load users');
    }
    const data = await response.json();
    return data.users || [];
}

function fillDropdown(users) {
    const select = document.getElementById('userSelect');
    users.forEach((user) => {
        const option = document.createElement('option');
        option.value = user.name;
        option.textContent = user.name;
        select.appendChild(option);
    });
}

async function loadUserBingo(playerName) {
    const status = document.getElementById('adminStatus');
    if (!playerName) {
        status.textContent = 'Pick a name to view that bingo board.';
        document.getElementById('adminBingoGrid').innerHTML = '';
        return;
    }

    status.textContent = `Loading ${playerName}...`;

    try {
        const response = await fetch(`${API_BASE}/load/${encodeURIComponent(playerName)}`);
        if (!response.ok) {
            throw new Error('User bingo not found');
        }
        const data = await response.json();
        const tilesOrder = Array.isArray(data.tilesOrder) ? data.tilesOrder : [];
        const clickedTiles = Array.isArray(data.clickedTiles) ? data.clickedTiles : [];

        renderGrid(tilesOrder, clickedTiles);
        status.textContent = `Showing bingo for ${playerName}.`;
    } catch (error) {
        status.textContent = `Could not load bingo for ${playerName}.`;
        document.getElementById('adminBingoGrid').innerHTML = '';
    }
}

async function initializeAdminPage() {
    const status = document.getElementById('adminStatus');
    const select = document.getElementById('userSelect');

    try {
        const users = await fetchUsers();
        if (users.length === 0) {
            status.textContent = 'No saved users found yet.';
            return;
        }

        fillDropdown(users);
        status.textContent = 'Select a player to view their bingo board.';

        select.addEventListener('change', (event) => {
            loadUserBingo(event.target.value);
        });
    } catch (error) {
        status.textContent = 'Failed to load users.';
    }
}

document.addEventListener('DOMContentLoaded', initializeAdminPage);
