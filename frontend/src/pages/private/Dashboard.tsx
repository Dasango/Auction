import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Flame, Calendar, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuthStore } from "@/store/auth-store";
import { DeckActionPopup } from "@/components/DeckActionPopup";

interface Deck {
  id: string;
  name: string;
  size: number;
  dueToday: number;
}

const Dashboard = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [totalCards, setTotalCards] = useState(0);
  const [reviewedToday, setReviewedToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [decksRes, cardsRes] = await Promise.all([
          api.get<string[]>("/api/flashcards/decks"),
          api.get<any[]>("/api/flashcards")
        ]);

        const deckIds = decksRes.data;
        setTotalCards(cardsRes.data.length);

        const deckData = await Promise.all(
          deckIds.map(async (id) => {
            const [sizeRes, sessionRes] = await Promise.all([
              api.get(`/api/flashcards/deck/${id}/size`),
              api.get(`/api/sessions`, { params: { deckId: id } }).catch(() => ({ data: { cardsReviewedToday: 0 } }))
            ]);
            
            if (sessionRes.data.cardsReviewedToday > 0) {
              setReviewedToday(prev => prev + sessionRes.data.cardsReviewedToday);
            }

            return {
              id,
              name: id,
              size: sizeRes.data.size,
              dueToday: Math.floor(Math.random() * sizeRes.data.size), // Keep mock logic for "due" as README doesn't specify global due endpoint
            };
          })
        );
        setDecks(deckData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalDue = decks.reduce((acc, deck) => acc + deck.dueToday, 0);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            Welcome back, <span className="text-slate-500 font-medium">{user || 'Explorer'}</span>
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            {totalDue > 0 ? `You have ${totalDue} cards due for review.` : "All caught up for today!"}
          </p>
        </div>
        <Button 
          onClick={() => navigate("/create-deck")}
          className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-6 rounded-2xl text-lg font-bold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]"
        >
          Create New Deck
          <Plus className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard 
          title="Total Cards" 
          value={totalCards.toString()} 
          icon={<Brain className="h-5 w-5 text-purple-500" />} 
          description="In your collection"
        />
        <StatsCard 
          title="Reviewed Today" 
          value={reviewedToday.toString()} 
          icon={<Flame className="h-5 w-5 text-orange-500" />} 
          description="Keep the streak alive!"
        />
        <StatsCard 
          title="Accuracy" 
          value="94%" 
          icon={<Calendar className="h-5 w-5 text-emerald-500" />} 
          description="Last 7 days"
        />
      </div>

      <div className="grid gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">Your Decks</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {loading ? (
              <p>Loading decks...</p>
            ) : (
              decks.map((deck) => (
                <DeckCard 
                  key={deck.id} 
                  deck={deck} 
                  onClick={() => setSelectedDeck(deck)} 
                />
              ))
            )}
          </div>
        </div>
      </div>

      {selectedDeck && (
        <DeckActionPopup 
          isOpen={!!selectedDeck}
          onClose={() => setSelectedDeck(null)}
          deckName={selectedDeck.name}
          onStudy={() => navigate(`/study/${selectedDeck.id}`)}
          onEdit={() => navigate(`/edit/${selectedDeck.id}`)}
        />
      )}
    </div>
  );
};

function StatsCard({ title, value, icon, description }: any) {
  return (
    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</CardTitle>
        <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
        <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{description}</p>
      </CardContent>
    </Card>
  );
}

function DeckCard({ deck, onClick }: { deck: Deck; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-5">
        <div className="h-14 w-14 flex items-center justify-center rounded-2xl font-bold bg-slate-900 text-white text-xl shadow-inner">
          {deck.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-xl text-slate-900 group-hover:text-slate-700 transition-colors">{deck.name}</h4>
          <div className="flex gap-3 mt-1">
            <span className="text-sm font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              {deck.size} cards
            </span>
            {deck.dueToday > 0 && (
              <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                {deck.dueToday} due
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
        <ArrowRight className="h-5 w-5" />
      </div>
    </div>
  );
}

export default Dashboard;