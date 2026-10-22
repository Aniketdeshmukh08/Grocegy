const jwt = require('jsonwebtoken');

const verifyJwtAdmin = (req, res, next) => {

    let temptoken = req.headers["x-access-token"];

    if(!temptoken) {
        res.status(400).json({err: 'Token Missing'})
    }
    else { 
        jwt.verify(temptoken, "hashedbit", (err, decoded) => {
            if(err) {
                console.log('Err', err);
                res.status(400).json({err: 'Invaid Token or Token Expired. Plz login again with correct credentials'});
            }
            else {
                //console.log('decoded', decoded.username);
                if(decoded.usertype == 'admin') {
                    next();
                }
                else {
                    res.status(400).json({err: 'You are not authorized to perfor this operation.'});
                }
            }
        })
    }
}

module.exports = verifyJwtAdmin;