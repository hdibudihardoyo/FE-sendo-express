import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { DirectboxReceive, DirectboxSend } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  deliveryFormSchema,
  type DeliveryFormData,
} from "@/lib/validations/shipment";
import { useUserAddresses } from "@/hooks/use-user-address";
import { useCreateShipment } from "@/hooks/use-shipment";

export function DeliveryForm() {
  const navigate = useNavigate();
  const { data: userAddressesResponse, isLoading: addressesLoading } =
    useUserAddresses();
  const userAddresses = userAddressesResponse?.data ?? [];
  const createShipment = useCreateShipment();

  const defaultValues: DeliveryFormData = {
    pickupAddressId: 0,
    destinationAddress: "",
    packageType: "",
    recipientName: "",
    recipientPhone: "",
    senderName: "",
    senderPhone: "",
    totalWeight: 500,
    deliveryType: "regular",
  };

  const form = useForm<DeliveryFormData>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues,
  });

  async function onSubmit(values: DeliveryFormData) {
    if (userAddresses.length === 0) {
      toast.error(
        "Anda belum memiliki alamat. Silakan tambah alamat terlebih dahulu.",
      );
      navigate("/send-package/no-address");
      return;
    }

    createShipment.mutate(values, {
      onSuccess: (shipment) => {
        navigate(`/send-package/pay/${shipment.id}`);
      },
      onError: (error: Error) => {
        toast.error(
          error.message || "Gagal membuat pengiriman. Silakan coba lagi.",
        );
      },
    });
  }

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle>Detail Pengiriman</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="pickupAddressId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasi Jemput</FormLabel>
                      <FormControl>
                        {addressesLoading ? (
                          <Input
                            disabled
                            placeholder="Memuat alamat..."
                            startIcon={DirectboxSend}
                            iconProps={{
                              className: "text-primary",
                              variant: "Bold",
                            }}
                          />
                        ) : (
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={
                              field.value ? field.value.toString() : undefined
                            }
                          >
                            <SelectTrigger className="w-full h-12 px-4 text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-lg transition-colors">
                              <div className="flex items-center">
                                <DirectboxSend
                                  className="text-primary mr-2"
                                  size={20}
                                  variant="Bold"
                                />
                                <SelectValue placeholder="Pilih alamat jemput" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {userAddresses.map((address) => (
                                <SelectItem
                                  key={address.id}
                                  value={address.id.toString()}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {address.label} - {address.address}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormMessage />
                      {userAddresses.length === 0 && !addressesLoading && (
                        <p className="text-sm text-red-500">
                          Belum ada alamat.{" "}
                          <button
                            type="button"
                            className="underline"
                            onClick={() => navigate("/user-addresses/add")}
                          >
                            Tambah alamat
                          </button>
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destinationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasi Pengiriman</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Jalan Kayu Manis No. 10"
                          startIcon={DirectboxReceive}
                          iconProps={{
                            className: "text-warning",
                            variant: "Bold",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Pengirim</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan nama pengirim"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon Pengirim</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan nomor telepon pengirim"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Jenis Pengiriman</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12 px-4 text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-lg transition-colors">
                            <SelectValue placeholder="Pilih jenis pengiriman" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="regular">
                            Regular (3-5 hari) - Rp 8.000
                          </SelectItem>
                          <SelectItem value="same_day">
                            Same Day (6–8 jam) - Rp 15.000
                          </SelectItem>
                          <SelectItem value="next_day">
                            Next Day (1–2 hari) - Rp 13.000
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Penerima</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan nama penerima"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon Penerima</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan nomor telepon penerima"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Berat (gram)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="10"
                          min="100"
                          placeholder="Masukkan berat paket dalam gram (contoh: 500)"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="packageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paketnya berupa apa?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12 px-4 text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-lg transition-colors">
                            <SelectValue placeholder="Pilih jenis paket" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Furniture">Furniture</SelectItem>
                          <SelectItem value="Electronics">
                            Elektronik
                          </SelectItem>
                          <SelectItem value="Clothing">Pakaian</SelectItem>
                          <SelectItem value="Documents">Dokumen</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-dark-green"
                  loading={createShipment.isPending}
                >
                  Lanjut
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
