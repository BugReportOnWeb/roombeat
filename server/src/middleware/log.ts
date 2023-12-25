import { Request, Response, NextFunction } from "express";

const log = (req: Request, _res: Response, next: NextFunction) => {
    const logDetails = {
        method: req.method,
        path: req.path,
        params: req.params,
        body: req.body,
    }

    console.log(logDetails);
    next();
}

export default log;
