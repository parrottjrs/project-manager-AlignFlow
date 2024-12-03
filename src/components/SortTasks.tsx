"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function SortTasks() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentSort = searchParams.get("sort") || "ASC";
  const currentFilter = searchParams.get("filter") || "all";

  const handleSort = (newSort?: string, newFilter?: string) => {
    const params = new URLSearchParams(searchParams);
    if (newSort) params.set("sort", newSort);
    if (newFilter) params.set("filter", newFilter);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="sort">Sort by</label>
        <select
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          onChange={(e) => handleSort(e.target.value, currentFilter)}
          defaultValue="ASC"
        >
          <option value="ASC">Due date (ascending)</option>
          <option value="DESC">Due date (descending)</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="filter">Filter by</label>
        <select
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          onChange={(e) => handleSort(currentSort, e.target.value)}
          defaultValue="all"
        >
          <option value="all">Show all</option>
          <option value="to do">To do</option>
          <option value="in progress">In progress</option>
          <option value="completed">Complete</option>
        </select>
      </div>
    </div>
  );
}
