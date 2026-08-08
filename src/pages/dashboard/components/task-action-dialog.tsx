import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Camera } from "iconsax-reactjs";
import type { TaskAction } from "../types";

type TaskActionDialogProps = {
  activeTaskAction: TaskAction;
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export const TaskActionDialog = ({
  activeTaskAction,
  photoPreview,
  onPhotoChange,
  onClose,
  onConfirm,
}: TaskActionDialogProps) => (
  <Dialog open={!!activeTaskAction} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="rounded-2xl sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {activeTaskAction?.type === "pickup" ? "Konfirmasi Pickup" : "Konfirmasi Deliver"}
        </DialogTitle>
        <DialogDescription>{activeTaskAction?.title}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3">
        <label
          htmlFor="proof-photo"
          className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground"
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Bukti" className="h-full w-full rounded-xl object-cover" />
          ) : (
            <>
              <Camera size={28} variant="Bold" className="text-primary" />
              Ambil / unggah foto bukti
            </>
          )}
        </label>
        <input
          id="proof-photo"
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onPhotoChange}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" size="sm" onClick={onClose}>
          Batal
        </Button>
        <Button variant="darkGreen" size="sm" disabled={!photoPreview} onClick={onConfirm}>
          Simpan & Konfirmasi
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);