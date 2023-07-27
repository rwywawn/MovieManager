import 'reflect-metadata'
import {Field, ID, ObjectType} from 'type-graphql'
import {IsEmail} from 'class-validator'

@ObjectType()
export class User {

    @Field((type) => ID)
    id: number

    @Field()
    username: string

    @Field()
    @IsEmail()
    email: string
}
