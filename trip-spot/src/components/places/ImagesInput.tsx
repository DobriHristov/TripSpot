import { useRef, useState } from "react";
import { Link2, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { imagesApi } from "../../services/api";
import { getErrorMessage } from "../../utils/errors";
import { resolveImage } from "../../utils/images";
import { isImageUrl } from "../../utils/validators";

interface ImagesInputProps {
  value: string[];
  onChange: (images: string[]) => void;
}

export function ImagesInput({ value, onChange }: ImagesInputProps) {
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addLink = () => {
    const url = link.trim();
    if (!isImageUrl(url)) {
      toast.error("Въведи валиден линк (http/https).");
      return;
    }
    onChange([...value, url]);
    setLink("");
  };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const added: string[] = [];

    for (const file of Array.from(files)) {
      try {
        added.push(await imagesApi.upload(file));
      } catch (e) {
        toast.error(`${file.name}: ${getErrorMessage(e)}`);
      }
    }

    onChange([...value, ...added]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 gap-2">
          <Input
            id="images"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLink();
              }
            }}
            placeholder="https://… линк към снимка"
          />
          <Button type="button" variant="outline" onClick={addLink}>
            <Link2 className="h-4 w-4" /> Добави
          </Button>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}{" "}
          Качи от компютъра
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => upload(e.target.files)}
        />
      </div>
      {value.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {value.map((src, i) => (
            <li
              key={`${src}-${i}`}
              className="relative aspect-square overflow-hidden rounded-xl border bg-muted"
            >
              <img
                src={resolveImage(src)}
                alt={`Снимка ${i + 1}`}
                className="h-full w-full object-cover"
              />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                  Корица
                </span>
              )}
              <button
                type="button"
                aria-label="Премахни снимката"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-card/90 text-foreground shadow-soft hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
