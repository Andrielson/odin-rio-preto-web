const crypto = require("crypto");

const generateKey = () =>
  new Promise((resolve, reject) =>
    crypto.scrypt(
      crypto.randomBytes(32),
      crypto.randomBytes(24),
      16,
      (err, derivedKey) => {
        if (!!err) reject(err);
        resolve(derivedKey);
      }
    )
  );
generateKey().then((key) => console.log(key.toString("hex")));
