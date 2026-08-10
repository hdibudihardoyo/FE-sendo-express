import type { ApiMeta, Pagination } from "./index";

export interface DashboardSummary {
    totalShipmentsThisMonth: number;
    totalRevenue: number;
    inTransitPackages: number;
    deliveredPackages: number;
    activeBranches: number;
    activeCouriers: number;
}

export interface DashboardSummaryResponse {
    meta: ApiMeta;
    data: DashboardSummary;
}

export interface DailyRevenueChart {
    totalRevenue: number;
    startDate: string;
    endDate: string;
    dailyRevenue: {
        date: string;
        revenue: number;
    }[];
}

export interface DailyRevenueChartResponse {
    meta: ApiMeta;
    data: DailyRevenueChart;
}

export interface ShipmentStatusDistribution {
    status: string;
    count: number;
}

export interface VolumeBranch {
    branchId: number;
    branchName: string;
    volume: number;
}

export interface VolumeBranchResponse {
    meta: ApiMeta;
    data: VolumeBranch[];
}

export interface ShipmentStatusDistributionResponse {
    meta: ApiMeta;
    data: ShipmentStatusDistribution[];
}

export interface BranchPerformanceRanking {
    branchId: number;
    branchName: string;
    packagesProcessed: number;
    latePackages: number;
    onTimeRate: number;
}

export interface BranchPerformanceRankingResponse {
    meta: ApiMeta;
    data: BranchPerformanceRanking[];
}

export interface RecentShipments {
    id: number;
    trackingNumber: string;
    createdAt: string;
    customerName: string;
    destinationAddress: string;
    deliveryStatus: string;
    paymentStatus: string;
    price: number;
    currentBranch: string;
}

export interface RecentShipmentsResponse {
    meta: ApiMeta;
    data: RecentShipments[];
    paging: Pagination;
}

export interface ExpiredPayment  {
    paymentId: number;
    externalId: string;
    invoiceId: string;
    expiryDate: string;
    amount: number;
    trackingNumber: string;
}
export interface StuckPackage {
    shipmentId: number;
    trackingNumber: string;
    deliveryStatus: string;
    lastUpdatedAt: string;
    hoursStuck: number;
}

export interface HighQueueBranch {
    branchId: number;
    branchName: string;
    queuedPackages: number;
}

export interface DashboardAlerts{
    expiredPayments: { 
        total: number; 
        items: ExpiredPayment[] 
    };
    stuckPackages: { 
        total: number; 
        items: StuckPackage[] 
    };
    highQueueBranches: HighQueueBranch[];
}

export interface DashboardAlertsResponse {
    meta: ApiMeta;
    data: DashboardAlerts;
    paging: Pagination;
}