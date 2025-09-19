const express = require('express');

const router = express.Router();
const UserRepo = require('../repos/user-repo');

router.get('/users', async (req, res) => {
    try {
        const users = await UserRepo.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await getUserById(userId); // Assume this function fetches a user by ID from the database
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User Not Found');
        }
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/users', async (req, res) => {
    const newUser = req.body;
    try {
        const createdUser = await createUser(newUser); // Assume this function creates a new user in the database
        res.status(201).json(createdUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    try {
        const user = await updateUser(userId, updatedUser); // Assume this function updates a user by ID in the database
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User Not Found');
        }
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const deleted = await deleteUser(userId); // Assume this function deletes a user by ID from the database
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).send('User Not Found');
        }
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;