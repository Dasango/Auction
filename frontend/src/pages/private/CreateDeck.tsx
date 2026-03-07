import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowLeft, Save, Sparkles, Layers } from "lucide-react";
import api from "@/api/axios";

interface FlashcardInput {
  frontText: string;
  backText: string;
  tags: string[];
}

const CreateDeck = () => {
  const navigate = useNavigate();
  const [deckName, setDeckName] = useState("");
  const [step, setStep] = useState(1); // 1: Name, 2: Choose Method, 3: Add Cards
  const [isBatch, setIsBatch] = useState(false);
  const [cards, setCards] = useState<FlashcardInput[]>([{ frontText: "", backText: "", tags: [] }]);
  const [loading, setLoading] = useState(false);

  const handleAddCard = () => {
    setCards([...cards, { frontText: "", backText: "", tags: [] }]);
  };

  const handleRemoveCard = (index: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const handleCardChange = (index: number, field: keyof FlashcardInput, value: string) => {
    const newCards = [...cards];
    if (field === "tags") {
      newCards[index].tags = value.split(",").map(t => t.trim()).filter(t => t !== "");
    } else {
      newCards[index][field] = value as string;
    }
    setCards(newCards);
  };

  const handleSubmit = async () => {
    if (!deckName.trim()) {
      return;
    }

    const validCards = cards.filter(c => c.frontText.trim() && c.backText.trim());
    if (validCards.length === 0) {
      return;
    }

    setLoading(true);
    try {
      if (validCards.length === 1) {
        await api.post("/api/flashcards", {
          deckId: deckName,
          ...validCards[0]
        });
      } else {
        await api.post("/api/flashcards/batch", {
          flashcards: validCards.map(c => ({
            deckId: deckName,
            ...c
          }))
        });
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create deck:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => step > 1 ? setStep(step - 1) : navigate("/dashboard")}
          className="rounded-full h-12 w-12 p-0 hover:bg-slate-100"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create New Deck</h1>
          <p className="text-slate-500">Step {step} of 3</p>
        </div>
      </div>

      {step === 1 && (
        <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
            <CardTitle className="text-2xl font-bold text-slate-900">Name your deck</CardTitle>
            <CardDescription className="text-slate-500 text-lg">
              Choose a descriptive name for your study collection.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="deckName" className="text-sm font-bold uppercase tracking-widest text-slate-400">Deck Name</Label>
              <Input 
                id="deckName"
                placeholder="e.g. Spanish Vocabulary, React Ninja..."
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="text-xl p-6 h-16 rounded-2xl border-slate-200 focus:ring-slate-900 focus:border-slate-900 transition-all"
              />
            </div>
            <Button 
              disabled={!deckName.trim()}
              onClick={() => setStep(2)}
              className="w-full bg-slate-900 text-white hover:bg-slate-800 py-8 rounded-2xl text-xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
          <Card 
            className="group border-slate-200 shadow-md hover:shadow-2xl hover:border-slate-300 rounded-3xl cursor-pointer transition-all duration-300"
            onClick={() => { setIsBatch(false); setStep(3); }}
          >
            <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
              <div className="h-20 w-20 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                <Sparkles className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Personalize</h3>
                <p className="text-slate-500">Create your first card manually with full detail.</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="group border-slate-200 shadow-md hover:shadow-2xl hover:border-slate-300 rounded-3xl cursor-pointer transition-all duration-300"
            onClick={() => { setIsBatch(true); setStep(3); }}
          >
            <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
              <div className="h-20 w-20 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                <Layers className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Batch Addition</h3>
                <p className="text-slate-500">Quickly add multiple cards to get started fast.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              {isBatch ? "Add Multiple Cards" : "Create First Card"}
            </h2>
            {isBatch && (
              <Button 
                onClick={handleAddCard}
                variant="outline"
                className="rounded-xl border-slate-200 hover:bg-slate-50 font-bold"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Another
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {cards.map((card, index) => (
              <Card key={index} className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 -m-6 mb-4 p-4 px-6 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Card {index + 1}</span>
                    {isBatch && cards.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveCard(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase">Front Text</Label>
                      <Textarea 
                        placeholder="The question or concept..."
                        value={card.frontText}
                        onChange={(e) => handleCardChange(index, "frontText", e.target.value)}
                        className="min-h-[100px] rounded-xl border-slate-200 focus:ring-slate-900 transition-all resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase">Back Text</Label>
                      <Textarea 
                        placeholder="The answer or explanation..."
                        value={card.backText}
                        onChange={(e) => handleCardChange(index, "backText", e.target.value)}
                        className="min-h-[100px] rounded-xl border-slate-200 focus:ring-slate-900 transition-all resize-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Tags (comma separated)</Label>
                    <Input 
                      placeholder="e.g. grammar, verb, important"
                      value={card.tags.join(", ")}
                      onChange={(e) => handleCardChange(index, "tags", e.target.value)}
                      className="rounded-xl border-slate-200 focus:ring-slate-900 transition-all"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={loading || cards.some(c => !c.frontText.trim() || !c.backText.trim())}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 py-8 rounded-2xl text-xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-[0.98] mt-8"
          >
            {loading ? "Creating Deck..." : (
              <span className="flex items-center gap-2">
                <Save className="h-5 w-5" /> 
                {isBatch ? `Create Deck with ${cards.length} Cards` : "Create Deck"}
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateDeck;
