"use client";

import LinkCreate from "@client/components/ui/template/LinkCreate/LinkCreate";
import LinksTable from "@client/components/ui/template/LinksTable";
// import { useLinkFindById } from "@client/services/hooks/useLinkFindById";

const Home = () => {
  // const link = useLinkFindById({ id: 1 });
  return (
    <main className="flex flex-col justify-between gap-3 w-full flex-grow">
      <LinksTable />
      <LinkCreate />
    </main>
  );
};

export default Home;
