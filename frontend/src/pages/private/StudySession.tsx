import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import api from "@/api/axios";

interface Flashcard {
  id: string;
  frontText: string;
  backText: string;
}

interface Session {
  flashcardsToReview: Flashcard[];
  cardsReviewedToday: number;
}

export default function StudySession() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get<Session>(`/api/sessions`, {
          params: { deckId, batchSize: 20 }
        });
        setSession(data);
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [deckId]);

const handleReview = async (quality: number) => {
    if (!session) return;
    const card = session.flashcardsToReview[currentIndex];
    
    try {
      await api.post(`/api/sessions/${card.id}/review`, null, {
        params: { quality, deckId }
      });
      
      let updatedCards = [...session.flashcardsToReview];
      
      if (quality < 3) {
        updatedCards.push(card);
        setSession({
          ...session,
          flashcardsToReview: updatedCards
        });
      }
      
      if (currentIndex < updatedCards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading session...</div>;
  if (!session || session.flashcardsToReview.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <CheckCircle2 className="h-20 w-20 text-emerald-500" />
        <h2 className="text-3xl font-bold">Deck Mastered!</h2>
        <p className="text-slate-500">No cards due for review in this deck.</p>
        <Button onClick={() => navigate("/dashboard")} variant="outline">Back to Dashboard</Button>
      </div>
    );
  }

  const currentCard = session.flashcardsToReview[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-12">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="text-slate-500 hover:text-slate-900">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Give up
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Progress</span>
          <span className="text-lg font-bold text-slate-900">{currentIndex + 1} / {session.flashcardsToReview.length}</span>
        </div>
        <div className="w-20" /> {/* Spacer */}
      </div>

      <div className="perspective-1000 h-[400px] w-full relative mb-12">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front */}
          <Card className="absolute inset-0 backface-hidden border-2 border-slate-100 shadow-xl rounded-[2.5rem] flex items-center justify-center p-12 bg-white">
            <CardContent className="text-center p-0">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300 mb-4 block">Question</span>
              <h3 className="text-4xl font-bold text-slate-800 leading-tight">{currentCard.frontText}</h3>
              <p className="mt-8 text-slate-400 text-sm font-medium animate-pulse">Click to flip</p>
            </CardContent>
          </Card>

          {/* Back */}
          <Card className="absolute inset-0 backface-hidden rotate-y-180 border-2 border-slate-900 shadow-2xl rounded-[2.5rem] flex items-center justify-center p-12 bg-slate-900 text-white">
            <CardContent className="text-center p-0">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 block">Answer</span>
              <h3 className="text-4xl font-bold leading-tight">{currentCard.backText}</h3>
            </CardContent>
          </Card>
        </div>
      </div>

      {isFlipped && (
        <div className="grid grid-cols-6 gap-2 animate-in fade-in slide-in-from-bottom-4">
          {[0, 1, 2, 3, 4, 5].map((q) => (
            <Button
              key={q}
              onClick={() => handleReview(q)}
              className={`h-16 rounded-2xl font-bold text-lg transition-all hover:scale-105 ${
                q < 3 ? 'bg-red-50 text-red-600 hover:bg-red-100' : 
                q === 3 ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' :
                'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
              }`}
            >
              {q}
            </Button>
          ))}
        </div>
      )}
      
      {!isFlipped && (
        <div className="flex justify-center italic text-slate-400 text-sm">
          Press Space or Click the card to reveal
        </div>
      )}
    </div>
  );
}
