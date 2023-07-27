import 'reflect-metadata'
import {Field, ID, ObjectType} from 'type-graphql'

@ObjectType()
export class Movie {
    @Field((type) => ID)
    id: number

    @Field()
    movieName: string

    @Field()
    description: string

    @Field()
    directorName: string

    @Field()
    releaseDate: Date
}
