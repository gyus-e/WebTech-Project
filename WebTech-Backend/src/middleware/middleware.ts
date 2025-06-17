import express from "express";

export function enforceAuthentication(req: express.Request, res: express.Response, next: express.NextFunction) {
    // if(!req?.session?.isAuthenticated){ 
    //Even though this property isn't marked as optional, it won't exist until you use the express-session middleware
        // req.flash("error", "You must be logged in to access this feature.");
        // res.redirect("/auth");
    // } else {
        next();
    // }
}