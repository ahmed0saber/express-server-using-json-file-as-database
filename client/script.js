async function getAllUsers() {
    try {
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getUserById() {
    const userId = document.getElementById('userId').value;
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function filterUsers() {
    const searchQuery = document.getElementById('searchQuery').value;
    const minAge = document.getElementById('filterMinAge').value;
    const maxAge = document.getElementById('filterMaxAge').value;
    const gender = document.getElementById('filterGender').value;

    const filterData = { searchQuery, minAge, maxAge, gender };

    try {
        const response = await fetch('http://localhost:3000/users/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterData)
        });
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayData(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = JSON.stringify(data, null, 2);
}

document.getElementById('getAllUsersBtn').addEventListener('click', getAllUsers);
document.getElementById('getUserByIdBtn').addEventListener('click', getUserById);
document.getElementById('filterUsersBtn').addEventListener('click', filterUsers);
