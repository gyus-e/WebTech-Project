import express from "express";

export function enforceAuthentication(req: express.Request, res: express.Response, next: express.NextFunction) {
    if(!req?.session?.isAuthenticated){
        // req.flash("error", "You must be logged in to access this feature.");
        res.redirect("/auth");
    } else {
        next();
    }
}