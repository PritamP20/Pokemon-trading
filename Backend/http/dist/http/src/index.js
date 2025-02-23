import express from 'express';
import prisma from '../../db/src/index.js';
const app = express();
const port = 3000;
app.use(express.json()); // Middleware to parse JSON requests
// 🚀 Fetch offers SENT by a user (sender)
app.get('/offer', (async (req, res) => {
    try {
        const { address } = req.query; // Use query parameter instead of body
        if (!address)
            return res.status(400).json({ message: "Address is required" });
        const offers = await prisma.offer.findMany({
            where: { senderAddress: address }, // Query offers by sender's wallet address
            include: { personB: true } // Include recipient details
        });
        res.status(200).json({ offers });
    }
    catch (error) {
        console.error("Error fetching sent offers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// 🚀 Fetch offers RECEIVED by a user (receiver)
app.get('/request', (async (req, res) => {
    try {
        const { address } = req.query;
        if (!address)
            return res.status(400).json({ message: "Address is required" });
        const requests = await prisma.offer.findMany({
            where: { personBId: address }, // Query offers by recipient's wallet address
            include: { personA: true } // Include sender details
        });
        res.status(200).json({ requests });
    }
    catch (error) {
        console.error("Error fetching received offers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.post('/offer', (async (req, res) => {
    try {
        const { address } = req.query;
        const body = req.body;
        const { senderAddress, intrestedNFT, offeredNFT, personBaddress, personAaddress } = body;
        if (!senderAddress || !intrestedNFT || !offeredNFT) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const reponse = prisma.offer.create({
            data: {
                senderAddress,
                intrestedNFT,
                offeredNFT,
                personAId: personAaddress,
                personBId: personBaddress
            }
        });
        return res.status(200).json({ message: "Offer created successfully" });
    }
    catch (error) {
        console.error("Error creating offer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
