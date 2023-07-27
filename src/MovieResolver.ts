import 'reflect-metadata'
import {Arg, Ctx, Int, Mutation, Query, Resolver,} from 'type-graphql'
import {Movie} from './Movie'
import Context from './context'
import {validDate, verifyToken} from "./utils";

enum MovieOrderByInput {
    id = "id",
    movieName = "movieName",
    description = "description",
    directorName = "directorName",
    releaseDate = "releaseDate",
}

@Resolver(Movie)
export class MovieResolver {

    @Query((returns) => Movie, {nullable: true})
    async getMovieById(@Arg('id') id: number, @Ctx() ctx: Context) {
        return ctx.prisma.movie.findUnique({
            where: {id},
        })
    }

    @Query(returns => [Movie])
    async movies(
        @Arg("skip", type => Int, {nullable: true}) skip: number,
        @Arg("take", type => Int, {nullable: true}) take: number,
        @Arg("orderBy", type => String, {nullable: true, defaultValue: MovieOrderByInput.releaseDate}) orderBy: string,
        @Arg("orderDesc", type => Boolean, {nullable: true, defaultValue: true}) orderDesc: boolean = true,
        @Arg("directorName", type => String, {nullable: true}) directorName: string,
        @Arg("startDate", type => String, {nullable: true}) startDate: string,
        @Arg("endDate", type => String, {nullable: true}) endDate: string,
        @Ctx() ctx: Context,
    ): Promise<Movie[]> {

        const where: any = {};

        if (startDate || endDate) {
            where.releaseDate = {
                gte: validDate(new Date(startDate)) ? startDate : undefined,
                lte: validDate(new Date(endDate)) ? endDate : undefined,
            };
        }

        if (directorName) {
            where.directorName = directorName
        }

        if (!(orderBy && orderBy in MovieOrderByInput)) {
            orderBy = MovieOrderByInput.releaseDate
        }

        return ctx.prisma.movie.findMany({
            take: skip || undefined,
            skip: take || undefined,
            orderBy: {
                [orderBy]: orderDesc ? 'desc' : 'asc'
            },
            where: where
        });
    }

    @Mutation((returns) => Movie)
    async createMovie(
        @Arg('movieName') movieName: string,
        @Arg('description') description: string,
        @Arg('directorName') directorName: string,
        @Arg('releaseDate') releaseDate: string,
        @Ctx() ctx: Context,
    ): Promise<Movie> {

        if (!ctx.token) throw new Error("No auth token");
        verifyToken(ctx.token)

        const date = validDate(new Date(releaseDate))

        return ctx.prisma.movie.create({
            data: {movieName, description, directorName, releaseDate: date}
        });
    }

    @Mutation((returns) => Movie)
    async updateMovie(
        @Arg('id') id: number,
        @Arg('movieName', {nullable: true}) movieName: string,
        @Arg('description', {nullable: true}) description: string,
        @Arg('directorName', {nullable: true}) directorName: string,
        @Arg('releaseDate', {nullable: true}) releaseDate: string,
        @Ctx() ctx: Context,
    ): Promise<Movie | null> {

        if (!ctx.token) throw new Error("No auth token");
        verifyToken(ctx.token)

        const date = validDate(new Date(releaseDate)) ? releaseDate : undefined

        return ctx.prisma.movie.update({
            where: {id},
            data: {
                ...(movieName && {movieName}),
                ...(description && {description}),
                ...(directorName && {directorName}),
                ...(releaseDate && {releaseDate: date}),
            },
        });
    }


    @Mutation((returns) => Movie, {nullable: true})
    async deleteMovie(@Arg('id', (type) => Int) id: number, @Ctx() ctx: Context) {

        if (!ctx.token) throw new Error("No auth token");
        verifyToken(ctx.token)

        return ctx.prisma.movie.delete({
            where: {
                id,
            },
        })
    }
}
