"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "./layout";


export default function AuthenticatedLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");

    if (!auth && pathname !== "/") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (pathname === "/") {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
}
