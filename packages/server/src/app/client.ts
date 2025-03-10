import {
  createTRPCProxyClient,
  CreateTRPCProxyClient,
  httpBatchLink,
  HTTPBatchLinkOptions,
  splitLink,
} from "@trpc/client";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";

import type { AppRouter } from "@/app/router";

type CreateClientOptions = {
  httpUrl: string;
  wsUrl: string;
  httpHeaders?: HTTPBatchLinkOptions["headers"];
};

/**
 * Creates a tRPC client to talk to a server.
 *
 * @param options - See {@link CreateClientOptions}.
 * @returns A typed tRPC {@link CreateTRPCProxyClient} client typed to the {@link AppRouter}.
 */
export function createClient({ httpUrl, wsUrl, httpHeaders }: CreateClientOptions): CreateTRPCProxyClient<AppRouter> {
  return createTRPCProxyClient({
    links: [
      splitLink({
        condition: (op) => op.type === "subscription",
        true: wsLink({
          client: createWSClient({ url: wsUrl }),
        }),
        false: httpBatchLink({
          url: httpUrl,
          headers: httpHeaders,
        }),
      }),
    ],
  });
}
