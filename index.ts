import express, { Application, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

// Import specific Prisma errors if available
// import { PrismaClientKnownRequestError } from '@prisma/client'; 

const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: number = 3000;

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err.name === 'PrismaClientKnownRequestError') {
        // Handle specific Prisma errors
        res.status(400).json({ success: false, message: "A database error occurred." });
    } else {
        // Generic error response for unexpected errors
        res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
};

app.get("/", (req: Request, res: Response) => {
    res.send(`Kind Robots Prisma Server is running on port: ${port}`);
});

app.get('/api/bots', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allBots = await prisma.bot.findMany();
        res.json({ success: true, data: allBots });
    } catch (error) {
        next(error); // Forward the error to the centralized error handler
    }
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});