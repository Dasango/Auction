import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface FlashcardFormData {
  frontText: string;
  backText: string;
  tags: string[];
  extraInfo: any;
}

interface FlashcardFormProps {
  data: FlashcardFormData;
  onChange: (newData: FlashcardFormData) => void;
  index?: number; // Optional index for batch display
}

export const FlashcardForm: React.FC<FlashcardFormProps> = ({ data, onChange, index }) => {
  const handleFieldChange = (field: keyof FlashcardFormData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleTagsChange = (val: string) => {
    const tags = val.split(",").map(t => t.trim()).filter(t => t !== "");
    handleFieldChange("tags", tags);
  };

  const handleExtraInfoChange = (val: string) => {
    try {
      const parsed = JSON.parse(val);
      handleFieldChange("extraInfo", parsed);
    } catch (e) {
      // Allow user to keep typing malformed JSON but store the string raw if needed?
      // For now, we'll just keep the raw value in state for the textarea
      // and let the parent handle the error on submit if it's still invalid
    }
  };

  // We need a local state for extraInfo string to allow typing
  const [extraInfoStr, setExtraInfoStr] = React.useState(
    JSON.stringify(data.extraInfo || {}, null, 2)
  );

  // Sync back if parent changes data (e.g. on load)
  React.useEffect(() => {
    setExtraInfoStr(JSON.stringify(data.extraInfo || {}, null, 2));
  }, [data.extraInfo]);

  return (
    <div className="space-y-4">
      {index !== undefined && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Card {index + 1}</span>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase">Front Text</Label>
          <Textarea 
            placeholder="The question or concept..."
            value={data.frontText}
            onChange={(e) => handleFieldChange("frontText", e.target.value)}
            className="min-h-[100px] rounded-xl border-slate-200 focus:ring-slate-900 transition-all resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase">Back Text</Label>
          <Textarea 
            placeholder="The answer or explanation..."
            value={data.backText}
            onChange={(e) => handleFieldChange("backText", e.target.value)}
            className="min-h-[100px] rounded-xl border-slate-200 focus:ring-slate-900 transition-all resize-none"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase">Tags (comma separated)</Label>
          <Input 
            placeholder="e.g. grammar, verb, important"
            value={data.tags.join(", ")}
            onChange={(e) => handleTagsChange(e.target.value)}
            className="rounded-xl border-slate-200 focus:ring-slate-900 transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase">Extra Info (JSON)</Label>
          <Textarea 
            placeholder='{ "example": "..." }'
            value={extraInfoStr}
            onChange={(e) => {
              setExtraInfoStr(e.target.value);
              handleExtraInfoChange(e.target.value);
            }}
            className="font-mono text-xs rounded-xl border-slate-200 focus:ring-slate-900 transition-all min-h-[50px] resize-none"
          />
        </div>
      </div>
    </div>
  );
};
