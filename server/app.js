import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'

const app = express()
app.use(express.json())
app.use(cors())

const usersFilePath = './users.json';

const readUsers = async () => {
    try {
        const data = await fs.readFile(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};

const writeUsers = async (users) => {
    try {
        const data = JSON.stringify(users, null, 2);
        await fs.writeFile(usersFilePath, data, 'utf8');
    } catch (error) {
        console.error('Error writing to users file:', error);
    }
};

app.get('/users', async (req, res) => {
    const users = await readUsers()
    return res.json(users)
})

app.get('/users/:id', async (req, res) => {
    const { id } = req.params
    const users = await readUsers()
    const currentUser = users.find(user => user.id.toString() === id)

    if (currentUser) {
        return res.json(currentUser)
    }

    return res.status(404).json({ message: 'User not found' })
})

app.post('/users/filter', async (req, res) => {
    const { searchQuery, minAge, maxAge, gender } = req.body;

    const users = await readUsers()
    const filteredUsers = users.filter(user => {
        const matchesSearchQuery = !searchQuery ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        const isWithinAgeRange = (!minAge || user.age >= minAge) && (!maxAge || user.age <= maxAge);
        const matchesGender = !gender || gender.toLowerCase() === 'all' || user.gender.toLowerCase() === gender.toLowerCase();

        return matchesSearchQuery && isWithinAgeRange && matchesGender;
    });

    return res.json(filteredUsers);
});

app.post('/users/add', async (req, res) => {
    const newUser = req.body;
    newUser.id = Date.now().toString()

    const users = await readUsers();
    users.push(newUser)
    await writeUsers(users);

    return res.status(201).send(newUser);
});

app.post('/users/remove/:id', async (req, res) => {
    const { id } = req.params;
    const users = await readUsers();
    const currentUsers = users.filter(user => user.id !== id);
    await writeUsers(currentUsers);

    return res.status(200).send({ message: 'User removed' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})
