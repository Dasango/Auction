import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Flashcard {
  id: string;
  frontText: string;
  backText: string;
  tags?: string[];
  extraInfo?: any;
}

interface EditCardDialogProps {
  card: Flashcard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCard: Partial<Flashcard>) => Promise<void>;
}

export function EditCardDialog({ card, isOpen, onClose, onSave }: EditCardDialogProps) {
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [tags, setTags] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (card) {
      setFrontText(card.frontText);
      setBackText(card.backText);
      setTags(card.tags?.join(", ") || "");
      setExtraInfo(JSON.stringify(card.extraInfo || {}, null, 2));
    }
  }, [card]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let parsedExtra = {};
      try {
        parsedExtra = JSON.parse(extraInfo);
      } catch (e) {
        console.warn("Invalid JSON in extraInfo, using empty object");
      }

      await onSave({
        frontText,
        backText,
        tags: tags.split(",").map(t => t.trim()).filter(t => t !== ""),
        extraInfo: parsedExtra
      });
      onClose();
    } catch (error) {
      console.error("Failed to save card:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-slate-200 rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Edit Card</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="front" className="font-bold text-slate-700">Front Text</Label>
            <Textarea
              id="front"
              value={frontText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFrontText(e.target.value)}
              className="border-slate-200 focus:ring-slate-900 rounded-xl min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="back" className="font-bold text-slate-700">Back Text</Label>
            <Textarea
              id="back"
              value={backText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBackText(e.target.value)}
              className="border-slate-200 focus:ring-slate-900 rounded-xl min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags" className="font-bold text-slate-700">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
              className="border-slate-200 focus:ring-slate-900 rounded-xl"
              placeholder="e.g. basic, verbs, essential"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="extra" className="font-bold text-slate-700">Extra Info (JSON)</Label>
            <Textarea
              id="extra"
              value={extraInfo}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExtraInfo(e.target.value)}
              className="border-slate-200 focus:ring-slate-900 rounded-xl font-mono text-xs"
              placeholder='{ "example": "..." }'
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl border-slate-200">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
