import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {useTranslation} from "react-i18next";

type SimplePaginationProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
}

const SimplePagination: React.FC<SimplePaginationProps> = ({
  page, hasMore, setPage
})=> {
  const { t } = useTranslation();

  return (
    <>
      <Pagination className="space-x-3">
        <PaginationContent className={"flex items-center justify-between mt-4"}>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              aria-disabled={page === 0}
              tabIndex={page <= 0 ? -1 : undefined}
              className={page <= 0 ? "pointer-events-none opacity-50" : undefined}
            >
              {t("general.previous")}
            </PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((prev) => prev + 1)}
              aria-disabled={!hasMore}
              tabIndex={!hasMore ? -1 : undefined}
              className={
                  !hasMore ? "pointer-events-none opacity-50" : undefined
              }
            >
                {t("general.next")}
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default SimplePagination;