import express from 'express';
import cors from 'cors';
import { search, getStream } from 'musicstream-sdk';

const app = express();
app.use(cors());

// Endpoint buat nyari lagu
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query kosong" });

    try {
        const results = await search(query);
        const tracks = results.slice(0, 15).map(track => ({
            id: track.id || track.videoId,
            title: track.title,
            artist: track.artists ? track.artists[0].name : (track.author || "Unknown"),
            thumbnail: track.thumbnail || track.thumbnails?.[0]?.url,
            duration: track.duration
        }));
        res.json({ status: true, data: tracks });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

// Endpoint buat dapetin link audio
app.get('/api/stream', async (req, res) => {
    const videoId = req.query.id;
    if (!videoId) return res.status(400).json({ error: "ID kosong" });

    try {
        const streamInfo = await getStream(videoId);
        if (streamInfo && streamInfo.streamUrl) {
            res.json({ status: true, audioUrl: streamInfo.streamUrl });
        } else {
            res.status(404).json({ status: false, error: "Audio tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend jalan di port ${PORT}`));
