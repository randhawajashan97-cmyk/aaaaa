import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
export const ORDER_STATUSES = ["pending", "confirmed", "preparing", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const listOrders = createServerFn({ method: "GET" })
  .handler(async () => {
    const { getOrdersList } = await import("./orders-store.server");
    return await getOrdersList();
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string(), status: z.enum(ORDER_STATUSES) }).parse(d))
  .handler(async ({ data }) => {
    const { updateOrder } = await import("./orders-store.server");
    const ok = await updateOrder(data.id, data.status);
    if (!ok) throw new Error("Could not update the order.");
    return { ok: true as const };
  });
