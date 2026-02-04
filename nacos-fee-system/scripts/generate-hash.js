const bcrypt = require('bcryptjs');

bcrypt.hash('admin123', 10).then(hash => {
    console.log('Password: admin123');
    console.log('Hash:', hash);
});
