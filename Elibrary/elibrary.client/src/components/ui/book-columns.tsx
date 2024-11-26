import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book } from "@/types/index";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import EditBook from "../EditBook";
import DeleteBook from "../DeleteBook";

export const bookColumns: ColumnDef<Book>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Book ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const book = row.original;

      return (
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">{book.description}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const book = row.original;

      return (
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">
            {new Date(book.createdAt).toLocaleString()}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(book.title)}
            >
              <Button variant="ghost" className="w-full h-8 p-0">
                Copy Title
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <EditBook book={book} />
            <DeleteBook book={book} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];