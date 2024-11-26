import Logout from "@/components/Logout";
import NewBook from "@/components/NewBook";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { bookColumns } from "@/components/ui/book-columns";
import { BookTable } from "@/components/ui/book-table";
import { fetchBooks } from "@/lib/api";
import { Book } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const navigate = useNavigate();

  const {
    data: books,
    error,
    isLoading,
  } = useQuery<Book[], Error>({
    queryKey: ["books"], // Use array for queryKey
    queryFn: () => fetchBooks(navigate),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading books</div>;
  }

  return (
    <div className="min-h-screen w-full bg-primary-foreground p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-purple-500">Book Nest</h1>
        <div className="flex gap-3">
          <ThemeSwitcher />
          <Logout />
        </div>
      </header>
      <div className="mb-8">
        <NewBook />
      </div>
      <div>
        <BookTable columns={bookColumns} data={books || []} />
      </div>
    </div>
  );
};

export default Books;
