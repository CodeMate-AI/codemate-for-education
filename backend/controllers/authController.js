const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.CLIENT_ID);

const login = async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
        user = new User({ name, email, image_url: picture, role: 'Student' }); // Default role
        await user.save();
    }

    req.session.user = user;
    res.status(201).json(user);
};

const logout = (req, res) => {
    req.session.destroy();
    res.status(200).send({ message: 'Logged out successfully' });
};

module.exports = { login, logout };
