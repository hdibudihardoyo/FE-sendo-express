import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControl } from "@/components/ui/pagination-control";
import { Location } from "iconsax-reactjs";
import type { TaskAction } from "../types";
import { TaskActionDialog } from "../components/task-action-dialog";
import {
  useCourierDashboardSummary,
  useCourierTaskList,
  useCourierRouteMap,
  useCourierOnGoingPackages,
} from "@/hooks/use-dashboard-courier";

const CARD_CLASS = "rounded-2xl border border-border/60 shadow-sm";
const SECTION_GAP = "gap-3 sm:gap-4";
const TASK_LIST_LIMIT = 10;
const ON_GOING_LIMIT = 5;

const STATUS_BADGE_CLASS: Record<string, string> = {
  pickup: "bg-primary/10 text-primary",
  deliver: "bg-orange-500/10 text-orange-600",
};

const todayIso = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export const CourierDashboardPage = () => {
  const [activeTaskAction, setActiveTaskAction] = useState<TaskAction>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const taskListPage = Number(searchParams.get("taskListPage") || 1);
  const taskListLimit = Number(
    searchParams.get("taskListLimit") || TASK_LIST_LIMIT,
  );
  const onGoingPage = Number(searchParams.get("onGoingPage") || 1);
  const onGoingLimit = Number(
    searchParams.get("onGoingLimit") || ON_GOING_LIMIT,
  );

  const handleTaskPageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("taskListPage", String(newPage));
        if (!next.get("taskListLimit")) {
          next.set("taskListLimit", String(TASK_LIST_LIMIT));
        }
        return next;
      },
      { replace: true },
    );
  };

  const handleOnGoingPageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("onGoingPage", String(newPage));
        if (!next.get("onGoingLimit")) {
          next.set("onGoingLimit", String(ON_GOING_LIMIT));
        }
        return next;
      },
      { replace: true },
    );
  };

  const summaryParams = useMemo(
    () => ({ date: todayIso(), page: 1, limit: 1 }),
    [],
  );
  const taskParams = useMemo(
    () => ({ date: todayIso(), page: taskListPage, limit: taskListLimit }),
    [taskListPage, taskListLimit],
  );
  const onGoingParams = useMemo(
    () => ({ date: todayIso(), page: onGoingPage, limit: onGoingLimit }),
    [onGoingPage, onGoingLimit],
  );

  const { data: summaryRes, isLoading: isSummaryLoading } =
    useCourierDashboardSummary(summaryParams);

  const {
    data: taskListRes,
    isLoading: isTaskListLoading,
    isFetching: isTaskListFetching,
  } = useCourierTaskList(taskParams);

  const { data: routeMapRes, isLoading: isRouteMapLoading } =
    useCourierRouteMap();

  const {
    data: onGoingRes,
    isLoading: isOnGoingLoading,
    isFetching: isOnGoingFetching,
  } = useCourierOnGoingPackages(onGoingParams);

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
    <div className={`flex flex-col ${SECTION_GAP}`}>
      <div className={`grid ${SECTION_GAP} xl:grid-cols-[1.8fr_1fr]`}>
        {/* Tugas Hari Ini */}
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base">
              Tugas Hari Ini
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Daftar paket pickup dan delivery yang harus diselesaikan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-2 sm:px-6">
            {isTaskListLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : courierTasks.length === 0 ? (
              <div className="rounded-xl bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
                Tidak ada tugas untuk hari ini
              </div>
            ) : (
              <div
                className={
                  isTaskListFetching
                    ? "space-y-2 opacity-60 transition-opacity"
                    : "space-y-2"
                }
              >
                {courierTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl bg-muted/30 p-3 sm:p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium sm:text-base">
                        {task.trackingNumber}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          STATUS_BADGE_CLASS[task.taskType] ??
                          "bg-background text-muted-foreground"
                        }`}
                      >
                        {task.deliveryStatus}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
                      {task.taskType === "pickup"
                        ? task.pickupAddress
                        : task.destinationAddress}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant="darkGreen"
                        size="sm"
                        className="flex-1 sm:flex-none"
                        onClick={() =>
                          setActiveTaskAction({
                            title: task.trackingNumber,
                            type: "pickup",
                          })
                        }
                      >
                        Pickup
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none"
                        onClick={() =>
                          setActiveTaskAction({
                            title: task.trackingNumber,
                            type: "deliver",
                          })
                        }
                      >
                        Deliver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {taskListRes?.paging && taskListRes.paging.totalPages > 1 && (
              <PaginationControl
                paging={taskListRes.paging}
                onPageChange={handleTaskPageChange}
              />
            )}
          </CardContent>
        </Card>

        {/* Sidebar: KPI + Rute */}
        <div className={`grid ${SECTION_GAP} content-start`}>
          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base">KPI Tugas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 px-2 sm:px-6">
              {isSummaryLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))
                : courierTaskKpis.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl bg-muted/30 p-3"
                    >
                      <div className="text-[11px] text-muted-foreground sm:text-xs">
                        {item.label}
                      </div>
                      <div className="mt-1 text-xl font-semibold sm:text-2xl">
                        {item.value}
                      </div>
                    </div>
                  ))}
            </CardContent>
          </Card>

          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base">
                Rute Harian
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              {isRouteMapLoading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : !route ? (
                <div className="rounded-xl bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  <Location
                    size={24}
                    variant="Bold"
                    className="mx-auto mb-3 text-primary"
                  />
                  Belum ada rute aktif saat ini
                </div>
              ) : (
                <div className="rounded-xl bg-muted/30 p-4 text-left">
                  <div className="mb-2 flex items-center gap-2 text-foreground">
                    <Location
                      size={20}
                      variant="Bold"
                      className="shrink-0 text-primary"
                    />
                    <span className="truncate text-sm font-medium">
                      {route.trackingNumber}
                    </span>
                    <span className="ml-auto shrink-0 rounded-full bg-background px-2 py-0.5 text-xs">
                      {route.deliveryStatus}
                    </span>
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Cabang: {route.courierBranch.name}
                  </p>
                  <ol className="space-y-2">
                    {route.points.map((point, index) => (
                      <li
                        key={`${point.name}-${index}`}
                        className="rounded-lg bg-background px-3 py-2 text-xs"
                      >
                        <span className="font-medium text-foreground">
                          {point.type}
                        </span>{" "}
                        | {point.name}
                        <div className="text-muted-foreground/80">
                          {point.address}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline Paket */}
      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm sm:text-base">Timeline Paket</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Status paket yang sedang dipegang
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-2 sm:px-6">
          {isOnGoingLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : onGoingPackages.length === 0 ? (
            <div className="rounded-xl bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
              Tidak ada paket yang sedang berjalan
            </div>
          ) : (
            <div
              className={
                isOnGoingFetching
                  ? "space-y-5 opacity-60 transition-opacity"
                  : "space-y-5"
              }
            >
              {onGoingPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-xl border border-border/40 p-3 sm:p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium sm:text-base">
                      {pkg.trackingNumber}
                    </span>
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                      {pkg.deliveryStatus}
                    </span>
                  </div>
                  <div className="mb-3 truncate text-xs text-muted-foreground sm:text-sm">
                    {pkg.recipientName} · {pkg.destinationAddress}
                  </div>
                  <div className="space-y-4 pl-1">
                    {pkg.timeline.data.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-3">
                        <div className="mt-1.5 flex shrink-0 flex-col items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                          {index < pkg.timeline.data.length - 1 && (
                            <div className="mt-1 h-8 w-px bg-border" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium">
                            {step.status}
                          </div>
                          <div className="text-xs text-muted-foreground sm:text-sm">
                            {step.description}
                          </div>
                          <div className="mt-1 text-[11px] text-muted-foreground/80 sm:text-xs">
                            {step.branchName ?? "Belum ada info cabang"} ·{" "}
                            {new Date(step.createdAt).toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    ))}
                    {pkg.timeline.data.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Belum ada timeline untuk paket ini.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {onGoingRes?.paging && onGoingRes.paging.totalPages > 1 && (
            <PaginationControl
              paging={onGoingRes.paging}
              onPageChange={handleOnGoingPageChange}
            />
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
    </div>
  );
};
