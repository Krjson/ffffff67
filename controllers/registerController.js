const bcrypt = require('bcryptjs');
const User = require('../models/user');

async function rigister(req, res) {
    const { email, password } = req.body;

    // проверяем, что оба поля заполнены
    if (!email || !password) {
        return res.status(400).send('Введите email и пароль');
    }

    // проверяем, что такой пользователь еще не зарегистрирован
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send('Пользователь с таким email уже зарегистрирован');
    }

    // хешируем пароль
    const hashedPassword = bcrypt.hashSync(password, 10);

    // создаем нового пользователя
    const user = new User({
        email,
        password: hashedPassword,
    });

    // сохраняем пользователя в базе данных
    try {
        await user.save();
        res.send('Вы успешно зарегистрировались');
    } catch (err) {
        res.status(500).send('Ошибка при сохранении пользователя в базе данных');
    }
}

module.exports = {
    rigister
};
