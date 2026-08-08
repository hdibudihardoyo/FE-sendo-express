import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Barcode, Camera, Location } from "iconsax-reactjs";
import { CARD_CLASS, SECTION_GAP } from "../constants";
import type { TaskAction } from "../types";
import { TaskActionDialog } from "../components/task-action-dialog";
import { courierTasks, courierTaskKpis } from "../mock-data";

export const CourierDashboard = () => {
  const [activeTaskAction, setActiveTaskAction] = useState<TaskAction>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const closeTaskDialog = () => {
    setActiveTaskAction(null);
    setPhotoPreview(null);
  };

  return (
    <>
      <div className={`grid ${SECTION_GAP} lg:grid-cols-[1.8fr_1fr]`}>
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tugas Hari Ini</CardTitle>
            <CardDescription>Daftar paket pickup dan delivery yang harus diselesaikan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {courierTasks.map((task) => (
              <div key={task.title} className="rounded-xl bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">{task.title}</span>
                  <span className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground">
                    {task.status}
                  </span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{task.location}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="darkGreen"
                    size="sm"
                    onClick={() => setActiveTaskAction({ title: task.title, type: "pickup" })}
                  >
                    Pickup
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTaskAction({ title: task.title, type: "deliver" })}
                  >
                    Deliver
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className={`grid ${SECTION_GAP}`}>
          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">KPI Tugas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {courierTaskKpis.map((item) => (
                <div key={item.label} className="rounded-xl bg-muted/30 p-4">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="mt-1 text-2xl font-semibold">{item.value}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Rute Harian</CardTitle>
            </CardHeader>
            <CardContent className="rounded-xl bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              <Location size={24} variant="Bold" className="mx-auto mb-3 text-primary" />
              Peta rute antar titik pickup, cabang, dan alamat penerima.
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Aksi Cepat</CardTitle>
          <CardDescription>Shortcut operasional untuk kurir di lapangan.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          <Button variant="darkGreen" size="sm" className="w-full justify-between">
            Scan Barcode Paket <Barcode size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between"
            onClick={() => setActiveTaskAction({ title: "Konfirmasi umum", type: "deliver" })}
          >
            Konfirmasi Deliver <Camera size={16} />
          </Button>
        </CardContent>
      </Card>

      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Timeline Paket</CardTitle>
          <CardDescription>Status paket yang sedang dipegang.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {courierTasks.map((task, index) => (
            <div key={task.title} className="flex items-start gap-4">
              <div className="mt-1.5 flex flex-col items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                {index < courierTasks.length - 1 && <div className="mt-1 h-8 w-px bg-border" />}
              </div>
              <div>
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-muted-foreground">{task.location}</div>
                <div className="mt-1 text-xs text-muted-foreground/80">
                  {task.status} · Foto bukti tersedia setelah selesai
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <TaskActionDialog
        activeTaskAction={activeTaskAction}
        photoPreview={photoPreview}
        onPhotoChange={handlePhotoChange}
        onClose={closeTaskDialog}
        onConfirm={closeTaskDialog}
      />
    </>
  );
};