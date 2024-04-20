import { RouterInputs, trpc } from "@client/services/trpc";
// import { ReactQueryOptions, RouterInputs, trpc } from "@client/services/trpc";

// type UsersMeOptions = ReactQueryOptions["users"]["me"];
type UsersMeInput = RouterInputs["users"]["me"];

export function useUsersMe(input: UsersMeInput, options: { enabled: boolean }) {
  return trpc.users.me.useQuery(input, options);
}
