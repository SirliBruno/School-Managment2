"use client";

import React from "react";
import type { Teacher } from "@/types/teacher";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Eye,
  Edit2,
  Archive,
  RotateCcw,
  Phone,
  Copy,
  Check,
  GraduationCap,
} from "lucide-react";

interface TeacherTableProps {
  teachers: Teacher[];
  isLoading?: boolean;
  onViewProfile: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onArchive: (teacher: Teacher) => void;
  onRestore: (teacher: Teacher) => void;
  onAddNew?: () => void;
}

export function TeacherTable({
  teachers,
  isLoading,
  onViewProfile,
  onEdit,
  onArchive,
  onRestore,
  onAddNew,
}: TeacherTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (teachers.length === 0 && !isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 my-4 shadow-sm">
        <EmptyState
          title="لا توجد معلمات مسجلات حالياً"
          description="لم يتم العثور على سجلات معلمات تطابق معايير البحث أو الفلترة المحددة."
          icon={<GraduationCap className="w-10 h-10 text-slate-400" />}
          action={
            onAddNew ? (
              <button
                type="button"
                onClick={onAddNew}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                إضافة معلمة جديدة
              </button>
            ) : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop & Tablet Table */}
      <div className="hidden md:block overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm text-slate-700 font-cairo">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 font-semibold select-none">
              <tr>
                <th className="py-4 px-4 pr-6">المعلمة</th>
                <th className="py-4 px-3">رقم الهوية</th>
                <th className="py-4 px-3">رقم الجوال</th>
                <th className="py-4 px-3">التخصص</th>
                <th className="py-4 px-3">مجال التدريس</th>
                <th className="py-4 px-3">حالة التوظيف</th>
                <th className="py-4 px-3">الحالة</th>
                <th className="py-4 px-4 pl-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className={`hover:bg-teal-50/30 transition-colors ${
                    teacher.isArchived ? "bg-slate-50/60 opacity-80" : ""
                  }`}
                >
                  {/* Name & Avatar */}
                  <td className="py-3.5 px-4 pr-6">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={teacher.fullName}
                        size="md"
                        className="border border-slate-200"
                      />
                      <div>
                        <button
                          onClick={() => onViewProfile(teacher)}
                          className="font-bold text-slate-900 hover:text-teal-700 transition-colors text-right block"
                        >
                          {teacher.fullName}
                        </button>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          {teacher.jobTitle || "معلمة"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* National ID */}
                  <td className="py-3.5 px-3 font-mono text-xs text-slate-600">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                      <span>{teacher.nationalId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(teacher.nationalId, `nid-${teacher.id}`)}
                        className="text-slate-400 hover:text-slate-700 transition-colors"
                        title="نسخ رقم الهوية"
                      >
                        {copiedId === `nid-${teacher.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Mobile Number */}
                  <td className="py-3.5 px-3 font-mono text-xs">
                    <div className="inline-flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span dir="ltr">{teacher.mobileNumber}</span>
                    </div>
                  </td>

                  {/* Specialization */}
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-800 text-xs">
                      {teacher.specialization}
                    </span>
                  </td>

                  {/* Teaching Field */}
                  <td className="py-3.5 px-3 text-xs text-slate-500">
                    {teacher.teachingField || "التعليم العام"}
                  </td>

                  {/* Employment Type */}
                  <td className="py-3.5 px-3">
                    <Badge variant="outline" size="sm">
                      {teacher.employmentType || "رسمي"}
                    </Badge>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3">
                    {teacher.isArchived ? (
                      <Badge variant="warning" size="sm">
                        مؤرشفة
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        على رأس العمل
                      </Badge>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 pl-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {/* View Profile */}
                      <button
                        type="button"
                        onClick={() => onViewProfile(teacher)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                        title="عرض الملف الشخصي"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      {!teacher.isArchived && (
                        <button
                          type="button"
                          onClick={() => onEdit(teacher)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="تعديل البيانات"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Archive / Restore */}
                      {teacher.isArchived ? (
                        <button
                          type="button"
                          onClick={() => onRestore(teacher)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="استعادة المعلمة إلى الكادر النشط"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onArchive(teacher)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="أرشفة السجل"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className={`p-4 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all ${
              teacher.isArchived ? "bg-slate-50/80 border-slate-200/60" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Avatar name={teacher.fullName} size="md" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{teacher.fullName}</h4>
                  <span className="text-xs text-slate-400">{teacher.jobTitle || "معلمة"}</span>
                </div>
              </div>
              <div>
                {teacher.isArchived ? (
                  <Badge variant="warning" size="sm">
                    مؤرشفة
                  </Badge>
                ) : (
                  <Badge variant="success" size="sm">
                    نشطة
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2.5 my-2.5 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">الهوية:</span>
                <span className="font-mono font-medium">{teacher.nationalId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">التخصص:</span>
                <span className="font-semibold text-slate-800">{teacher.specialization}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">الجوال:</span>
                <span className="font-mono" dir="ltr">
                  {teacher.mobileNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">نوع التوظيف:</span>
                <span>{teacher.employmentType || "رسمي"}</span>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => onViewProfile(teacher)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-teal-600" />
                <span>الملف</span>
              </button>

              {!teacher.isArchived && (
                <button
                  type="button"
                  onClick={() => onEdit(teacher)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>تعديل</span>
                </button>
              )}

              {teacher.isArchived ? (
                <button
                  type="button"
                  onClick={() => onRestore(teacher)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onArchive(teacher)}
                  className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-100 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>أرشفة</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
