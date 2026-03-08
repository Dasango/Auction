import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuthStore } from "@/store/auth-store";
import { DeckActionPopup } from "@/components/DeckActionPopup";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  RadialBarChart, 
  RadialBar, 
  LabelList,
  ResponsiveContainer 
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";

// Interfaz actualizada con los campos reales de tu API
interface Flashcard {
  id: string;
  deckId: string;
  nextReviewDate: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
}

interface UrgencyData {
  category: string;
  label: string;
  count: number;
  fill: string;
}

interface Deck {
  id: string;
  name: string;
  size: number;
  sessionSize: number;
  urgencyDistribution: UrgencyData[];
}

const mainChartConfig = {
  size: { label: "Deck Size", color: "#0f172a" },
  sessionSize: { label: "Session Size", color: "#3b82f6" },
} satisfies ChartConfig;

const radialChartConfig = {
  count: { label: "Cards" },
  urgent: { label: "△", color: "#ef4444" }, // <= 1 día
  young: { label: "O", color: "#f97316" },   // 2 - 5 días
  mature: { label: "♠", color: "#eab308" }, // 6 - 21 días
  known: { label: "☆", color: "#22c55e" },   // > 21 días
} satisfies ChartConfig;

const Dashboard = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const decksRes = await api.get<string[]>("/api/flashcards/decks");
        const deckIds = decksRes.data;

        const deckData = await Promise.all(
          deckIds.map(async (id) => {
            const [sizeRes, sessionRes] = await Promise.all([
              api.get(`/api/flashcards/deck/${id}/size`),
              api.get(`/api/sessions`, { params: { deckId: id } }).catch(() => ({ 
                data: { flashcardsToReview: [] } 
              }))
            ]);

            const flashcards: Flashcard[] = sessionRes.data.flashcardsToReview || [];
            const sessionSize = flashcards.length;

            // Clasificar por urgencia usando el 'interval'
            const counts = { urgent: 0, young: 0, mature: 0, known: 0 };
            
            flashcards.forEach((card) => {
              if (card.interval <= 1) counts.urgent++;
              else if (card.interval <= 5) counts.young++;
              else if (card.interval <= 21) counts.mature++;
              else counts.known++;
            });

            // El orden de este array dicta el orden de los anillos (el primero es el más interno)
            const urgencyDistribution = [
              { category: "urgent", label: "Urgent (≤1d)", count: counts.urgent, fill: "var(--color-urgent)" },
              { category: "young", label: "Young (2-5d)", count: counts.young, fill: "var(--color-young)" },
              { category: "mature", label: "Mature (6-21d)", count: counts.mature, fill: "var(--color-mature)" },
              { category: "known", label: "Known (>21d)", count: counts.known, fill: "var(--color-known)" },
            ].filter(d => d.count > 0); 

            return {
              id,
              name: id,
              size: sizeRes.data.size,
              sessionSize,
              urgencyDistribution
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

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            Welcome back, <span className="text-slate-500 font-medium">{user || 'Explorer'}</span>
          </h2>
        </div>
        <Button 
          onClick={() => navigate("/create-deck")}
          className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-6 rounded-2xl text-lg font-bold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]"
        >
          Create New Deck
          <Plus className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {!loading && decks.length > 0 && (
        <Card className="border-slate-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Deck vs. Session Size</CardTitle>
            <CardDescription>Comparison of total cards and pending cards per deck.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={mainChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={decks} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="size" fill="var(--color-size)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sessionSize" fill="var(--color-sessionSize)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-slate-900">Your Decks</h3>
        {loading ? (
          <p>Loading decks...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {decks.map((deck) => (
              <DeckExtendedCard key={deck.id} deck={deck} onClick={() => setSelectedDeck(deck)} />
            ))}
          </div>
        )}
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

function DeckExtendedCard({ deck, onClick }: { deck: Deck; onClick: () => void }) {
  return (
    <Card 
      onClick={onClick}
      className="group cursor-pointer border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl font-bold bg-slate-900 text-white text-lg shadow-inner">
            {deck.name.charAt(0)}
          </div>
          <div>
            <CardTitle className="text-xl text-slate-900 group-hover:text-slate-700 transition-colors">
              {deck.name}
            </CardTitle>
            <div className="flex gap-2 mt-1">
              <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                {deck.size} Total Cards
              </span>
            </div>
          </div>
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
          <ArrowRight className="h-5 w-5" />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
        <div className="flex flex-col text-center md:text-left">
          <span className="text-sm text-slate-500">Session Size</span>
          <span className="text-4xl font-bold text-slate-900">{deck.sessionSize}</span>
        </div>
        
        <div className="w-full max-w-[200px]">
          {deck.urgencyDistribution.length > 0 ? (
            <ChartContainer
              config={radialChartConfig}
              className="mx-auto aspect-square max-h-[200px]"
            >
              <RadialBarChart
                data={deck.urgencyDistribution}
                startAngle={-90}
                endAngle={380}
                innerRadius={30}
                outerRadius={100}
              >
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="label" />} />
                <RadialBar dataKey="count" background>
                  <LabelList
                    position="insideStart"
                    dataKey="label"
                    className="fill-white capitalize mix-blend-luminosity"
                    fontSize={11}
                  />
                </RadialBar>
              </RadialBarChart>
            </ChartContainer>
          ) : (
             <div className="mx-auto aspect-square max-h-[200px] rounded-full border-4 border-slate-100 border-dashed flex items-center justify-center">
                <span className="text-sm text-slate-400 font-medium text-center px-4">No Cards in Session</span>
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Dashboard;