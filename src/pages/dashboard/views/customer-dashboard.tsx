import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, SearchNormal1 } from "iconsax-reactjs";
import { CARD_CLASS, SECTION_GAP } from "../constants";
import { customerActiveShipmentSteps, customerHistory } from "../mock-data";

export const CustomerDashboard = () => {
  const [trackingNumber, setTrackingNumber] = useState("");

  return (
    <>
      <div className={`grid ${SECTION_GAP} lg:grid-cols-[1.5fr_1fr]`}>
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status Paket Aktif</CardTitle>
            <CardDescription>Ikhtisar progress paket Anda saat ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-muted/30 p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Tracking</div>
                  <div className="mt-1 text-lg font-semibold">SEN001234567</div>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  In Transit
                </span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {customerActiveShipmentSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-lg bg-background px-4 py-2.5">
                    <div className={`h-2 w-2 rounded-full ${index <= 3 ? "bg-primary" : "bg-border"}`} />
                    <div>
                      <div className="text-sm font-medium">{step}</div>
                      <div className="text-xs text-muted-foreground">{index <= 3 ? "Selesai" : "Menunggu"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cari Tracking</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="relative">
              <SearchNormal1
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Masukkan nomor resi, mis. SEN123456789"
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Lihat status real-time paket Anda dengan memasukkan nomor resi di atas.
            </p>
            <Button variant="darkGreen" className="w-full" disabled={!trackingNumber.trim()}>
              Lacak Paket
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className={`grid ${SECTION_GAP} xl:grid-cols-[1.4fr_1fr]`}>
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Riwayat Pengiriman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {customerHistory.map((item) => (
              <div key={item.tracking} className="flex items-center gap-3 rounded-xl bg-muted/30 p-4">
                {item.status === "Delivered" ? (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                    <Camera size={18} variant="Bold" />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{item.tracking}</div>
                      <div className="text-sm text-muted-foreground">{item.date}</div>
                    </div>
                    <span className="rounded-full bg-background px-3 py-1 text-xs">{item.status}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:bg-transparent">
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="darkGreen" className="w-full">Buat Kiriman Baru</Button>
            <Button variant="outline" className="w-full">Lihat Estimasi Biaya</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};