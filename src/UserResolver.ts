import 'reflect-metadata'
import {Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver,} from 'type-graphql'
import bcrypt from 'bcrypt'
import {User} from './User'
import Context from './context'
import {createToken} from "./utils";

@ObjectType()
class TokenUserPayload {
    @Field(type => User)
    user: User;

    @Field()
    token: string;
}

@Resolver(User)
export class UserResolver {

    @Query(() => String)   // The return type is now a string (the JWT)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() ctx: Context
    ): Promise<string> {
        const user = await ctx.prisma.user.findUnique({where: {email}});

        if (!user) throw new Error('Invalid login, Email not found');

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid login, Incorrect password');

        return createToken(user.id)
    }

    @Mutation(() => Boolean)
    async changePassword(
        @Arg('email') email: string,
        @Arg('oldPassword') oldPassword: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() context: Context
    ): Promise<boolean> {
        // Step 1. Find the user in the database by email
        const user = await context.prisma.user.findUnique({where: {email}});

        // Step 2: If no user is found, throw an error
        if (!user) throw new Error('Invalid email address');

        // Step 3: Check if the old password is correct
        const valid = await bcrypt.compare(oldPassword, user.password);
        if (!valid) throw new Error('Incorrect password');

        // Step 4: Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Step 5: Update the user's password in the database
        await context.prisma.user.update({
            where: {email},
            data: {password: hashedPassword},
        });

        return true;
    }

    @Mutation(() => TokenUserPayload)
    async signup(
        @Arg('username') username: string,
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() ctx: Context   // Access the request context
    ): Promise<TokenUserPayload> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await ctx.prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            }
        });
        const token = createToken(user.id)

        return {
            user,
            token,
        };
    }
}
