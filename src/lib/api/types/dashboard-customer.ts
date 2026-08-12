import type { ApiMeta, Pagination } from "./index";

export interface Steps {
    key: string;
    label: string;
    completed: boolean;
    active: boolean;
}

export interface ActiveShipments {
    shipmentId: number;
    trackingNumber: string;
    deliveryStatus: string;
    paymentStatus: string;
    recipientName: string;
    destinationAddress: string;
    createdAt: string;
    currentStep: number;
    steps: Steps[]
}

export interface ActiveShipmentsResponse {
    meta: ApiMeta
    data: ActiveShipments[]
    paging: Pagination
}

export interface ShipmentHistory {
    shipmentId: number
    trackingNumber: string
    deliveryStatus: string
    paymentStatus: string
    statusDate: string
    recipientName: string
    destinationAddress: string
    pickupProof: string
    receiptProof: string
}

export interface shipmentsHistoryResponse {
    meta: ApiMeta
    data: ShipmentHistory[]
    paging: Pagination
}