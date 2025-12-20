import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { UpgradeRequestPreview } from "../../../../shared/src/types";
import { useRouter } from "next/navigation";
import { Pagination as PaginationType } from "../../../../shared/src/types/Pagination";
import Pagination from "@/components/Pagination";
import UpgradeRequestHook from "@/hooks/useUpgrade";
import { formatDate } from "@/app/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import { DeleteCategoryModal } from "@/components/CategoryCard/DeleteCategoryModal";
import { ConfirmPopup } from "@/components/ConfirmPopup";

interface PopupProps {
  title: string;
  handleAccept: React.MouseEventHandler<HTMLButtonElement>;
  handleCancel: React.MouseEventHandler<HTMLButtonElement>;
}

const Popup = ({ title, handleAccept, handleCancel }: PopupProps) => {
  return (
    <div className="  fixed inset-0   flex  top-0 right-0 left-0 z-50 justify-center items-center w-full  h-[calc(100%-1rem)] max-h-full">
      <div className="relative  w-full max-w-md max-h-full inset-1">
        <div className="relative border border-default rounded-base shadow-sm ">
          <button
            type="button"
            onClick={handleCancel}
            className="absolute top-3 end-2.5 text-body bg-transparent hover:bg-red-100 hover:cursor-pointer hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className=" p-4 md:p-5 text-center bg-white">
            <svg
              className="mx-auto mb-4 text-fg-disabled w-12 h-12"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mb-6 text-body">{title}</h3>
            <div className="flex items-center space-x-4 justify-center">
              <button
                type="button"
                onClick={handleAccept}
                className="text-white hover:cursor-pointer bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
              >
                Đồng ý
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="text-body hover:cursor-pointer  box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
              >
                Không
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Request = () => {
  const searchParams = useSearchParams();
  let totalPages = 1;
  const [requests, setRequests] = useState<UpgradeRequestPreview[]>([]);
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 2;
  const router = useRouter();
  const [isPopupAccept, setIsPopupAccept] = useState(false);
  const [isPopupDelete, setIsPopupDelete] = useState(false);
  const {
    mutate: updateApprovalRequest,
    isPending: isUpdatingApprovalRequest,
  } = UpgradeRequestHook.useUpdateApproveRequest();
  const { mutate: updateRejectRequest, isPending: isUpdatingRejectRequest } =
    UpgradeRequestHook.useUpdateRejectRequest();
  const pagination: PaginationType = {
    page: Number(page),
    limit: Number(limit),
  };
  const [selectedRequest, setSelectedRequest] = useState<{
    id: number;
    content: string;
  }>({ id: 0, content: "Chưa có" });

  const { data, isLoading } = UpgradeRequestHook.useUpgradeRequests(pagination);
  const handlePageChange = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    next.set("limit", "2");
    router.push(`?${next.toString()}`);
  };
  useEffect(() => {
    if (data) {
      if (data.requests) {
        setRequests(data.requests);
      }
    }
  }, [data]);
  if (data) {
    totalPages = Math.ceil(Number(data.totalRequests) / Number(limit));
  }

  const handleOnDelete = (id: number, content: string) => {
    setSelectedRequest({ id, content });
    setIsPopupDelete(true);
  };
  const handleOnAccept = (id: number, content: string) => {
    setSelectedRequest({ id, content });
    setIsPopupAccept(true);
  };
  const handleDeleteRequest = () => {
    if (selectedRequest) {
      updateRejectRequest(selectedRequest.id);
    }
    setIsPopupDelete(false);
  };
  const handleAcceptRequest = () => {
    if (selectedRequest) {
      updateApprovalRequest(selectedRequest.id);
    }
    setIsPopupAccept(false);
  };
  return (
    <>
      {isLoading || isUpdatingApprovalRequest || isUpdatingRejectRequest ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="bg-white rounded-lg border border-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface border-b border-surface">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-text">
                      Tên
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-text">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-text">
                      Điểm uy tín
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-text">
                      Ngày tham gia
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-text">
                      Ngày yêu cầu
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-text">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r: UpgradeRequestPreview, index: number) => {
                    let point = 100;
                    if (
                      r.bidder.positive_points + r.bidder.negative_points !=
                      0
                    )
                      point = Math.round(
                        (Number(r.bidder.positive_points) /
                          (Number(r.bidder.positive_points) +
                            Number(r.bidder.negative_points))) *
                          100
                      );
                    return (
                      <tr
                        key={index}
                        className="border-b border-surface hover:bg-bg transition-colors"
                      >
                        <td className="px-4 py-3 text-text font-medium">
                          {r.bidder.name}
                        </td>
                        <td className="px-4 py-3 text-text-light">
                          {r.bidder.email}
                        </td>
                        <td
                          className={`px-4 py-3 font-bold ${
                            point <= 60
                              ? "text-red-500"
                              : point < 80
                              ? "text-yellow-400"
                              : "text-green-500"
                          }`}
                        >
                          {point}%
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(r.bidder.created_at)}
                        </td>
                        <td className="px-4 py-3 text-text-light ">
                          {formatDate(r.created_at)}
                        </td>
                        <td className="px-4 py-3 text-center flex flex-row items-center justify-center">
                          <button
                            onClick={() =>
                              handleOnAccept(
                                r.id,
                                "chấp nhận yêu cầu của " + r.bidder.name
                              )
                            }
                            className="p-2  hover:bg-green-50 rounded transition-colors cursor-pointer"
                          >
                            <svg
                              className="w-5 h-5 text-green-600 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width={20}
                              height={20}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 11.917 9.724 16.5 19 7.5"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleOnDelete(
                                r.id,
                                "xóa yêu cầu của " + r.bidder.name
                              )
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-trash2 w-4 h-4"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1={10} x2={10} y1={11} y2={17} />
                              <line x1={14} x2={14} y1={11} y2={17} />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full flex flex-row justify-center my-4">
            <Pagination
              totalPages={totalPages}
              onPageChange={handlePageChange}
              currentPage={Number(page)}
            />
          </div>
        </div>
      )}

      <ConfirmPopup
        isOpen={isPopupDelete}
        onClose={() => setIsPopupDelete(false)}
        selected={selectedRequest}
        onConfirm={handleDeleteRequest}
      />
      <ConfirmPopup
        isOpen={isPopupAccept}
        onClose={() => setIsPopupAccept(false)}
        selected={selectedRequest}
        onConfirm={handleAcceptRequest}
      />
    </>
  );
};
