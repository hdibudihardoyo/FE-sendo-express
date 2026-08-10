import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Barcode, Camera, Location } from "iconsax-reactjs";
import type { TaskAction } from "../types";
import { TaskActionDialog } from "../components/task-action-dialog";
import {
  useCourierDashboardSummary,
  useCourierTaskList,
  useCourierRouteMap,
  useCourierOnGoingPackages,
} from "@/hooks/use-dashboard-courier";

const CARD_CLASS = "rounded-2xl border border-border/60 shadow-sm";
const SECTION_GAP = "gap-4";

const TASK_LIST_LIMIT = 10;

const todayIso = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export const CourierDashboardPage = () => {
  const [activeTaskAction, setActiveTaskAction] = useState<TaskAction>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const params = useMemo(
    () => ({ date: todayIso(), page: 1, limit: TASK_LIST_LIMIT }),
    []
  );

  const { data: summaryRes, isLoading: isSummaryLoading } = useCourierDashboardSummary(params);
  const { data: taskListRes, isLoading: isTaskListLoading } = useCourierTaskList(params);
  const { data: routeMapRes, isLoading: isRouteMapLoading } = useCourierRouteMap();
  const { data: onGoingRes, isLoading: isOnGoingLoading } = useCourierOnGoingPackages();

  const courierTaskKpis = useMemo(() => {
    const s = summaryRes?.data;
    if (!s) return [];
    return [
      { label: "Total Tugas Hari Ini", value: s.totalTasksToday },
      { label: "Menunggu", value: s.waiting },
      { label: "Sedang Berjalan", value: s.onGoing },
      { label: "Selesai Hari Ini", value: s.completedToday },
    ];
  }, [summaryRes]);

  const courierTasks = taskListRes?.data ?? [];
  const onGoingPackages = onGoingRes?.data ?? [];
  const route = routeMapRes?.data?.[0];
  
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
            {isTaskListLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
            ) : courierTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada tugas untuk hari ini.</p>
            ) : (
              courierTasks.map((task) => (
                <div key={task.id} className="rounded-xl bg-muted/30 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">{task.trackingNumber}</span>
                    <span className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground">
                      {task.deliveryStatus}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {task.taskType === "pickup" ? task.pickupAddress : task.destinationAddress}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="darkGreen"
                      size="sm"
                      onClick={() =>
                        setActiveTaskAction({ title: task.trackingNumber, type: "pickup" })
                      }
                    >
                      Pickup
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setActiveTaskAction({ title: task.trackingNumber, type: "deliver" })
                      }
                    >
                      Deliver
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className={`grid ${SECTION_GAP}`}>
          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">KPI Tugas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {isSummaryLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
              ) : (
                courierTaskKpis.map((item) => (
                  <div key={item.label} className="rounded-xl bg-muted/30 p-4">
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                    <div className="mt-1 text-2xl font-semibold">{item.value}</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Rute Harian</CardTitle>
            </CardHeader>
            <CardContent className="rounded-xl bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              {isRouteMapLoading ? (
                <Skeleton className="h-32 w-full rounded-lg" />
              ) : !route ? (
                <>
                  <Location size={24} variant="Bold" className="mx-auto mb-3 text-primary" />
                  Belum ada rute aktif saat ini.
                </>
              ) : (
                <div className="text-left">
                  <div className="mb-2 flex items-center gap-2 text-foreground">
                    <Location size={20} variant="Bold" className="text-primary shrink-0" />
                    <span className="font-medium">{route.trackingNumber}</span>
                    <span className="ml-auto rounded-full bg-background px-2 py-0.5 text-xs">
                      {route.deliveryStatus}
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Cabang: {route.courierBranch.name}
                  </p>
                  <ol className="space-y-1.5">
                    {route.points.map((point, index) => (
                      <li key={`${point.name}-${index}`} className="text-xs">
                        <span className="font-medium text-foreground">{point.type}</span> — {point.name}
                        <div className="text-muted-foreground/80">{point.address}</div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
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
        <CardContent className="space-y-5">
          {isOnGoingLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
          ) : onGoingPackages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada paket yang sedang berjalan.</p>
          ) : (
            onGoingPackages.map((pkg) => (
              <div key={pkg.id}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{pkg.trackingNumber}</span>
                  <span className="rounded-full bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                    {pkg.deliveryStatus}
                  </span>
                </div>
                <div className="mb-3 text-sm text-muted-foreground">
                  {pkg.recipientName} · {pkg.destinationAddress}
                </div>
                <div className="space-y-4 pl-1">
                  {pkg.timeline.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="mt-1.5 flex flex-col items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        {index < pkg.timeline.length - 1 && <div className="mt-1 h-8 w-px bg-border" />}
                      </div>
                      <div>
                        <div className="font-medium">{step.status}</div>
                        <div className="text-sm text-muted-foreground">{step.description}</div>
                        <div className="mt-1 text-xs text-muted-foreground/80">
                          {step.branchName} · {new Date(step.createdAt).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
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