import { Page } from "@/components/ui/page";
import { DataTable } from "./components/datatable";
import { createColumns } from "./components/datatable/columns";
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { AddSquare } from "iconsax-reactjs";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useUserAddresses } from "@/hooks/use-user-address";
import { PaginationControl } from "@/components/ui/pagination-control";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const DEFAULT_LIMIT = 10;

export default function UserAddressesPage() {
  useMeta(META_DATA["user-addresses"]);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const [limit] = useState(Number(searchParams.get("limit")) || DEFAULT_LIMIT);
  const addressParam = searchParams.get("address") ?? "";
  const [inputAddress, setInputAddress] = useState(addressParam);
  const debouncedAddress = useDebounce(inputAddress, 400);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedAddress) {
          next.set("address", debouncedAddress);
        } else {
          next.delete("address");
        }
        if (!next.get("limit")) {
          next.set("limit", String(DEFAULT_LIMIT));
        }
        next.set("page", "1");
        return next;
      },
      { replace: true },
    );
  }, [debouncedAddress]);

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(newPage));
    setSearchParams(next, { replace: true });
  };

  const {
    data,
    isLoading: loadingUserAddresses,
    isFetching: fetchingUserAddresses,
    error: errorUserAddresses,
  } = useUserAddresses({
    address: debouncedAddress || undefined,
    page,
    limit,
  });

  const userAddresses = data?.data ?? [];
  const paging = data?.paging;
  const isLoadingAddress = loadingUserAddresses || fetchingUserAddresses;

  if (errorUserAddresses) {
    return (
      <Page title="Alamat Saya">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600">
              Gagal memuat data alamat: {errorUserAddresses.message}
            </p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Alamat Saya"
      action={
        <Link to="/user-addresses/add">
          <Button variant="darkGreen">
            Tambah Alamat Baru
            <AddSquare className="ml-auto" variant="Bold" size="20" />
          </Button>
        </Link>
      }
    >
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Cari berdasarkan alamat"
          className="w-full max-w-sm bg-white"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
        />
      </div>
      {isLoadingAddress ? (
         <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Memuat data alamat...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <DataTable
            data={userAddresses}
            columns={createColumns()}
            title="Daftar Alamat"
          />
          {paging && paging.totalPages > 1 && (
            <PaginationControl
              paging={paging}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
      <Toaster position="top-right" />
    </Page>
  );
}
