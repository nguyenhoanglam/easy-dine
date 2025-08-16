import { UrlObject } from "url";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const RANGE = 2;
/**
Với RANGE = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page

[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20 
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 8 9 ... 19 20
1 2 ...13 14 [15] 16 17 ... 19 20

1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 15 16 [17] 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]
 */

function createHrefUrl({
  pathname,
  page,
  limit,
}: {
  pathname: string;
  page: number;
  limit?: number;
}) {
  const href: UrlObject = {
    pathname,
    query: { page, ...(limit && { limit }) },
  };

  return href;
}

interface Props {
  page: number;
  totalPage: number;
  limit?: number;
  pathname: string;
}

export default function AutoPagination({
  page,
  totalPage,
  limit,
  pathname,
}: Props) {
  const renderPagination = () => {
    let dotAfter = false;
    let dotBefore = false;

    const renderDotBefore = () => {
      if (!dotBefore) {
        dotBefore = true;
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      return null;
    };

    const renderDotAfter = () => {
      if (!dotAfter) {
        dotAfter = true;
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      return null;
    };

    return Array(totalPage)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1;

        // Điều kiện để return về ...
        if (
          page <= RANGE * 2 + 1 &&
          pageNumber > page + RANGE &&
          pageNumber < totalPage - RANGE + 1
        ) {
          return renderDotAfter();
        } else if (page > RANGE * 2 + 1 && page < totalPage - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore();
          } else if (
            pageNumber > page + RANGE &&
            pageNumber < totalPage - RANGE + 1
          ) {
            return renderDotAfter();
          }
        } else if (
          page >= totalPage - RANGE * 2 &&
          pageNumber > RANGE &&
          pageNumber < page - RANGE
        ) {
          return renderDotBefore();
        }

        return (
          <PaginationItem key={index}>
            <PaginationLink
              href={createHrefUrl({ pathname, page: pageNumber, limit })}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        );
      });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createHrefUrl({ pathname, page: page - 1, limit })}
            className={cn({
              "cursor-not-allowed opacity-50 pointer-events-none": page === 1,
            })}
            aria-disabled={page === 1}
            onClick={(e) => {
              if (page === 1) {
                e.preventDefault();
              }
            }}
          />
        </PaginationItem>
        {renderPagination()}
        <PaginationItem>
          <PaginationNext
            href={createHrefUrl({ pathname, page: page + 1, limit })}
            className={cn({
              "cursor-not-allowed opacity-50 pointer-events-none":
                page === totalPage,
            })}
            aria-disabled={page === totalPage}
            onClick={(e) => {
              if (page === totalPage) {
                e.preventDefault();
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
