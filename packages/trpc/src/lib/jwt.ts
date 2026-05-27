import jwt from "jsonwebtoken";
import {env} from "@repo/config"

export type Payload = {
    id: string,
    role: "user" | "admin"
}

export function generateToken(payload: Payload){
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: "7d"
    })
}

export function verifyToken(token: string) {
    return jwt.verify(token, env.JWT_SECRET) as Payload;
}