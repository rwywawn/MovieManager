import 'reflect-metadata'
import {ApolloServer} from '@apollo/server'
import {startStandaloneServer} from '@apollo/server/standalone'
import {GraphQLScalarType} from 'graphql'
import {DateTimeResolver} from 'graphql-scalars'
import {buildSchema} from 'type-graphql'
import {UserResolver} from './UserResolver'
import {MovieResolver} from './MovieResolver'
import {PrismaClient} from "@prisma/client";
import Context from "./context";

require('dotenv').config()

const app = async () => {

    const schema = await buildSchema({
        resolvers: [MovieResolver, UserResolver],
        scalarsMap: [{type: GraphQLScalarType, scalar: DateTimeResolver}],
        validate: {forbidUnknownValues: false},
    })

    const prisma = new PrismaClient()

    const server = new ApolloServer<Context>({
        schema, formatError: (err) => {
            // Clear stack trace and other details
            const lines = err.message.split('\n')
            return {message: lines[lines.length - 1]}
        },
    })

    const {url} = await startStandaloneServer(server, {
        context: async ({req}) => {
            return {
                prisma: prisma,
                token: req.headers.authorization,
            }
        }
    })

    console.log(`🚀 Server ready at: ${url}`)
}

app()
