"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

import { buttonVariants } from "./ui/button";

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

type ButtonProps = {
  className?: string;
  isActive?: boolean;
  disabled?: boolean;
  size?: "sm" | "lg" | "icon" | "default" | null;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
};

type Props = {
  page: number;
  pageSize: number;
  totalItem?: number;
  totalPage?: number;
  onPageChange?: (page: number) => void;
};

function PageButton({
  className,
  isActive,
  disabled,
  size = "icon",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "cursor-pointer",
        {
          "cursor-not-allowed opacity-50 pointer-events-none": disabled,
        },
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      {...props}
    />
  );
}

function PreviousButton({
  className,
  ...props
}: React.ComponentProps<typeof PageButton>) {
  return (
    <PageButton
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Trước</span>
    </PageButton>
  );
}

function NextButton({
  className,
  ...props
}: React.ComponentProps<typeof PageButton>) {
  return (
    <PageButton
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Tiếp</span>
      <ChevronRightIcon />
    </PageButton>
  );
}

export default function PaginationControl({
  page,
  pageSize,
  totalItem = 0,
  totalPage: _totalPage = 0,
  onPageChange,
}: Props) {
  if (totalItem <= 0 && _totalPage <= 0) {
    return null;
  }

  const totalPage = _totalPage || Math.ceil(totalItem / pageSize);
  const previousDisabled = page <= 1;
  const nextDisabled = page >= totalPage;

  const renderPagination = () => {
    let dotAfter = false;
    let dotBefore = false;

    const renderDotBefore = () => {
      if (!dotBefore) {
        dotBefore = true;
        return (
          <PaginationItem key="ellipsis-before">
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
          <PaginationItem key="ellipsis-after">
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
            <PageButton
              isActive={pageNumber === page}
              onClick={() => onPageChange?.(pageNumber)}
            >
              {pageNumber}
            </PageButton>
          </PaginationItem>
        );
      });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem key="previous">
          <PreviousButton
            disabled={previousDisabled}
            onClick={() => onPageChange?.(page - 1)}
          />
        </PaginationItem>
        {renderPagination()}
        <PaginationItem key="next">
          <NextButton
            disabled={nextDisabled}
            onClick={() => onPageChange?.(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
