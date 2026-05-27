import type { LoginSchemaType, RegisterSchemaType } from "@repo/types"
import { TRPCError } from "@trpc/server"
import { comparePassword, hashPassword } from "../lib/hash.js";
import { generateToken } from "../lib/jwt.js";
import type { Payload } from "../lib/jwt.js";
import type { Db } from "@repo/db";
import { users } from "@repo/db";

export async function loginUser(db: Db, data: LoginSchemaType) {
    const {email, password} = data;
    const user = await db.query.users.findFirst({
        where: (u, {eq}) => eq(u.email, email)
    })

    if(!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password"
        })
    }

    const isPaswordCorrect = await comparePassword(password, user.password);
    if(!isPaswordCorrect) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password"
        })
    }

    const token = generateToken({
        id: user.id,
        role: user.role as Payload["role"]
    })
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.username,
            email_verified: user.emailVerfied
        },
        token: token ?? undefined
    }
}

export async function registerUser(db: Db, data: RegisterSchemaType) {
    const {email, name, password} = data;
    const existingUser = await db.query.users.findFirst({
        where: (u, {eq}) => eq(u.email, email)
    })

    if(existingUser) {
        throw new TRPCError({
            code: "CONFLICT",
            message: "An account with this email already exists"
        })
    }
    const hashedPassword = await hashPassword(password);
    const [user] = await db.insert(users).values({
        email,
        username: name,
        password: hashedPassword, 
    }).returning();

    if(!user) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user"
        })
    }
    const token = generateToken({
        id: user.id,
        role: user.role as Payload["role"]
    })
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.username,
            email_verified: user.emailVerfied
        },
        token: token ?? undefined
    }
}

export async function logoutUser() {
    return {
        message: "Logged out successfully"
    }
}

export async function me(db: Db, userId: string) {
    const user = await db.query.users.findFirst({
        where: (u, {eq}) => eq(u.id, userId)
    })

    if(!user) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Account not found"
        })
    }
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.username,
            email_verified: user.emailVerfied
        }
    };
}
