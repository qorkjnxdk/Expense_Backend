const jwt = require('jsonwebtoken');
const SECRET = 'JWT_SECRET=9ac!sUqv3#mv$s90F423l$xyQ'

async function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err,user) => {
        if (err) {
            return res.sendStatus(403)};
        req.user = user;
        next();
    })
}

module.exports = authenticateToken 