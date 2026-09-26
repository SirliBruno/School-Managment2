"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { Teacher } from "@/types/teacher";
import { teacherService } from "@/services/teacherService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Archive, AlertTriangle } from "lucide-react";

interface ArchiveTeacherModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  onTeacherArchived: (teacher: Teacher) => void;
}

const COMMON_ARCHIVE_REASONS = [
  "نقل إلى مدرسة أو إدارة تعليمية أخرى",
  "إجازة رعاية مولود / وضع طويلة",
  "إجازة استثنائية أو دراسية",
  "تقاعد نظامي أو مبكر",
  "انتهاء عقد العمل أو تكليف",
  "أخرى (توضيح السبب الإداري أدناه)",
];

export function ArchiveTeacherModal({
  teacher,
  isOpen,
  onClose,
  onTeacherArchived,
}: ArchiveTeacherModalProps) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [selectedPreset, setSelectedPreset] = useState(COMMON_ARCHIVE_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!teacher) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalReason =
      selectedPreset === COMMON_ARCHIVE_REASONS[5]
        ? customReason.trim()
        : selectedPreset;

    if (!finalReason) {
      setError("يرجى كتابة سبب الأرشفة لتوثيق القرار الإداري");
      return;
    }

    setIsSubmitting(true);
    const actor = user
      ? {
          userId: user.id,
          userName: user.fullName,
          userRole: user.role,
        }
      : undefined;

    const res = await teacherService.archiveTeacher(teacher.id, finalReason, actor);
    setIsSubmitting(false);

    if (res.success && res.teacher) {
      addToast({
        type: "success",
        title: "تمت أرشفة المعلمة",
        message: `تم نقل سجل المعلمة ${res.teacher.fullName} إلى الأرشيف بنجاح`,
      });
      onTeacherArchived(res.teacher);
      onClose();
    } else {
      setError(res.error || "فشل إتمام عملية الأرشفة");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="أرشفة سجل المعلمة (Soft Delete)"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1 font-cairo text-right" dir="rtl">
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">تنبيه إداري:</p>
            <p className="mt-0.5">
              سيتم نقل سجل المعلمة <strong>({teacher.fullName})</strong> إلى قسم المعلمات
              المؤرشفات ولن تظهر في كشوفات الرصد اليومية، مع الحفاظ الكامل على كافة بياناتها
              وسجلاتها السابقة مع إمكانية استعادتها لاحقاً.
            </p>
          </div>
        </div>

        {error && (
          <Alert
            variant="danger"
            title="خطأ"
            description={error}
            dismissible
            onDismiss={() => setError(null)}
          />
        )}

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            سبب الأرشفة الإداري *:
          </label>
          <div className="space-y-2">
            {COMMON_ARCHIVE_REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                  selectedPreset === reason
                    ? "bg-teal-50/60 border-teal-500 font-semibold text-teal-950"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="archiveReason"
                  value={reason}
                  checked={selectedPreset === reason}
                  onChange={() => setSelectedPreset(reason)}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
        </div>

        {selectedPreset === COMMON_ARCHIVE_REASONS[5] && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              تفاصيل السبب الإداري *:
            </label>
            <textarea
              rows={3}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="اكتبي سبب الأرشفة بالتفصيل للتوثيق المعتمد..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              required
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            <Archive className="w-4 h-4 ml-2" />
            <span>تأكيد الأرشفة</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
