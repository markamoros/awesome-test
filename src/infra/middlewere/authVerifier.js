import { getEnv } from "../environment/environment.js";

const HEADER_KEY = "authorization";
const AUTH_TOKEN = getEnv('AUTH_TOKEN');

export function checkAuth(req, res, next) {
    let headers = req.headers;
    if (!headers[HEADER_KEY] || headers[HEADER_KEY] !== AUTH_TOKEN) {
        res.status(401).send({ message: "Unauthorized resource." });
    } else {
        next();
    }
}