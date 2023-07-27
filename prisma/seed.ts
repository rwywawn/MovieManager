import {Prisma, PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
    {
        username: 'Alice',
        email: 'alice@gmail.com',
        password: 'abc123'
    },
    {
        username: 'Bob',
        email: 'bob@gmail.com',
        password: 'abce12345'
    },
    {
        username: 'Carol',
        email: 'carol@gmail.com',
        password: 'abc123456789'
    },
]

const movieData: Prisma.MovieCreateInput[] = [
    {
        movieName: 'Alice\'s Movie',
        description: 'alice\'s description',
        directorName: 'alice',
        releaseDate: new Date('December 17, 1995 03:24:00')
    }, {
        movieName: 'Bob\'s Movie',
        description: 'Bob\'s description',
        directorName: 'Bob',
        releaseDate: new Date('December 11, 1995 03:24:00')
    }, {
        movieName: 'Carol\'s Movie',
        description: 'Carol\'s description',
        directorName: 'Carol',
        releaseDate: new Date('December 21, 1995 03:24:00')
    },
]

async function main() {
    console.log(`Start seeding ...`)
    for (const u of userData) {
        const user = await prisma.user.create({
            data: u,
        })
        console.log(`Created user with id: ${user.id}`)
    }

    for (const u of movieData) {
        const movie = await prisma.movie.create({
            data: u,
        })
        console.log(`Created movie with id: ${movie.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
