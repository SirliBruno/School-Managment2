"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { teacherService } from "@/services/teacherService";
import type { Teacher } from "@/types/teacher";
import { SPECIALIZATIONS_LIST } from "@/types/teacher";
import {
  TeacherTable,
  AddTeacherModal,
  EditTeacherModal,
  ArchiveTeacherModal,
  TeacherProfileModal,
  ExcelImporter,
} from "@/components/teachers";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Search,
  Filter,
  GraduationCap,
  Archive,
  ArrowRight,
  RefreshCw,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function TeachersPageContent() {
  const { user, hasPermission } = useAuth();
  const { addToast } = useToast();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "archived" | "all">("active");
  const [specializationFilter, setSpecializationFilter] = useState<string>("all");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [archivingTeacher, setArchivingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  // Load teachers from service
  const loadTeachers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await teacherService.getTeachers();
      setTeachers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء تحميل بيانات المعلمات";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  // Filtered teachers list
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      // 1. Status Filter
      if (statusFilter === "active" && t.isArchived) return false;
      if (statusFilter === "archived" && !t.isArchived) return false;

      // 2. Specialization Filter
      if (specializationFilter !== "all" && t.specialization !== specializationFilter) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = t.fullName.toLowerCase().includes(query);
        const matchesId = t.nationalId.includes(query);
        const matchesPhone = t.mobileNumber.includes(query);
        const matchesSpec = t.specialization.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesPhone && !matchesSpec) {
          return false;
        }
      }

      return true;
    });
  }, [teachers, statusFilter, specializationFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const activeCount = teachers.filter((t) => !t.isArchived).length;
    const archivedCount = teachers.filter((t) => t.isArchived).length;
    const uniqueSpecs = new Set(teachers.map((t) => t.specialization)).size;
    return { activeCount, archivedCount, uniqueSpecs };
  }, [teachers]);

  // Actions
  const handleTeacherAdded = (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  const handleTeacherUpdated = (updatedTeacher: Teacher) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
    );
  };

  const handleTeacherArchived = (archivedTeacher: Teacher) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === archivedTeacher.id ? archivedTeacher : t))
    );
  };

  const handleRestoreTeacher = async (teacher: Teacher) => {
    const actor = user
      ? { userId: user.id, userName: user.fullName, userRole: user.role }
      : undefined;

    const res = await teacherService.restoreTeacher(teacher.id, actor);
    if (res.success && res.teacher) {
      addToast({
        type: "success",
        title: "تمت استعادة المعلمة",
        message: `تمت استعادة المعلمة ${res.teacher.fullName} إلى الكادر النشط بنجاح`,
      });
      handleTeacherUpdated(res.teacher);
    } else {
      addToast({
        type: "error",
        title: "خطأ في الاستعادة",
        message: res.error || "تعذرت استعادة المعلمة",
      });
    }
  };

  const canCreateTeacher = hasPermission("teachers.create");
  const canArchiveTeacher = hasPermission("teachers.archive");

  return (
    <div className="min-h-screen bg-slate-50 font-cairo text-slate-900 pb-16" dir="rtl">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="العودة للرئيسية"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-800 text-sm hidden sm:inline">
                منصة الغياب والمساءلات الإدارية
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExcelModalOpen(true)}
              className="flex items-center gap-1.5 text-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">استيراد Excel / نور</span>
              <span className="sm:hidden">استيراد</span>
            </Button>

            {canCreateTeacher && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 text-xs shadow-sm shadow-teal-700/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة معلمة جديدة</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Page Title & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/" className="hover:text-teal-700 transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">إدارة المعلمات</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>إدارة كادر المعلمات</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                {stats.activeCount} نشطة
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              قاعدة البيانات المعتمدة لبيانات المعلمات، متابعة التخصصات وحالات التوظيف، وتحديث السجلات
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={loadTeachers}
            isLoading={isLoading}
            className="self-start sm:self-auto text-xs text-slate-600 hover:text-teal-700"
          >
            <RefreshCw className="w-3.5 h-3.5 ml-1.5" />
            <span>تحديث البيانات</span>
          </Button>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">المعلمات على رأس العمل</span>
              <span className="text-xl font-black text-slate-900">{stats.activeCount}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">السجلات المؤرشفة</span>
              <span className="text-xl font-black text-slate-900">{stats.archivedCount}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">التخصصات التدريسية</span>
              <span className="text-xl font-black text-slate-900">{stats.uniqueSpecs} تخصص</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3.5">
          {/* Top Row: Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-6 md:col-span-7">
              <Input
                placeholder="البحث بالاسم، رقم الهوية، الجوال، أو التخصص..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                className="h-10 text-xs"
              />
            </div>

            {/* Specialization Select */}
            <div className="sm:col-span-6 md:col-span-5">
              <Select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                options={[
                  { label: "كافة التخصصات التدريسية", value: "all" },
                  ...SPECIALIZATIONS_LIST.map((s) => ({ label: s, value: s })),
                ]}
                className="h-10 text-xs"
              />
            </div>
          </div>

          {/* Bottom Row: Status Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
              <span className="font-semibold text-slate-600">عرض:</span>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  statusFilter === "active"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                النشطات ({stats.activeCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("archived")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  statusFilter === "archived"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                الأرشيف ({stats.archivedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  statusFilter === "all"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                الكل ({teachers.length})
              </button>
            </div>

            <span className="text-slate-400 font-medium text-[11px]">
              عرض {filteredTeachers.length} من أصل {teachers.length} معلمة
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="danger"
            title="فشل تحميل البيانات"
            description={error}
            actions={
              <Button size="sm" variant="outline" onClick={loadTeachers}>
                إعادة المحاولة
              </Button>
            }
          />
        )}

        {/* Teachers Table View */}
        <TeacherTable
          teachers={filteredTeachers}
          isLoading={isLoading}
          onViewProfile={(teacher) => setViewingTeacher(teacher)}
          onEdit={(teacher) => setEditingTeacher(teacher)}
          onArchive={(teacher) => setArchivingTeacher(teacher)}
          onRestore={(teacher) => handleRestoreTeacher(teacher)}
          onAddNew={() => setIsAddModalOpen(true)}
        />
      </main>

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTeacherAdded={handleTeacherAdded}
      />

      {/* Edit Teacher Modal */}
      <EditTeacherModal
        teacher={editingTeacher}
        isOpen={!!editingTeacher}
        onClose={() => setEditingTeacher(null)}
        onTeacherUpdated={handleTeacherUpdated}
      />

      {/* Archive Teacher Modal */}
      <ArchiveTeacherModal
        teacher={archivingTeacher}
        isOpen={!!archivingTeacher}
        onClose={() => setArchivingTeacher(null)}
        onTeacherArchived={handleTeacherArchived}
      />

      {/* Teacher Profile Modal */}
      <TeacherProfileModal
        teacher={viewingTeacher}
        isOpen={!!viewingTeacher}
        onClose={() => setViewingTeacher(null)}
        onEdit={(teacher) => {
          setViewingTeacher(null);
          setEditingTeacher(teacher);
        }}
      />

      {/* Excel Importer Multi-step Wizard */}
      <ExcelImporter
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onImportComplete={loadTeachers}
      />
    </div>
  );
}

export default function TeachersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-teal-800 font-cairo">
          جاري تحميل شاشة إدارة المعلمات...
        </div>
      }
    >
      <TeachersPageContent />
    </Suspense>
  );
}
