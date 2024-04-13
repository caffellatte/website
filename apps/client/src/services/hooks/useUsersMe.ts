import { ReactQueryOptions, RouterInputs, trpc } from "@client/services/trpc";

type UsersMeOptions = ReactQueryOptions["users"]["me"];
type UsersMeInput = RouterInputs["users"]["me"];

export function useUsersMe(input: UsersMeInput, options?: UsersMeOptions) {
  return trpc.users.me.useQuery(input, options);
}
