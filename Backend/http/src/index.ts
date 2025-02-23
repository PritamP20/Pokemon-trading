import express, { Request, Response, Express } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { prisma } from '../../db/dist/index.js';
import cors from 'cors';
// import type { prisma } from "../../db/dist/index.d.ts" with { "resolution-mode": "import" };
// const prisma: import("../../db/dist/index.d.ts") = {};

            
const app = express();
const port = 3001;
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

app.post("/users", (async (req: Request, res: Response) => {
    try {
        const { address } = req.body;
        
        if (!address) {
            return res.status(400).json({ message: "Address is required" });
        }

        const user = await prisma.user.create({
            data: { address }
        });

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}) as RequestHandler);

// 🚀 Fetch offers SENT by a user (sender)
app.get('/offer', (async (req: Request, res: Response) => {
    try {
        const { address } = req.query;
        if (!address) {
            res.status(400).json({ message: "Address is required" });
            return;
        }
        const offers = await prisma.offer.findMany({
            where: { senderAddress: address as string },
            include: { personB: true }
        });
        res.status(200).json({ offers });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}) as RequestHandler);

// 🚀 Fetch offers RECEIVED by a user (receiver)
app.get('/request', (async (req: Request, res: Response) => {
    try {
        const { address } = req.query;
        if (!address) {
            res.status(400).json({ message: "Address is required" });
            return;
        }
        const requests = await prisma.offer.findMany({
            where: { personBId: address as string },
            include: { personA: true }
        });
        res.status(200).json({ requests });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}) as RequestHandler);

app.post('/offer', (async (req: Request, res:Response) => {
    try {
        const {senderAddress, intrestedNFT, offeredNFT, personBaddress, personAaddress} = req.body;
        if(!senderAddress || !intrestedNFT || !offeredNFT) {
            res.status(400).json({message: "All fields are required"});
            return;
        }
        await prisma.offer.create({
            data: { senderAddress, intrestedNFT, offeredNFT, personAId: personAaddress, personBId: personBaddress }
        });
        res.status(200).json({message: "Offer created successfully"});
    } catch(error) {
        res.status(500).json({ message: "Internal server error", error: error });
    }
}) as RequestHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

