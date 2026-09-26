"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./Table";
import { Checkbox } from "./Checkbox";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  mobilePriority?: "primary" | "secondary" | "tertiary";
}

export interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  filterOptions?: Array<{ label: string; value: string; filterFn: (item: T) => boolean }>;
  batchActions?: (selectedIds: string[]) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  searchPlaceholder = "بحث في السجلات...",
  searchKey,
  filterOptions,
  batchActions,
  emptyTitle = "لا توجد سجلات",
  emptyDescription = "لم يتم العثور على أي بيانات مطابقة",
  pageSize = 5,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<number>(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"auto" | "table" | "cards">("auto");

  // 1. Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search query filter
      if (search && searchKey) {
        const val = String(item[searchKey] || "").toLowerCase();
        if (!val.includes(search.toLowerCase())) return false;
      } else if (search) {
        // Search across all string fields
        const match = Object.values(item).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase())
        );
        if (!match) return false;
      }

      // Filter preset
      if (filterOptions && filterOptions[selectedFilter]) {
        return filterOptions[selectedFilter].filterFn(item);
      }

      return true;
    });
  }, [data, search, searchKey, filterOptions, selectedFilter]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      const res = aVal > bVal ? 1 : -1;
      return sortDirection === "asc" ? res : -res;
    });
  }, [filteredData, sortKey, sortDirection]);

  // 3. Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Selection
  const allCurrentPageSelected =
    paginatedData.length > 0 && paginatedData.every((item) => selectedIds.has(item.id));

  const toggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (allCurrentPageSelected) {
      paginatedData.forEach((item) => next.delete(item.id));
    } else {
      paginatedData.forEach((item) => next.add(item.id));
    }
    setSelectedIds(next);
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSort = (colKey: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === colKey) {
      if (sortDirection === "asc") setSortDirection("desc");
      else {
        setSortKey(null);
        setSortDirection("asc");
      }
    } else {
      setSortKey(colKey);
      setSortDirection("asc");
    }
  };

  return (
    <div className={cn("space-y-4", className)} dir="rtl">
      {/* Top Toolbar: Search + Filter Tabs + View Mode */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pr-9 pl-4 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter Pills */}
        {filterOptions && filterOptions.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {filterOptions.map((f, idx) => (
              <button
                key={f.label}
                type="button"
                onClick={() => {
                  setSelectedFilter(idx);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors",
                  selectedFilter === idx
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Batch Actions Bar (When items selected) */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span>تم تحديد {selectedIds.size} من السجلات</span>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-teal-700 underline font-normal mr-2"
            >
              إلغاء التحديد
            </button>
          </div>
          {batchActions && <div>{batchActions(Array.from(selectedIds))}</div>}
        </div>
      )}

      {/* Data Presentation: Table vs Mobile Cards */}
      {paginatedData.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          {/* 1. Desktop & Tablet Table View */}
          <div className={cn("hidden md:block")}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allCurrentPageSelected}
                      onChange={toggleSelectAll}
                      aria-label="تحديد جميع سجلات الصفحة"
                    />
                  </TableHead>
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      onClick={() => handleSort(col.key, col.sortable)}
                      className={cn(col.sortable && "cursor-pointer select-none hover:text-teal-700")}
                    >
                      <div className="inline-flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-slate-400">
                            {sortKey === col.key ? (
                              sortDirection === "asc" ? (
                                <ChevronUp className="w-3.5 h-3.5 text-teal-600" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-teal-600" />
                              )
                            ) : (
                              <ChevronsUpDown className="w-3.5 h-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <TableRow key={item.id} className={cn(isSelected && "bg-teal-50/40")}>
                      <TableCell className="w-10">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleSelectOne(item.id)}
                          aria-label={`تحديد السجل ${item.id}`}
                        />
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell key={col.key}>
                          {col.render
                            ? col.render(item)
                            : String((item as Record<string, unknown>)[col.key] ?? "-")}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* 2. Mobile Responsive Cards View (< 768px) */}
          <div className="block md:hidden space-y-3">
            {paginatedData.map((item) => {
              const isSelected = selectedIds.has(item.id);
              const primaryCols = columns.filter((c) => c.mobilePriority !== "tertiary");

              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 bg-white rounded-2xl border transition-colors shadow-xs",
                    isSelected ? "border-teal-500 bg-teal-50/20" : "border-slate-200"
                  )}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleSelectOne(item.id)}
                        aria-label={`تحديد السجل ${item.id}`}
                      />
                      <span className="text-xs font-bold text-slate-800">
                        {columns[0]?.render ? columns[0].render(item) : String((item as Record<string, unknown>)[columns[0]?.key] ?? "")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {primaryCols.slice(1).map((col) => (
                      <div key={col.key} className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-semibold">{col.header}:</span>
                        <div className="text-slate-800 font-medium">
                          {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "-")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 text-xs text-slate-500">
        <div>
          إجمالي النتائج: <span className="font-bold text-slate-800">{sortedData.length}</span> سجل
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">
            صفحة <span className="font-bold text-slate-800">{currentPage}</span> من{" "}
            <span className="font-bold text-slate-800">{totalPages}</span>
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 w-8 p-0"
              aria-label="الصفحة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 w-8 p-0"
              aria-label="الصفحة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
