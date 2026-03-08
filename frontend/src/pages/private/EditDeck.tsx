import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Trash2, Plus, Upload, FileJson, AlertCircle } from "lucide-react";
import api from "@/api/axios";
import { EditCardDialog } from "@/components/EditCardDialog";
import { Edit3 } from "lucide-react";
import { parseFileAsJson, validateFlashcardBatch } from "@/utils/jsonUtils";
import { toast } from "@/components/ui/sonner";

interface Flashcard {
  id: string;
  frontText: string;
  backText: string;
  tags?: string[];
  extraInfo?: any;
}

export default function EditDeck() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);

  useEffect(() => {
    fetchCards();
  }, [deckId]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Flashcard[]>(`/api/flashcards/deck/${deckId}`);
      setCards(data);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
      toast.error("Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cardId: string) => {
    try {
      await api.delete(`/api/flashcards/${deckId}/${cardId}`);
      setCards(prev => prev.filter(c => c.id !== cardId));
      toast.success("Card deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete card");
    }
  };

  const handleSave = async (updatedData: Partial<Flashcard>) => {
    try {
      if (editingCard) {
        const { data } = await api.put(`/api/flashcards/${editingCard.id}`, updatedData);
        setCards(prev => prev.map(c => c.id === data.id ? data : c));
        toast.success("Card updated");
      } else {
        const { data } = await api.post("/api/flashcards", {
          deckId,
          ...updatedData
        });
        setCards(prev => [...prev, data]);
        toast.success("Card added");
      }
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error("Failed to save card");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const json = await parseFileAsJson(file);
      const validatedCards = validateFlashcardBatch(json);
      
      await api.post("/api/flashcards/batch", {
        flashcards: validatedCards.map(c => ({ ...c, deckId }))
      });
      
      toast.success(`Successfully imported ${validatedCards.length} cards`);
      fetchCards();
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.message || "Upload failed");
    } finally {
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h2 className="text-3xl font-bold text-slate-900">{deckId}</h2>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Input 
              type="file" 
              accept=".json" 
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="border-slate-200 rounded-xl">
              <Upload className="mr-2 h-4 w-4" />
              Import JSON
            </Button>
          </div>
          <Button 
            onClick={() => {
              setEditingCard(null);
              setIsAddingCard(true);
            }}
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p>Loading cards...</p>
        ) : cards.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <FileJson className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No cards in this deck yet.</p>
          </div>
        ) : (
          cards.map(card => (
            <Card key={card.id} className="border-slate-100 shadow-sm hover:border-slate-200 transition-all rounded-2xl group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="grid grid-cols-2 gap-8 flex-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Front</span>
                    <p className="font-medium text-slate-800">{card.frontText}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Back</span>
                    <p className="font-medium text-slate-800">{card.backText}</p>
                  </div>
                </div>
                {card.extraInfo && Object.keys(card.extraInfo).length > 0 && (
                  <div className="px-4 text-xs text-slate-400 font-mono">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Extra Info
                  </div>
                )}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setEditingCard(card);
                      setIsAddingCard(true);
                    }}
                    className="text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl"
                  >
                    <Edit3 className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(card.id)}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <EditCardDialog 
        card={editingCard}
        isOpen={isAddingCard}
        onClose={() => {
          setIsAddingCard(false);
          setEditingCard(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
