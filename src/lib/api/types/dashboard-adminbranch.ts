import type { ApiMeta, Pagination } from './index';

export interface AdminBranchDashboardSummary {
    packagesInToday: number;
    packagesOutToday: number;
    totalActivity: number;
    readyToPickup: number;
}

export interface AdminBranchDashboardSummaryResponse {
    data: AdminBranchDashboardSummary;
    meta: ApiMeta;
}

export interface RecentScanLogs {
    id: number;
    trackingNumber: string;
    type: string;
    status: string;
    description: string;
    scanTime: string;
    scannedBy: {
        id: number;
        name: string;
        email: string;
    }
}

export interface RecentScanLogsResponse {
    meta: ApiMeta;
    data: RecentScanLogs[];
    paging: Pagination;
}

export interface DailyActivity {
    date: string;
    incoming: number;
    outgoing: number;
}

export interface ActivityTrend {
    totalIncoming: number;
    totalOutgoing: number;
    startDate: string;
    endDate: string;
    dailyActivity: DailyActivity[];
}

export interface ActivityTrendResponse {
    meta: ApiMeta;
    data: ActivityTrend;
}

export interface StuckPackagesAlert {
    shipmentId: number;
    trackingNumber: string;
    deliveryStatus: string;
    inScannedAt: string;
    hoursSinceIn: number;
}

export interface StuckPackagesAlertResponse {
    meta: ApiMeta;
    data: StuckPackagesAlert[];
}