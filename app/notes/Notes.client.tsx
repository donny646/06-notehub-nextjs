"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, NotesResponse, FetchNotesProps} from "@/lib/api";
import css from "./NotesPage.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteModal from "@/components/NoteModal/NoteModal";
import NoteList from "@/components/NoteList/NoteList";

type NotesClientProps = {
  initialData: NotesResponse;
  initialQuery: {
    debounceQuery: string;
    currentPage: number;
  };
};

export default function NotesClient({
  initialData,
  initialQuery,
}: NotesClientProps) {
  const [searchQuery, setQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onPageChange = ({ selected }: { selected: number }) =>
    setCurrentPage(selected + 1);

  const [debounceQuery] = useDebounce(searchQuery, 500);

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", debounceQuery, currentPage],
    queryFn: () =>
      fetchNotes({
         query: debounceQuery,
  page: currentPage,
      }),
    refetchOnMount: false,
    placeholderData: keepPreviousData,
    initialData:
      debounceQuery === initialQuery.debounceQuery &&
      currentPage === initialQuery.currentPage
        ? initialData
        : undefined,
  });

  const totalPages = data?.totalPages ?? 0;

  const createNoteBtn = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (debounceQuery: string) => {
    setQuery(debounceQuery);
    setCurrentPage(1);
  };
  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={searchQuery} onSearch={handleSearch} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        )}

        <button onClick={createNoteBtn} className={css.button}>
          Create note +
        </button>
      </div>

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && <NoteModal onClose={closeModal} />}
    </div>
  );
}