import { useQueryClient } from "@tanstack/react-query";
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
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { TaskAction } from "../types";
import {
  usePickShipment,
  usePickUpShipment,
  useDeliverToBranch,
  usePickFromBranch,
  usePickUpFromBranch,
  useDeliverToCustomer,
} from "@/hooks/use-delivery";
import { useUploadMedia } from "@/hooks/use-media";
import { courierDashboardKeys } from "@/hooks/use-dashboard-courier";

const PHOTO_REQUIRED_STATUSES = ["WAITING_FOR_PICKUP", "ON_THE_WAY_TO_ADDRESS"];

type TaskActionDialogProps = {
  activeTaskAction: TaskAction;
  onClose: () => void;
  onActionComplete: () => void;
};

export const TaskActionDialog = ({
  activeTaskAction,
  onClose,
  onActionComplete,
}: TaskActionDialogProps) => {
  const queryClient = useQueryClient();
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickShipment = usePickShipment();
  const pickUpShipment = usePickUpShipment();
  const deliverToBranch = useDeliverToBranch();
  const pickFromBranch = usePickFromBranch();
  const pickUpFromBranch = usePickUpFromBranch();
  const deliverToCustomer = useDeliverToCustomer();
  const uploadMedia = useUploadMedia();

  const requiresPhoto =
    !!activeTaskAction &&
    PHOTO_REQUIRED_STATUSES.includes(activeTaskAction.deliveryStatus);

  const isLoading =
    isSubmitting ||
    pickShipment.isPending ||
    pickUpShipment.isPending ||
    deliverToBranch.isPending ||
    pickFromBranch.isPending ||
    pickUpFromBranch.isPending ||
    deliverToCustomer.isPending ||
    uploadMedia.isPending;

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Harap pilih file gambar");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }
    setSelectedPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    if (isLoading) return;
    setSelectedPhoto(null);
    setPhotoPreview(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (!activeTaskAction) return;
    const { title, type, deliveryStatus } = activeTaskAction;
    setIsSubmitting(true);
    try {
      switch (deliveryStatus) {
        case "READY_TO_PICKUP":
          await pickShipment.mutateAsync(title);
          break;
        case "WAITING_FOR_PICKUP":
          if (selectedPhoto) {
            const uploaded = await uploadMedia.mutateAsync(selectedPhoto);
            await pickUpShipment.mutateAsync({
              trackingNumber: title,
              data: { pickupProofImageUrl: uploaded.fileUrl },
            });
          }
          break;
        case "PICKED_UP":
          await deliverToBranch.mutateAsync(title);
          break;
        case "READY_TO_PICKUP_AT_BRANCH":
          await pickFromBranch.mutateAsync(title);
          break;
        case "READY_TO_DELIVER":
          await pickUpFromBranch.mutateAsync(title);
          break;
        case "ON_THE_WAY_TO_ADDRESS":
          if (selectedPhoto) {
            const uploaded = await uploadMedia.mutateAsync(selectedPhoto);
            await deliverToCustomer.mutateAsync({
              trackingNumber: title,
              data: { receiptProofImageUrl: uploaded.fileUrl },
            });
          }
          break;
        default:
          if (type === "pickup") {
            await pickShipment.mutateAsync(title);
          } else {
            await pickUpFromBranch.mutateAsync(title);
          }
          break;
      }
      await queryClient.invalidateQueries({
        queryKey: courierDashboardKeys.all,
      });
      setSelectedPhoto(null);
      setPhotoPreview(null);
      onActionComplete();
    } catch {
      // error toast sudah ditangani oleh hook masing-masing
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!activeTaskAction} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {activeTaskAction?.type === "pickup"
              ? "Konfirmasi Pickup"
              : "Konfirmasi Deliver"}
          </DialogTitle>
          <DialogDescription>{activeTaskAction?.title}</DialogDescription>
        </DialogHeader>
        {requiresPhoto ? (
          <div className="grid gap-3">
            <label
              htmlFor="proof-photo"
              className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground"
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Bukti"
                  className="h-full w-full rounded-xl object-cover"
                />
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
              onChange={handlePhotoChange}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Klik konfirmasi untuk melanjutkan aksi{" "}
            {activeTaskAction?.type === "pickup"
              ? "pickup"
              : "pengiriman"}{" "}
            paket ini.
          </p>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant="darkGreen"
            size="sm"
            onClick={handleConfirm}
            disabled={requiresPhoto && !photoPreview}
            loading={isLoading}
          >
            {requiresPhoto ? "Simpan & Konfirmasi" : "Konfirmasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
