import { Button } from "@/components/ui/button";
import { EditBranchModal } from "../edit-branch-modal";
import { useState } from "react";
import type { Branch } from "@/lib/api";
import { PermissionGuard } from "@/components";
import { useDeleteBranch } from "@/hooks/use-branch";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

interface BranchActionCellProps {
  branch: Branch;
  onDataChange?: () => void;
}

export function BranchActionCell({
  branch,
  onDataChange,
}: BranchActionCellProps) {
  const deleteBranchMutation = useDeleteBranch();
  const [isDeletedDialogOpen, setIsDeletedDialogOpen] = useState(false);
  const handleDelete = async () => {
    try {
      await deleteBranchMutation.mutateAsync(branch.id);

      onDataChange?.();
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <PermissionGuard permission="branches.update">
        <EditBranchModal branch={branch} onBranchUpdated={onDataChange} />
      </PermissionGuard>

      <PermissionGuard permission="branches.delete">
        <Dialog
          open={isDeletedDialogOpen}
          onOpenChange={setIsDeletedDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Hapus
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus <strong>{branch.name}</strong>
                ? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsDeletedDialogOpen(false)}
                disabled={deleteBranchMutation.isPending}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                loading={deleteBranchMutation.isPending}
              >
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PermissionGuard>
    </div>
  );
}
