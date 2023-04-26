const bcrypt = require('bcryptjs');
const User = require('../models/user');

async function login(req, res) {
  const { email, password } = req.body;

  // проверяем, что оба поля заполнены
  if (!email || !password) {
    return res.status(400).send('Введите email и пароль');
  }

  // ищем пользователя по email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send('Неверный email или пароль');
  }

  // проверяем пароль
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).send('Неверный email или пароль');
  }

  // добавляем информацию об авторизации в сессию
  req.session.isAuthenticated = true;
  req.session.user = {
    _id: user._id,
    email: user.email,
    role: user.role // добавляем поле role из модели User
  };

  // перенаправляем на главную страницу
  res.redirect('/');
}

module.exports = {
  login
};
