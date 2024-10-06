// verify token function 

import jwt from 'jsonwebtoken';



export const verifyToken = (request,response,next) => {
//       console.log(request.cookies) ;
      
      const token = request.cookies.jwt;
      console.log(process.env.JWT_KEY) ;
      if (!token){
        return response.status(401).send('You are not Authenticated');
      }
      jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if (err) {
                console.log(err);
                return response.status(403).send('Token is not valid');
        }
        // console.log("Payload  : "+ payload.userID);
        request.userId = payload.userID;
        next();
});
}