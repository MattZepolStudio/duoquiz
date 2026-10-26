import http from 'http';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer } from 'ws';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MultiplayerRoomManager } from './src/server/multiplayerRoomManager';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const server = http.createServer(app);

  // Initialize Real-time Multiplayer WebSocket Server
  const roomManager = new MultiplayerRoomManager();
  const wss = new WebSocketServer({ server, path: '/ws' });
  wss.on('connection', (ws) => {
    roomManager.handleConnection(ws);
  });

  app.use(express.json({ limit: '20mb' }));

  // Initialize Gemini AI SDK
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Resilient multi-model Gemini caller with automatic fallback
  async function generateWithFallback(
    prompt: string,
    responseMimeType: string = 'application/json',
    temperature: number = 0.8
  ): Promise<string> {
    if (!ai) throw new Error('Gemini API non configurée');
    // Prefer gemini-3.1-flash-lite for ultra-fast response, fallback to gemini-3.8-flash
    const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let lastError: any = null;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType,
            temperature,
          },
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        console.warn(`[Gemini] Model ${model} failed, trying next fallback:`, err.message || err);
        lastError = err;
      }
    }
    throw lastError || new Error('All Gemini models failed');
  }

  // API Route: Check Gemini AI Configuration Status
  app.get('/api/gemini/status', (req, res) => {
    res.json({
      configured: !!ai,
      message: ai
        ? 'Gemini API connectée et opérationnelle.'
        : 'GEMINI_API_KEY non définie sur le serveur d\'hébergement.',
    });
  });

  // API Route: Generate Custom Couple Questions
  app.post('/api/gemini/generate-questions', async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API non configurée sur le serveur. Utilisation du mode questions locales.',
        });
      }

      const { category, difficulty, player1, player2, count = 5, previousQuestions = [] } = req.body;

      const prompt = `Tu es le maître du jeu d'un quizz de couple intimiste, amusant, complice et bienveillant en français appelé DuoQuiz.
Les deux partenaires s'appellent "${player1 || 'Joueur 1'}" et "${player2 || 'Joueur 2'}".
Génère ${count} questions INÉDITES et variées pour la catégorie "${category || 'Général'}" et la difficulté "${difficulty || 'medium'}".

Règles impératives :
1. Les questions doivent porter sur les préférences, souvenirs, manies, rêves ou secrets d'un des partenaires pour que l'autre essaie de deviner.
2. Ne répète AUCUNE de ces questions récentes : ${JSON.stringify(previousQuestions.slice(-20))}.
3. Chaque question DOIT contenir :
   - "question" : formulation neutre
   - "targetQuestion" : adressé à la personne qui répond en secret pour parler de ses propres goûts/souvenirs avec {partner} (ex: "Quel est ton plat réconfortant préféré après une dure journée avec {partner} ?")
   - "guesserQuestion" : adressé à l'autre partenaire qui doit deviner (ex: "Quel est le plat réconfortant préféré de {target} selon toi ?")
   - "options" : exactement 4 choix variés, réalistes et amusants.
   - "hint" : un petit indice taquin ou complice.

Renvoie UNIQUEMENT un tableau JSON strict :
[
  {
    "id": "gen_1",
    "question": "...",
    "targetQuestion": "...",
    "guesserQuestion": "...",
    "category": "${category}",
    "difficulty": "${difficulty}",
    "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
    "hint": "..."
  }
]`;

      const responseText = await generateWithFallback(prompt, 'application/json', 0.8);
      const parsed = JSON.parse(responseText.trim());
      return res.json({ questions: parsed });
    } catch (error: any) {
      console.error('Error generating questions with Gemini:', error);
      return res.status(500).json({ error: error.message || 'Erreur lors de la génération' });
    }
  });

  // API Route: Cupid AI Verdict / Couple Compatibility Analysis
  app.post('/api/gemini/couple-verdict', async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({ error: 'Gemini API non configurée' });
      }

      const { player1, player2, score, totalQuestions, matchedQuestions, mismatchedQuestions, isCoquin } = req.body;

      const gageInstruction = isCoquin
        ? `3. Un "Gage d'Amour" STRICTEMENT COQUIN, SENSUEL ET PIQUANT (le couple a activé le mode Coquin & Intimité) ! Propose un gage torride, charnel ou excitant pour faire monter le désir entre eux (ex: massage sensuel dénudé aux huiles de 10 min, baisers les yeux bandés sur des zones secrètes, retirer un vêtement avec les dents, chuchoter un fantasme inavoué sous la couette, caresses interdites pendant 2 min).`
        : `3. Un "Gage d'Amour" mignon, complice et romantique pour sceller la partie (ex: préparer le petit-déjeuner au lit demain matin, massage relaxant des épaules de 5 min, slow collé-serré dans le salon, 3 compliments profonds les yeux dans les yeux).`;

      const prompt = `Tu es Cupidon, un conseiller de couple avec beaucoup d'humour, de tendresse et de bienveillance${isCoquin ? ' teinté d\'un brin de malice et de sensualité' : ''}.
Les amoureux ${player1} et ${player2} viennent de terminer une partie de quizz de couple.
Score : ${score} / ${totalQuestions} bonnes réponses (${Math.round((score / (totalQuestions || 1)) * 100)}% d'affinité).
${isCoquin ? 'Note importante : Le mode "Coquin & Intimité" est activé pour cette partie !' : ''}

Voici quelques questions où ils étaient d'accord (matchs) :
${matchedQuestions?.slice(0, 3).map((q: any) => `- ${q.question} (Réponse : ${q.answer})`).join('\n') || 'Aucun'}

Voici quelques questions où ils n'étaient pas d'accord :
${mismatchedQuestions?.slice(0, 3).map((q: any) => `- ${q.question} (${player1}: ${q.p1Answer} vs ${player2}: ${q.p2Answer})`).join('\n') || 'Aucun'}

Rédige en français :
1. Un titre honorifique de couple percutant et drôle (ex: "Les Télépathes du Canapé", "Le Duo Passion & Mauvaise Foi", "Les Amants Incendiaires").
2. Un verdict amical et drôle de 3 à 4 phrases sur leur dynamique de couple${isCoquin ? ' avec un clin d\'œil complice sur leur sensualité' : ''}.
${gageInstruction}

Renvoie UNIQUEMENT un JSON :
{
  "coupleTitle": "...",
  "verdict": "...",
  "loveChallenge": "..."
}`;

      const responseText = await generateWithFallback(prompt, 'application/json', 0.7);
      return res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error('Error generating verdict:', error);
      return res.status(500).json({ error: error.message || 'Erreur verdict' });
    }
  });

  // API Route: Audio Transcription with gemini-3.5-transcribe
  app.post('/api/gemini/transcribe', async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({ error: 'Gemini API non configurée' });
      }

      const { audioBase64, mimeType = 'audio/webm' } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: 'Données audio manquantes' });
      }

      const audioPart = {
        inlineData: {
          mimeType,
          data: audioBase64,
        },
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            audioPart,
            { text: 'Transcris exactement la parole prononcée en français, sans commentaire.' },
          ],
        },
      });

      return res.json({ text: response.text?.trim() || '' });
    } catch (error: any) {
      console.error('Error transcribing audio:', error);
      return res.status(500).json({ error: error.message || 'Erreur transcription' });
    }
  });

  // API Route: App Info & Public URL resolution
  app.get('/api/app-info', (req, res) => {
    const rawUrl = process.env.APP_URL || '';
    res.json({
      appUrl: rawUrl,
      publicUrl: rawUrl,
    });
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, () => {
    console.log(`DuoQuiz server with WebSocket running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
