const bcrypt = require('bcryptjs');
const fs = require('fs');

const run = async() => {
    // Generate random salt value between 5 and 10
    const saltRandom = 10;
    const pass = process.env.PASSWORD;
    const password =await bcrypt.hash(pass, saltRandom);
    console.log(`PASSWORD=${password}\nSALT=${saltRandom}`);
}
run().then(console.log).catch(console.error);