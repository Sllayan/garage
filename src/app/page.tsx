"use client";

import { Badge } from "@/components/ui/badge";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { io, Socket } from "socket.io-client";

type MarketProps = {
  coin: string;
  pairs: {
    IRT: {
      expensive_exchange: "BITPIN" | "WALLEX" | "BITPIN";
      chip_exchange: "BITPIN" | "WALLEX" | "BITPIN";
      nobitex: {
        price: number;
        affordable_value: number;
        fee: number;
      };
      bitpin: {
        price: number;
        affordable_value: number;
        fee: number;
      };
      wallex: {
        price: number;
        affordable_value: number;
        fee: number;
      };
      differences: {
        N_B: {
          price: number;
          percentage: number;
          benefit: number;
        };
        N_W: {
          price: number;
          percentage: number;
          benefit: number;
        };
        B_W: {
          price: number;
          percentage: number;
          benefit: number;
        };
      };
    };
    USDT: {
      expensive_exchange: "BITPIN" | "WALLEX" | "BITPIN";
      chip_exchange: "BITPIN" | "WALLEX" | "BITPIN";
      nobitex: {
        price: number;
        affordable_value: number;
        fee: number;
      };
      bitpin: {
        price: number;
        affordable_value: number;
        fee: number;
      };
      wallex: {
        price: number;
        affordable_value: number;
        fee: number;
      };
      differences: {
        N_B: {
          price: number;
          percentage: number;
          benefit: number;
        };
        N_W: {
          price: number;
          percentage: number;
          benefit: number;
        };
        B_W: {
          price: number;
          percentage: number;
          benefit: number;
        };
      };
    };
  };
};

