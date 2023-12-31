import {PrismaClient} from "@prisma/client";

export default interface Context {
    prisma: PrismaClient,
    token: string | undefined
}