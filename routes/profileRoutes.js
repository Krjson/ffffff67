const express = require('express');
const router = express.Router();

// маршрут для страницы профиля пользователя
router.get('/', (req, res) => {
  res.send('Вы находитесь в своем личном кабинете');
});

module.exports = router;
