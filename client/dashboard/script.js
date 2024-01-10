async function displayUsers() {
    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        users.forEach(user => {
            let li = document.createElement('li');
            li.textContent = `${user.fullname} - ${user.email}`;
            let removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => removeUser(user.id);
            li.appendChild(removeButton);
            userList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

document.getElementById('addUserForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userData = {
        username: document.getElementById('username').value,
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value, 10),
        gender: document.getElementById('gender').value
    };

    try {
        const response = await fetch('http://localhost:3000/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        if(response.ok) {
            displayUsers();
            event.target.reset();
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
});


async function removeUser(userId) {
    try {
        const response = await fetch(`http://localhost:3000/users/remove/${userId}`, {
            method: 'POST'
        });
        if(response.ok) {
            displayUsers();
        }
    } catch (error) {
        console.error('Error removing user:', error);
    }
}

displayUsers();