export default function Home() {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [market, setMarket] = React.useState<MarketProps[]>([]);
  const [usdtMarket, setUsdtMarket] = React.useState<MarketProps | null>(null);

  React.useEffect(() => {
    if (!socket) {
      setSocket(() => io("ws://localhost:3000"));
    }
    return () => {
      socket?.close();
    };
  }, []);

  const sendNotification = (data: MarketProps["pairs"]["IRT"]) => {
    let n = {
      title: "Do something",
      body: "text",
      icon: "/favicon.ico",
    };
    if (data.differences.B_W.benefit < 0) {
      n = {
        ...n,
        body: `Nobitex (${data.nobitex.price.toFixed(
          2
        )}IRT) is higher than Bitpin (${data.bitpin.price.toFixed(2)}IRT)`,
      };
    }
    if (data.differences.N_B.benefit < 0) {
      n = {
        ...n,
        body: `Nobitex (${data.nobitex.price.toFixed(
          2
        )}IRT) is higher than Wallex (${data.wallex.price.toFixed(2)}IRT)`,
      };
    }
    if (data.differences.N_W.benefit < 0) {
      n = {
        ...n,
        body: `Wallex (${data.wallex.price.toFixed(
          2
        )}IRT) is higher than Bitpin (${data.bitpin.price.toFixed(2)}IRT)`,
      };
    }
    if (data.differences.B_W.benefit > 0) {
      n = {
        ...n,
        body: `Bitpin (${data.bitpin.price.toFixed(
          2
        )}IRT) is higher than Wallex (${data.wallex.price.toFixed(2)}IRT)`,
      };
    }
    if (data.differences.N_B.benefit > 0) {
      n = {
        ...n,
        body: `Wallex (${data.wallex.price.toFixed(
          2
        )}IRT) is higher than Nobitex (${data.nobitex.price.toFixed(2)}IRT)`,
      };
    }
    if (data.differences.N_W.benefit > 0) {
      n = {
        ...n,
        body: `Bitpin (${data.bitpin.price.toFixed(
          2
        )}IRT) is higher than Nobitex (${data.nobitex.price.toFixed(2)}IRT)`,
      };
    }
    new Notification(n.title, { body: n.body, icon: n.icon });
  };

  React.useEffect(() => {
    if (socket === null) {
      return;
    }
    if (socket) {
      socket.on("MARKET", (event: { content: MarketProps[] }) => {
        setMarket(event.content);
      });
      socket.on("USDT_MARKET", (event: { content: MarketProps }) => {
        if (
          Math.abs(event.content.pairs.IRT.differences.N_B.benefit) >
            20000000 ||
          Math.abs(event.content.pairs.IRT.differences.N_B.benefit) >
            20000000 ||
          Math.abs(event.content.pairs.IRT.differences.N_W.benefit) > 20000000
        ) {
          sendNotification(event.content.pairs.IRT);
        }
        setUsdtMarket(event.content);
      });
    }
  }, [socket]);

  const columnHelper = createColumnHelper<MarketProps>();

  const columns = [
    columnHelper.accessor("coin", { cell: (info) => info.getValue() }),
    columnHelper.group({
      header: "IRT",
      columns: [
        columnHelper.accessor("pairs.IRT.expensive_exchange", {
          cell: (info) =>
            info.getValue() === "BITPIN" ? (
              <Badge variant="bitpin">{info.getValue()}</Badge>
            ) : info.getValue() === "WALLEX" ? (
              <Badge variant="wallex">{info.getValue()}</Badge>
            ) : (
              <Badge variant="nobitex">{info.getValue()}</Badge>
            ),
          header: "expensive",
        }),
        columnHelper.accessor("pairs.IRT.chip_exchange", {
          cell: (info) =>
            info.getValue() === "BITPIN" ? (
              <Badge variant="bitpin">{info.getValue()}</Badge>
            ) : info.getValue() === "WALLEX" ? (
              <Badge variant="wallex">{info.getValue()}</Badge>
            ) : (
              <Badge variant="nobitex">{info.getValue()}</Badge>
            ),
          header: "chip",
        }),
        columnHelper.group({
          header: "Nobitex",
          columns: [
            columnHelper.accessor("pairs.IRT.nobitex.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "price",
            }),
            columnHelper.accessor("pairs.IRT.nobitex.affordable_value", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "affordable",
            }),
            columnHelper.accessor("pairs.IRT.nobitex.fee", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "fee",
            }),
          ],
        }),
        columnHelper.group({
          header: "Bitpin",
          columns: [
            columnHelper.accessor("pairs.IRT.bitpin.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "price",
            }),
            columnHelper.accessor("pairs.IRT.bitpin.affordable_value", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "affordable",
            }),
            columnHelper.accessor("pairs.IRT.bitpin.fee", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "fee",
            }),
          ],
        }),
        columnHelper.group({
          header: "Wallex",
          columns: [
            columnHelper.accessor("pairs.IRT.wallex.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "price",
            }),
            columnHelper.accessor("pairs.IRT.wallex.affordable_value", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "affordable",
            }),
            columnHelper.accessor("pairs.IRT.wallex.fee", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "fee",
            }),
          ],
        }),
        columnHelper.group({
          header: "Differences",
          columns: [
            columnHelper.accessor("pairs.IRT.differences.N_B.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "N-B",
            }),
            columnHelper.accessor("pairs.IRT.differences.N_B.percentage", {
              cell: (info) =>
                info.getValue() ? `${info.getValue().toFixed(2)}%` : "-",
              header: "%",
            }),
            columnHelper.accessor("pairs.IRT.differences.N_B.benefit", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "benefit",
            }),
            columnHelper.accessor("pairs.IRT.differences.N_W.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "N-W",
            }),
            columnHelper.accessor("pairs.IRT.differences.N_W.percentage", {
              cell: (info) =>
                info.getValue() ? `${info.getValue().toFixed(2)}%` : "-",
              header: "%",
            }),
            columnHelper.accessor("pairs.IRT.differences.N_W.benefit", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "benefit",
            }),
            columnHelper.accessor("pairs.IRT.differences.B_W.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "B-W",
            }),
            columnHelper.accessor("pairs.IRT.differences.B_W.percentage", {
              cell: (info) =>
                info.getValue() ? `${info.getValue().toFixed(2)}%` : "-",
              header: "%",
            }),
            columnHelper.accessor("pairs.IRT.differences.B_W.benefit", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "benefit",
            }),
          ],
        }),
      ],
    }),
    columnHelper.group({
      header: "USDT",
      columns: [
        columnHelper.accessor("pairs.USDT.expensive_exchange", {
          cell: (info) =>
            info.getValue() === "BITPIN" ? (
              <Badge variant="bitpin">{info.getValue()}</Badge>
            ) : info.getValue() === "WALLEX" ? (
              <Badge variant="wallex">{info.getValue()}</Badge>
            ) : (
              <Badge variant="nobitex">{info.getValue()}</Badge>
            ),
          header: "expensive",
        }),
        columnHelper.accessor("pairs.USDT.chip_exchange", {
          cell: (info) =>
            info.getValue() === "BITPIN" ? (
              <Badge variant="bitpin">{info.getValue()}</Badge>
            ) : info.getValue() === "WALLEX" ? (
              <Badge variant="wallex">{info.getValue()}</Badge>
            ) : (
              <Badge variant="nobitex">{info.getValue()}</Badge>
            ),
          header: "chip",
        }),
        columnHelper.group({
          header: "Nobitex",
          columns: [
            columnHelper.accessor("pairs.USDT.nobitex.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "price",
            }),
            columnHelper.accessor("pairs.USDT.nobitex.affordable_value", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "affordable",
            }),
            columnHelper.accessor("pairs.USDT.nobitex.fee", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "fee",
            }),
          ],
        }),
        columnHelper.group({
          header: "Bitpin",
          columns: [
            columnHelper.accessor("pairs.USDT.bitpin.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "price",
            }),
            columnHelper.accessor("pairs.USDT.bitpin.affordable_value", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "affordable",
            }),
            columnHelper.accessor("pairs.USDT.bitpin.fee", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "fee",
            }),
          ],
        }),
        columnHelper.group({
          header: "Wallex",
          columns: [
            columnHelper.accessor("pairs.USDT.wallex.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "price",
            }),
            columnHelper.accessor("pairs.USDT.wallex.affordable_value", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "Affordable",
            }),
            columnHelper.accessor("pairs.USDT.wallex.fee", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(4) : "-",
              header: "Fee",
            }),
          ],
        }),
        columnHelper.group({
          header: "Differences",
          columns: [
            columnHelper.accessor("pairs.USDT.differences.N_B.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "N-B",
            }),
            columnHelper.accessor("pairs.USDT.differences.N_B.percentage", {
              cell: (info) =>
                info.getValue() ? `${info.getValue().toFixed(2)}%` : "-",
              header: "%",
            }),
            columnHelper.accessor("pairs.USDT.differences.N_B.benefit", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "benefit",
            }),
            columnHelper.accessor("pairs.USDT.differences.N_W.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "N-W",
            }),
            columnHelper.accessor("pairs.USDT.differences.N_W.percentage", {
              cell: (info) =>
                info.getValue() ? `${info.getValue().toFixed(2)}%` : "-",
              header: "%",
            }),
            columnHelper.accessor("pairs.USDT.differences.N_W.benefit", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "benefit",
            }),
            columnHelper.accessor("pairs.USDT.differences.B_W.price", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "B-W",
            }),
            columnHelper.accessor("pairs.USDT.differences.B_W.percentage", {
              cell: (info) =>
                info.getValue() ? `${info.getValue().toFixed(2)}%` : "-",
              header: "%",
            }),
            columnHelper.accessor("pairs.USDT.differences.B_W.benefit", {
              cell: (info) =>
                info.getValue() ? Number(info.getValue()).toFixed(2) : "-",
              header: "benefit",
            }),
          ],
        }),
      ],
    }),
  ];

  const table = useReactTable({
    data: market.filter(
      (item) =>
        [
          item.pairs.IRT?.bitpin,
          item.pairs.IRT?.wallex,
          item.pairs.IRT?.nobitex,
        ].filter((value) => value).length > 1 ||
        [
          item.pairs.USDT?.bitpin,
          item.pairs.USDT?.wallex,
          item.pairs.USDT?.nobitex,
        ].filter((value) => value).length > 1
    ),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="text-center border border-solid"
                  style={{
                    backgroundColor:
                      header.column.columnDef.header === "Wallex"
                        ? "var(--wallex)"
                        : header.column.columnDef.header === "Bitpin"
                        ? "var(--bitpin)"
                        : header.column.columnDef.header === "Nobitex"
                        ? "var(--nobitex)"
                        : "var(--geist-background)",
                    color: ["Wallex", "Bitpin", "Nobitex"].includes(
                      header.column.columnDef.header as string
                    )
                      ? "white"
                      : "black",
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {usdtMarket && (
            <tr className="text-center border border-solid">
              <td>{usdtMarket?.coin}</td>
              <td>
                {usdtMarket?.pairs.IRT.expensive_exchange === "BITPIN" ? (
                  <Badge variant="bitpin">
                    {usdtMarket?.pairs.IRT.expensive_exchange}
                  </Badge>
                ) : usdtMarket?.pairs.IRT.expensive_exchange === "WALLEX" ? (
                  <Badge variant="wallex">
                    {usdtMarket?.pairs.IRT.expensive_exchange}
                  </Badge>
                ) : (
                  <Badge variant="nobitex">
                    {usdtMarket?.pairs.IRT.expensive_exchange}
                  </Badge>
                )}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.chip_exchange === "BITPIN" ? (
                  <Badge variant="bitpin">
                    {usdtMarket?.pairs.IRT.chip_exchange}
                  </Badge>
                ) : usdtMarket?.pairs.IRT.chip_exchange === "WALLEX" ? (
                  <Badge variant="wallex">
                    {usdtMarket?.pairs.IRT.chip_exchange}
                  </Badge>
                ) : (
                  <Badge variant="nobitex">
                    {usdtMarket?.pairs.IRT.chip_exchange}
                  </Badge>
                )}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.nobitex.price
                  ? Number(usdtMarket?.pairs.IRT.nobitex.price).toFixed(2)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.nobitex.affordable_value
                  ? Number(
                      usdtMarket?.pairs.IRT.nobitex.affordable_value
                    ).toFixed(4)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.nobitex.fee
                  ? Number(usdtMarket?.pairs.IRT.nobitex.fee).toFixed(4)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.bitpin.price
                  ? Number(usdtMarket?.pairs.IRT.bitpin.price).toFixed(2)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.bitpin.affordable_value
                  ? Number(
                      usdtMarket?.pairs.IRT.bitpin.affordable_value
                    ).toFixed(4)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.bitpin.fee
                  ? Number(usdtMarket?.pairs.IRT.bitpin.fee).toFixed(4)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.wallex.price
                  ? Number(usdtMarket?.pairs.IRT.wallex.price).toFixed(2)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.wallex.affordable_value
                  ? Number(
                      usdtMarket?.pairs.IRT.wallex.affordable_value
                    ).toFixed(4)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.wallex.fee
                  ? Number(usdtMarket?.pairs.IRT.wallex.fee).toFixed(4)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.differences.N_B.price
                  ? Number(usdtMarket?.pairs.IRT.differences.N_B.price).toFixed(
                      2
                    )
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.differences.N_B.percentage
                  ? Number(
                      usdtMarket?.pairs.IRT.differences.N_B.percentage
                    ).toFixed(4)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.differences.N_B.benefit
                  ? Number(
                      usdtMarket?.pairs.IRT.differences.N_B.benefit
                    ).toFixed(4)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.differences.N_W.price
                  ? Number(usdtMarket?.pairs.IRT.differences.N_W.price).toFixed(
                      2
                    )
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.differences.N_W.percentage
                  ? Number(
                      usdtMarket?.pairs.IRT.differences.N_W.percentage
                    ).toFixed(4)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.differences.N_W.benefit
                  ? Number(
                      usdtMarket?.pairs.IRT.differences.N_W.benefit
                    ).toFixed(4)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.differences.B_W.price
                  ? Number(usdtMarket?.pairs.IRT.differences.B_W.price).toFixed(
                      2
                    )
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.differences.B_W.percentage
                  ? Number(
                      usdtMarket?.pairs.IRT.differences.B_W.percentage
                    ).toFixed(4)
                  : "-"}
              </td>
              <td>
                {usdtMarket?.pairs.IRT.differences.B_W.benefit
                  ? Number(
                      usdtMarket?.pairs.IRT.differences.B_W.benefit
                    ).toFixed(4)
                  : "-"}
              </td>
            </tr>
          )}
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="text-center border border-solid">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}
