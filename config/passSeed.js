const bcrypt = require('bcryptjs');

const run = async() => {
    // Generate random salt value 5
    const saltRandom = 5;
    const pass = "bahare";
    const password =await bcrypt.hash(pass, saltRandom);
    console.log(`PASSWORD=${password}\nSALT=${saltRandom}`);
}
run().then(console.log).catch(console.error);