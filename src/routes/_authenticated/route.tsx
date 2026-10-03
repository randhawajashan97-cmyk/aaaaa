import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      const staffSession = localStorage.getItem("ambrocia_staff_session");
      if (staffSession) {
        try {
          const user = JSON.parse(staffSession);
          if (user?.email) return { user };
        } catch {}
      }
    }

    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) return { user: data.user };
    } catch {}

    throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});
