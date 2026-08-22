import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Page } from "@/components/ui/page";
import {
  Box,
  TruckFast,
  Timer,
  CloseCircle,
  CallIncoming,
  CallOutgoing,
  Gps,
  Profile2User,
  I3DCubeScan,
  User,
  Location,
} from "iconsax-reactjs";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useTrackShipment } from "@/hooks/use-shipment";
import type { DeliveryStatus } from "@/lib/api";
import {
  getPackageTypeLabel,
  getStatusLabel,
  getStatusIcon,
  getStatusBadgeVariant,
} from "@/lib/utils/status-utils";

const Index = () => {
  // Use custom meta hook
  useMeta(META_DATA["track-package"]);

  const [trackingNumber, setTrackingNumber] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const trackShipment = useTrackShipment();
  const shipment = trackShipment.data;

  const handleTrack = () => {
    if (!trackingNumber.trim()) {
      toast.error("Silakan masukkan nomor resi");
      return;
    }
    setHasSearched(true);
    trackShipment.mutate(trackingNumber.trim());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sortedHistories = shipment?.shipmentHistories
    ? [...shipment.shipmentHistories].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];

  return (
    <>
      <Page title="Cek Status Pengiriman Paket 🕵️‍♂️ 👀 ">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Lacak Paketmu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="text"
                  placeholder="Masukkan No Resi"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                />
                <Button
                  variant="darkGreen"
                  className="w-full"
                  onClick={handleTrack}
                  loading={trackShipment.isPending}
                >
                  Lacak
                </Button>

                <p className="text-sm text-secondary mt-3 text-center">
                  Nomor resi contoh: TRK9876543210
                </p>
              </CardContent>
            </Card>

            {/* Status Pengiriman */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Status Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                {shipment ? (
                  <div className="w-full space-y-6">
                    {/* Package Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary p-3 rounded-xl text-white">
                            <Box size={16} variant="Bold" />
                          </div>
                          <div>
                            <h3 className="text-sm text-secondary">No. Resi</h3>
                            <p className="font-semibold">
                              {shipment.trackingNumber || "Tidak tersedia"}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="bg-dark-green p-3 rounded-xl text-white">
                            <I3DCubeScan size={16} variant="Bold" />
                          </div>
                          <div>
                            <h3 className="text-sm text-secondary">
                              Jenis Paket
                            </h3>
                            <p className="font-semibold capitalize">
                              {shipment.shipmentDetail?.packageType
                                ? getPackageTypeLabel(
                                    shipment.shipmentDetail.packageType,
                                  )
                                : "Tidak tersedia"}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Status Badge */}
                    <div className="text-center">
                      <Badge
                        variant={getStatusBadgeVariant(shipment.deliveryStatus)}
                        className="text-lg px-4 py-2"
                      >
                        {getStatusLabel(shipment.deliveryStatus)}
                      </Badge>
                    </div>

                    {/* Sender and Recipient Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 rounded-xl">
                        <h3 className="font-semibold mb-3 text-center">
                          Pengirim
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary p-3 rounded-xl text-white">
                              <User size={16} variant="Bold" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {shipment.shipmentDetail?.senderName ||
                                  "Tidak tersedia"}
                              </p>
                              <p className="text-sm text-secondary">Nama</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="bg-primary p-3 rounded-xl text-white">
                              <CallOutgoing size={16} variant="Bold" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {shipment.shipmentDetail?.senderPhone ||
                                  "Tidak tersedia"}
                              </p>
                              <p className="text-sm text-secondary">Telepon</p>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 rounded-xl">
                        <h3 className="font-semibold mb-3 text-center">
                          Penerima
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-oranye p-3 rounded-xl text-white">
                              <Profile2User size={16} variant="Bold" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {shipment.shipmentDetail?.recipientName ||
                                  "Tidak tersedia"}
                              </p>
                              <p className="text-sm text-secondary">Nama</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="bg-oranye p-3 rounded-xl text-white">
                              <CallIncoming size={16} variant="Bold" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {shipment.shipmentDetail?.recipientPhone ||
                                  "Tidak tersedia"}
                              </p>
                              <p className="text-sm text-secondary">Telepon</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary p-3 rounded-xl text-white">
                          <Gps size={16} variant="Bold" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Alamat Penjemputan</h4>
                          <p className="text-sm text-secondary">
                            {shipment.pickupAddress?.address ||
                              "Tidak tersedia"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-oranye p-3 rounded-xl text-white">
                          <Location size={16} variant="Bold" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Alamat Tujuan</h4>
                          <p className="text-sm text-secondary">
                            {shipment.shipmentDetail?.destinationAddress ||
                              "Tidak tersedia"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : hasSearched ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <CloseCircle size={64} className="text-red-500" />
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">
                        Paket Tidak Ditemukan
                      </h3>
                      <p className="text-secondary">
                        Nomor resi yang Anda masukkan tidak ditemukan. Pastikan
                        nomor resi sudah benar.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <TruckFast
                      size={64}
                      variant="Bold"
                      className="text-secondary"
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">
                        Lacak Paketmu
                      </h3>
                      <p className="text-secondary">
                        Masukkan nomor resi di atas untuk melihat status
                        pengiriman paket Anda.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Riwayat Pengiriman */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Riwayat Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {sortedHistories.length > 0 ? (
                  sortedHistories.map((history, index) => (
                    <div
                      key={history.id}
                      className="flex items-start gap-3 p-4 border rounded-2xl"
                    >
                      <div
                        className={`p-4 rounded-2xl text-white ${
                          index === 0 ? "bg-primary" : "bg-dark-green"
                        }`}
                      >
                        {getStatusIcon(
                          history.status as
                            | "READY_TO_PICKUP"
                            | "WAITING_FOR_PICKUP"
                            | "PICKED_UP"
                            | "IN_TRANSIT"
                            | "ARRIVED_AT_BRANCH"
                            | "DEPARTED_FROM_BRANCH"
                            | "READY_TO_PICKUP_AT_BRANCH"
                            | "DELIVERED"
                            | "COMPLETED"
                            | "ON_THE_WAY"
                            | "ON_THE_WAY_TO_ADDRESS"
                            | "READY_TO_DELIVER"
                            | "AT_BRANCH"
                            | null,
                        )}
                      </div>
                      <div className="space-y-2 flex-1">
                        <h2 className="font-semibold">
                          {getStatusLabel(history.status as DeliveryStatus)}
                        </h2>
                        <p className="text-sm text-secondary">
                          {formatDate(history.createdAt)}
                        </p>
                        {history.description && (
                          <p className="text-sm text-secondary">
                            {history.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : hasSearched ? (
                  <div className="text-center py-8 text-secondary">
                    <Timer size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Belum ada riwayat pengiriman</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-secondary">
                    <Box size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Masukkan nomor resi untuk melihat riwayat pengiriman</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Toaster position="top-right" />
      </Page>
    </>
  );
};
export default Index;
