import type { ApiMeta, Pagination } from "./index";

export interface DashboardSummary {
    totalTasksToday: number;
    waiting: number;
    onGoing: number;
    completedToday: number;
}

export interface DashboardSummaryResponse {
    data: DashboardSummary;
    meta: ApiMeta;
}

export interface CourierTaskList {
    id: number;
    trackingNumber: string;
    taskType: string;
    deliveryStatus: string;
    badge: string;
    pickupAddress: string;
    pickupLatitude: number;
    pickupLongitude: number;
    destinationAddress: string;
    destinationLatitude: number;
    destinationLongitude: number;
    recipientName: string;
    recipientPhone: string;
    senderName: string;
    packageType: string;
    weight: number;
    handledAt: string;
}

export interface CourierTaskListResponse {
    meta: ApiMeta;
    data: CourierTaskList[];
    paging: Pagination;
}

export interface CourierBranch {
    id: number;
    name: string;
    address: string;
}

export interface Points {
    type: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

export interface CourierRouteMap {
    shipmentId: number;
    trackingNumber: string;
    deliveryStatus: string;
    badge: string;
    courierBranch: CourierBranch;
    points: Points[];
}

export interface CourierRouteMapResponse {
    meta: ApiMeta;
    data: CourierRouteMap;
}

export interface Timeline {
    id: number;
    status: string;
    description: string;
    branchName: string;
    createdAt: string;
}

export interface CourierOnGoingPackages {
    id: number;
    trackingNumber: string;
    deliveryStatus: string;
    badge: string;
    destinationAddress: string;
    recipientName: string;
    recipientPhone: string;
    packageType: string;
    weight: number;
    lastHandledAt: string;
    timeline: Timeline[];
}

export interface CourierOnGoingPackagesResponse {
    meta: ApiMeta;
    data: CourierOnGoingPackages[];
}