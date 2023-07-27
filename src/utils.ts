import jwt from "jsonwebtoken";

export function validDate(date: Date) {
    if (isNaN(date.getTime()) || date >= new Date('00-00-10000')) {
        throw new Error("Invalid release date")
    }
    return date
}

export function createToken(id: number) {
    return jwt.sign({userId: id}, process.env.JWT_SECRET!, {
        expiresIn: "1h"   // Token expires in 1 hour
    });
}

export function verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!)
}