const express = require('express');
const cors = require('cors');
const { search, getStream } = require('musicstream-sdk');

const app = express();
app.use(cors());

// Endpoint buat nyari lagu
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query kosong" });

    try {
        // Nyari lagu pake musicstream-sdk
        const results = await search(query);
        
        // Format biar sesuai sama website Moonsic
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

// Endpoint buat dapetin link audio (MP3)
app.get('/api/stream', async (req, res) => {
    const videoId = req.query.id;
    if (!videoId) return res.status(400).json({ error: "ID kosong" });

    try {
        // Ambil stream URL
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

// Port dinamis (Render biasanya ngasih port lewat env)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend jalan di port ${PORT}`));
