import express from 'express';
import cors from 'cors';
import { MusicKit } from 'musicstream-sdk';

const app = express();
app.use(cors());

// Inisialisasi MusicKit dengan Cookies
const mk = new MusicKit({
    cookiesPath: '/app/cookies.txt' // Path ke file cookies.txt di dalam Docker
});

// Endpoint buat nyari lagu
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query kosong" });

    try {
        const results = await mk.search(query);
        const songs = results.songs || [];
        
        const tracks = songs.slice(0, 15).map(track => ({
            id: track.videoId,
            title: track.title,
            artist: track.artists ? track.artists[0].name : (track.author || "Unknown"),
            thumbnail: track.thumbnails ? track.thumbnails[0].url : "",
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

    console.log(`\n[API] =====================================`);
    console.log(`[API] Menerima request stream untuk ID: ${videoId}`);
    console.log(`[API] Mulai memanggil yt-dlp...`);

    try {
        // Panggil method getStream dari instance 'mk'
        const streamInfo = await mk.getStream(videoId);
        
        console.log(`[API] yt-dlp selesai dipanggil!`);

        if (streamInfo && streamInfo.url) {
            console.log(`[API] SUKSES! Dapet link audio.`);
            console.log(`[API] =====================================\n`);
            res.json({ status: true, audioUrl: streamInfo.url });
        } else {
            console.log(`[API] GAGAL! Stream info kosong.`);
            console.log(`[API] =====================================\n`);
            res.status(404).json({ status: false, error: "Audio tidak ditemukan" });
        }
    } catch (error) {
        console.log(`[API] yt-dlp ERROR: ${error.message}`);
        console.log(`[API] =====================================\n`);
        res.status(500).json({ status: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend jalan di port ${PORT}`));
