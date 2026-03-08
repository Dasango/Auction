import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FlashcardForm } from "./FlashcardForm";
import type { FlashcardFormData } from "./FlashcardForm";

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
  const [formData, setFormData] = useState<FlashcardFormData>({
    frontText: "",
    backText: "",
    tags: [],
    extraInfo: {}
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (card) {
      setFormData({
        frontText: card.frontText,
        backText: card.backText,
        tags: card.tags || [],
        extraInfo: card.extraInfo || {}
      });
    }
  }, [card]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
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
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {card?.id ? "Edit Card" : "Add New Card"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <FlashcardForm 
            data={formData} 
            onChange={setFormData}
          />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl border-slate-200">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading || !formData.frontText.trim() || !formData.backText.trim()}
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8"
          >
            {loading ? "Saving..." : card?.id ? "Save Changes" : "Add Card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
