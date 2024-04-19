/******************************************************************************
ITE5315 – Project
I declare that this assignment is my own work in accordance with Humber Academic Policy.
No part of this assignment has been copied manually or electronically from any other source
(including web sites) or distributed to other students.
Name:Bahare Ghasemi Student ID:N01538197 Date:2024-04-18
********************************************************************************/
const bcrypt = require('bcryptjs');

const run = async() => {
    // Generate random salt value 5
    const saltRandom = 5;
    const pass = "bahare";
    const password =await bcrypt.hash(pass, saltRandom);
    console.log(`PASSWORD=${password}\nSALT=${saltRandom}`);
}
run().then(console.log).catch(console.error);