const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { loadDatabase, saveDatabase } = require('../utils/database');
const uuid = require('uuid');
const client = new OAuth2Client(process.env.CLIENT_ID);

const index = async (req, res) => {
    const user = req.session.user;
    if (user) {
        const user_email = user.email;

        if (!user_email) {
            return res.redirect('/welcome');
        }

        const data = loadDatabase();
        let student = null;
        let teacher = null;

        for (let stu of data[0].students) {
            if (stu.email === user_email) {
                student = stu;
                break;
            }
        }

        if (!student) {
            for (let tea of data[0].teachers) {
                if (tea.email === user_email) {
                    teacher = tea;
                    break;
                }
            }
        }

        if (student) {
            return res.redirect(`http://127.0.0.1:5500/STATIC/students/?institute_id=123456&student_id=${student.id}`);
        }

        if (teacher) {
            return res.redirect(`http://127.0.0.1:5500/STATIC/teachers/?institute_id=123456&teacher_id=${teacher.id}`);
        }

        return res.redirect('/welcome');
    }

    res.render('index.html', { request: req });
};

const login = async (req, res) => {
    const url = 'https://backend.edu.codemate.ai/auth';
    res.redirect(url);
};

const auth = async (req, res) => {
    try {
        const token = await client.getToken(req.query.code);
        const ticket = await client.verifyIdToken({
            idToken: token.tokens.id_token,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { name, email, picture } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ name, email, image_url: picture, role: 'Student' });
            await user.save();
        }

        req.session.user = user;
        res.redirect('/welcome');
    } catch (e) {
        res.status(500).json({ message: "Can't login right now, please try after some time" });
    }
};

const add_user = async (req, res) => {
    const { request_type, institute_id, name, email, image_url } = req.body;
    const data = loadDatabase();

    let institute_index = null;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === institute_id) {
            institute_index = i;
            break;
        }
    }

    if (institute_index === null) {
        return res.status(404).json({ status: 'failure', message: 'Institute not found.' });
    }

    const user_id = uuid.v4();

    if (request_type.toLowerCase() === 'teacher') {
        const user_data = { id: user_id, name, email, image_url };
        data[institute_index].teachers.push(user_data);
        saveDatabase(data);
        return res.status(200).json({ id: user_id, status: 'ok' });
    } else if (request_type.toLowerCase() === 'student') {
        const user_data = {
            id: user_id,
            name,
            email,
            image_url,
            teachers_ids: ['001', '002'],
            submissions: [],
            assigned: []
        };

        const assignments_from_teachers = data[institute_index].assignments.filter(assignment =>
            user_data.teachers_ids.includes(assignment.teacher_id)
        );

        for (let assignment of assignments_from_teachers) {
            user_data.assigned.push({ aid: assignment.id });
        }

        data[institute_index].students.push(user_data);
        saveDatabase(data);
        return res.status(200).json({ id: user_id, status: 'ok' });
    } else {
        return res.status(400).json({ message: "Invalid request type. Use 'Teacher' or 'Student'." });
    }
};

const welcome = (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/');
    }
    res.render('onboarding/index.html', { request: req, user });
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

module.exports = { index, login, auth, add_user, welcome, logout };