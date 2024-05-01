import { useEffect, useState, useMemo } from "react";
import { useLinksAnalyze } from "@client/services/hooks/useLinksAnalyze";
import { trpc, trpcBroker } from "@client/services/trpc";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@client/components/ui/table";

type Link = {
  id: number;
  title: string;
  description: string;
  url: string;
};

const LinksTable = () => {
  const [parent] = useAutoAnimate();
  const columnHelper = createColumnHelper<Link>();

  const columns: ColumnDef<Link, any>[] = [
    columnHelper.accessor((row) => row.id, {
      id: "id",
      header: () => "ID",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.title, {
      id: "title",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => "Title",
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.description, {
      id: "description",
      header: () => "Description",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.url, {
      id: "url",
      header: () => <span>URL</span>,
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.id, {
      id: "analyze",
      header: () => "Analyze",
      cell: (info) => {
        return (
          <button
            onClick={() => handleLinksAnalyze(info.getValue())}
            disabled={linkAnalyze.isPending}
          >
            Analyze links
          </button>
        );
      },
      footer: (info) => info.column.id,
    }),
  ];

  const [links, setLinks] = useState<Link[]>([]);

  const table = useReactTable({
    data: links,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const linkAnalyze = useLinksAnalyze();
  // const links = useLinksFindAll();
  const utils = trpc.useUtils();
  const infiniteLinks = trpc.hyperlinks.get.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // initialCursor: 1, // <-- optional you can pass an initialCursor
    },
  );

  const totalLinks = useMemo(() => {
    const total = infiniteLinks.data?.pages.at(0)?.total;
    if (total) return total;
    return 0;
  }, [infiniteLinks.data?.pages]);

  useEffect(() => {
    const arrays = infiniteLinks.data?.pages.map((page) => page.links);
    const result = arrays?.reduce(
      (accumulator, links) => [...accumulator, ...links],
      [],
    );
    if (result) {
      setLinks(result);
    }
  }, [infiniteLinks.data?.pages]);

  trpcBroker.update.useSubscription(
    { type: "links" },
    {
      onStarted() {
        console.log("Started update subscription");
      },
      onData(data) {
        console.log(data);
        utils.hyperlinks.get.invalidate();
      },
    },
  );

  trpcBroker.update.useSubscription(
    { type: "analyze" },
    {
      onStarted() {
        console.log("Started reports subscription");
      },
      onData(data) {
        console.log(data);
        utils.hyperlinks.get.invalidate();
      },
    },
  );

  const handleLinksAnalyze = (id: number) => {
    linkAnalyze.mutate({
      id: id,
      type: "analyze",
    });
  };

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="p-2" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody ref={parent}>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-b border-gray-200">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {table.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableFooter>
      </Table>
      {links && links?.length !== 0 && totalLinks > links?.length && (
        <button
          onClick={() => {
            infiniteLinks.fetchNextPage();
          }}
          disabled={infiniteLinks.isLoading}
        >
          Fetch Next Page
        </button>
      )}
    </div>
  );
};

export default LinksTable;
