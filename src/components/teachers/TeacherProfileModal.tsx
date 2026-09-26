"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { Teacher } from "@/types/teacher";
import {
  CreditCard,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  Briefcase,
  Layers,
  History,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
} from "lucide-react";

interface TeacherProfileModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (teacher: Teacher) => void;
}

type TabType = "overview" | "absence" | "inquiries" | "delays" | "deductions" | "audit";

export function TeacherProfileModal({
  teacher,
  isOpen,
  onClose,
  onEdit,
}: TeacherProfileModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!teacher) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "-";
    try {
      return new Date(isoString).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="الملف الشخصي والإداري للمعلمة"
      size="xl"
    >
      <div className="font-cairo text-right space-y-6 pt-1" dir="rtl">
        {/* Header Profile Card */}
        <div className="bg-gradient-to-r from-teal-50 via-slate-50 to-white border border-teal-100 rounded-3xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
              <Avatar
                name={teacher.fullName}
                size="xl"
                className="border-2 border-teal-600 shadow-sm"
              />
              <div>
                <h3 className="text-lg font-black text-slate-900">{teacher.fullName}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {teacher.jobTitle || "معلمة"} • {teacher.teachingField || "التعليم العام"}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <Badge variant={teacher.isArchived ? "warning" : "success"} size="sm">
                    {teacher.isArchived ? "مؤرشفة" : "على رأس العمل"}
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {teacher.employmentType || "رسمي"}
                  </Badge>
                  <Badge variant="primary" size="sm">
                    {teacher.specialization}
                  </Badge>
                </div>
              </div>
            </div>

            {onEdit && !teacher.isArchived && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(teacher);
                }}
              >
                تعديل البيانات
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>البيانات الأساسية</span>
          </button>
          <button
            onClick={() => setActiveTab("absence")}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === "absence"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>سجل الغياب</span>
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === "inquiries"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>المساءلات الإدارية</span>
          </button>
          <button
            onClick={() => setActiveTab("delays")}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === "delays"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>إشعارات التأخر</span>
          </button>
          <button
            onClick={() => setActiveTab("deductions")}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === "deductions"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>قرارات الحسم</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === "audit"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>سجل العمليات</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* National ID */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                  <span>رقم الهوية الوطنية / الإقامة</span>
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {teacher.nationalId}
                  </span>
                  <button
                    onClick={() => handleCopy(teacher.nationalId, "nid")}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    {copiedField === "nid" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>رقم الجوال المعتمد</span>
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 text-sm" dir="ltr">
                    {teacher.mobileNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(teacher.mobileNumber, "mob")}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    {copiedField === "mob" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Specialization */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  <span>التخصص التدريسي</span>
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {teacher.specialization}
                </span>
              </div>

              {/* Email */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <span>البريد الإلكتروني الإداري</span>
                </span>
                <span className="font-sans font-medium text-slate-900 text-sm">
                  {teacher.email || "غير مسجل"}
                </span>
              </div>

              {/* Created At */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>تاريخ التسجيل بالمنصة</span>
                </span>
                <span className="font-medium text-slate-700 text-xs">
                  {formatDate(teacher.createdAt)}
                </span>
              </div>

              {/* Updated At */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>آخر تحديث للملف</span>
                </span>
                <span className="font-medium text-slate-700 text-xs">
                  {formatDate(teacher.updatedAt)}
                </span>
              </div>
            </div>

            {/* Archive Details if Archived */}
            {teacher.isArchived && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <h4 className="font-bold mb-1">تفاصيل أرشفة السجل:</h4>
                <p>تاريخ الأرشفة: {formatDate(teacher.archivedAt)}</p>
                <p className="mt-1">
                  سبب الأرشفة: <strong>{teacher.archiveReason || "غير محدد"}</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Future Sprints Placeholders */}
        {activeTab !== "overview" && (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-3xl space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              قسم جاهز للربط مع السبرينتات التشغيلية
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              تم تأسيس بنية البيانات وهيكل الربط لهذا التبويب (
              {activeTab === "absence" && "رصد الغياب اليومي والأعذار"}
              {activeTab === "inquiries" && "إصدار ومتابعة المساءلات الإدارية"}
              {activeTab === "delays" && "حساب ساعات التأخر التراكمي وإشعاراته"}
              {activeTab === "deductions" && "إصدار قرارات الحسم المالي والاعتمادات"}
              {activeTab === "audit" && "سجل التدقيق الأمني للعمليات المنفذة على المعلمة"}
              ). سيتم تفعيل شاشاته التشغيلية في السبرينت المخصص له وفق الخطة الزمنية للمشروع.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
              جاهز للربط والتكامل البرمجي
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <Button variant="ghost" onClick={onClose}>
            إغلاق الملف
          </Button>
        </div>
      </div>
    </Modal>
  );
}
