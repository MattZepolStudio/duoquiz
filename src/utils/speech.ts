// Speech recognition & transcription utility for mobile couples

export interface SpeechListenerOptions {
  onResult: (text: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export class SpeechService {
  private recognition: any = null;
  public isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'fr-FR';
        this.isSupported = true;
      }
    }
  }

  startListening(options: SpeechListenerOptions): boolean {
    if (!this.recognition) {
      options.onError("La reconnaissance vocale n'est pas disponible sur ce navigateur.");
      return false;
    }

    try {
      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        options.onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        options.onError(event.error || 'Erreur micro');
      };

      this.recognition.onend = () => {
        options.onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      options.onError(err.message || 'Impossible de démarrer le micro');
      return false;
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
  }
}

export const speechService = new SpeechService();
