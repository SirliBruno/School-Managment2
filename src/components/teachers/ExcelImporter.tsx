"use client";

import React, { useState, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import {
  teacherImportService,
  type ColumnMapping,
  type ImportPreviewPlan,
  type ImportExecutionResult,
} from "@/services/teacherImportService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  FileCheck,
  XCircle,
  HelpCircle,
} from "lucide-react";

interface ExcelImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

type WizardStep = 1 | 2 | 3 | 4;

export function ExcelImporter({ isOpen, onClose, onImportComplete }: ExcelImporterProps) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<WizardStep>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Parsed raw data
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, unknown>[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});

  // Plan & Result
  const [plan, setPlan] = useState<ImportPreviewPlan | null>(null);
  const [executionResult, setExecutionResult] = useState<ImportExecutionResult | null>(null);
  const [isUndoing, setIsUndoing] = useState(false);

  const resetWizard = () => {
    setStep(1);
    setSelectedFile(null);
    setIsProcessing(false);
    setErrorMessage(null);
    setHeaders([]);
    setRawRows([]);
    setMapping({});
    setPlan(null);
    setExecutionResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  // Step 1: File Selection & Initial Parse
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  };

  const processSelectedFile = async (file: File) => {
    setErrorMessage(null);
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setErrorMessage("يرجى اختيار ملف Excel بصيغة .xlsx أو .xls");
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const parsed = await teacherImportService.parseExcelBuffer(buffer, file.name);

      setHeaders(parsed.headers);
      setRawRows(parsed.rows);

      // Auto detect mappings
      const autoMap = teacherImportService.autoDetectMapping(parsed.headers);
      setMapping(autoMap);

      setStep(2);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "فشل قراءة ملف Excel");
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: Confirm Mapping & Generate Preview Plan
  const handleConfirmMapping = async () => {
    if (!mapping.fullName || !mapping.nationalId) {
      setErrorMessage("حقول (الاسم الكامل) و (رقم الهوية) إلزامية للاستيراد");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const generatedPlan = await teacherImportService.generateImportPlan(
        rawRows,
        mapping,
        selectedFile?.name || "teachers.xlsx"
      );
      setPlan(generatedPlan);
      setStep(3);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "فشل تحليل ومعالجة خطة الاستيراد");
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 3: Execute Plan
  const handleExecuteImport = async () => {
    if (!plan) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const actor = user
        ? { userId: user.id, userName: user.fullName, userRole: user.role }
        : undefined;

      const result = await teacherImportService.executeImport(plan, actor);
      setExecutionResult(result);
      setStep(4);
      onImportComplete();
      addToast({
        type: "success",
        title: "اكتمل الاستيراد بنجاح",
        message: `تمت إضافة ${result.createdCount}، وتحديث ${result.updatedCount} سجل`,
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "حدث خطأ أثناء تنفيذ الاستيراد");
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 4: Undo Import
  const handleUndo = async () => {
    if (!executionResult) return;
    setIsUndoing(true);
    setErrorMessage(null);

    try {
      const actor = user
        ? { userId: user.id, userName: user.fullName, userRole: user.role }
        : undefined;

      const undoRes = await teacherImportService.undoImport(
        executionResult.operationId,
        actor
      );
      addToast({
        type: "warning",
        title: "تم التراجع عن الاستيراد",
        message: undoRes.message,
      });
      onImportComplete();
      handleClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "فشل التراجع عن العملية");
    } finally {
      setIsUndoing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="معالج استيراد بيانات المعلمات من Excel"
      size="xl"
    >
      <div className="font-cairo text-right space-y-5 pt-1" dir="rtl">
        {/* Wizard Step Progress Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
          {[
            { num: 1, label: "رفع الملف" },
            { num: 2, label: "مطابقة الأعمدة" },
            { num: 3, label: "معاينة الخطة" },
            { num: 4, label: "النتيجة والاعتماد" },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 font-bold ${
                step === s.num
                  ? "text-teal-700"
                  : step > s.num
                  ? "text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === s.num
                    ? "bg-teal-600 text-white"
                    : step > s.num
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {errorMessage && (
          <Alert
            variant="danger"
            title="تنبيه"
            description={errorMessage}
            dismissible
            onDismiss={() => setErrorMessage(null)}
          />
        )}

        {/* STEP 1: Upload File */}
        {step === 1 && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) processSelectedFile(file);
              }}
              className="border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/30 hover:bg-teal-50/60 rounded-3xl p-8 text-center cursor-pointer transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                اسحبي وأسقطي ملف كشف المعلمات هنا
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                يدعم كشوفات نظام نور وجداول Excel بصيغتي (.xlsx, .xls)
              </p>
              <Button size="sm" variant="primary" type="button" className="shadow-xs">
                اختيار ملف من الجهاز
              </Button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">ميزة التنظيف الذكي التلقائي:</span>
                <p className="mt-0.5 text-slate-500">
                  يقوم المحرك تلقائياً بتحويل الأرقام العربية إلى إنجليزية، وتوحيد صيغ الجوال
                  السعودية، وإزالة التكرارات وضبط الأسماء العربية دون الحاجة لتعديل الملف يدوياً.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Header Mapping */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-teal-50 rounded-2xl border border-teal-200">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-teal-700" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    {selectedFile?.name}
                  </span>
                  <span className="text-[11px] text-teal-800">
                    تم اكتشاف {headers.length} أعمدة و {rawRows.length} صفاً
                  </span>
                </div>
              </div>
              <Badge variant="success" size="sm">
                تم تحليل الملف
              </Badge>
            </div>

            <p className="text-xs text-slate-600 font-semibold">
              تأكدي من مطابقة أعمدة الملف مع حقول النظام (تمت المطابقة الذكية تلقائياً):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {[
                { key: "fullName", label: "الاسم الكامل / الرباعي *", required: true },
                { key: "nationalId", label: "رقم الهوية الوطنية / السجل *", required: true },
                { key: "mobileNumber", label: "رقم الجوال", required: false },
                { key: "specialization", label: "التخصص التدريسي", required: false },
                { key: "teachingField", label: "مجال التدريس", required: false },
                { key: "jobTitle", label: "المسمى الوظيفي", required: false },
                { key: "employmentType", label: "نوع التوظيف", required: false },
                { key: "email", label: "البريد الإلكتروني", required: false },
              ].map(({ key, label, required }) => (
                <div key={key} className="p-3 bg-white border border-slate-200 rounded-xl text-xs">
                  <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>{label}</span>
                    {required && <span className="text-rose-500 font-normal">إلزامي</span>}
                  </label>
                  <select
                    value={(mapping as any)[key] || ""}
                    onChange={(e) =>
                      setMapping((prev) => ({ ...prev, [key]: e.target.value || undefined }))
                    }
                    className="w-full h-9 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-teal-600 focus:bg-white transition-colors"
                  >
                    <option value="">-- اختاري العمود المقابل من الملف --</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                <span>العودة للملف</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmMapping}
                isLoading={isProcessing}
              >
                <span>متابعة لمعاينة الخطة</span>
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Preview Plan Review */}
        {step === 3 && plan && (
          <div className="space-y-4">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-[11px] text-emerald-800 block font-medium">سجلات جديدة</span>
                <span className="text-xl font-black text-emerald-700">
                  {plan.newTeachers.length}
                </span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <span className="text-[11px] text-blue-800 block font-medium">تحديث بيانات</span>
                <span className="text-xl font-black text-blue-700">
                  {plan.updatedTeachers.length}
                </span>
              </div>
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-center">
                <span className="text-[11px] text-teal-800 block font-medium">استعادة من الأرشيف</span>
                <span className="text-xl font-black text-teal-700">
                  {plan.restoredTeachers.length}
                </span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
                <span className="text-[11px] text-rose-800 block font-medium">صفوف متجاهلة</span>
                <span className="text-xl font-black text-rose-700">
                  {plan.ignoredRows.length}
                </span>
              </div>
            </div>

            {/* Preview Table of incoming items */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden max-h-64 overflow-y-auto text-xs">
              <table className="w-full text-right divide-y divide-slate-100">
                <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">الصف</th>
                    <th className="py-2.5 px-3">الاسم</th>
                    <th className="py-2.5 px-3">الهوية</th>
                    <th className="py-2.5 px-3">التخصص</th>
                    <th className="py-2.5 px-3">الإجراء المقرر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plan.newTeachers.map(({ row, data }) => (
                    <tr key={`new-${row.rowIndex}`} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-400 font-mono">#{row.rowIndex}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{data.fullName}</td>
                      <td className="py-2 px-3 font-mono text-slate-600">{data.nationalId}</td>
                      <td className="py-2 px-3 text-slate-600">{data.specialization}</td>
                      <td className="py-2 px-3">
                        <Badge variant="success" size="sm">
                          إضافة جديدة
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {plan.updatedTeachers.map(({ row, existing }) => (
                    <tr key={`upd-${row.rowIndex}`} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-400 font-mono">#{row.rowIndex}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{existing.fullName}</td>
                      <td className="py-2 px-3 font-mono text-slate-600">{existing.nationalId}</td>
                      <td className="py-2 px-3 text-slate-600">{existing.specialization}</td>
                      <td className="py-2 px-3">
                        <Badge variant="primary" size="sm">
                          تحديث تفاصيل
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {plan.ignoredRows.map(({ row, reason }) => (
                    <tr key={`ign-${row.rowIndex}`} className="bg-rose-50/40 text-rose-900">
                      <td className="py-2 px-3 font-mono">#{row.rowIndex}</td>
                      <td className="py-2 px-3 font-medium">{row.mapped.fullName || "-"}</td>
                      <td className="py-2 px-3 font-mono">{row.mapped.nationalId || "-"}</td>
                      <td className="py-2 px-3" colSpan={2}>
                        <span className="text-rose-700 font-semibold">{reason}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                <span>تعديل المطابقة</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteImport}
                isLoading={isProcessing}
              >
                <CheckCircle2 className="w-4 h-4 ml-1.5" />
                <span>اعتماد وتنفيذ الاستيراد</span>
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Execution Results & Undo */}
        {step === 4 && executionResult && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileCheck className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                تم استيراد بيانات الكادر التعليمي بنجاح!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ملف العملية: {executionResult.fileName} (المعرف: {executionResult.operationId})
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg mx-auto text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">تمت الإضافة</span>
                <span className="font-bold text-slate-900 text-lg">
                  {executionResult.createdCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">تم التحديث</span>
                <span className="font-bold text-slate-900 text-lg">
                  {executionResult.updatedCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">تمت الاستعادة</span>
                <span className="font-bold text-slate-900 text-lg">
                  {executionResult.restoredCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">تم الدمج</span>
                <span className="font-bold text-slate-900 text-lg">
                  {executionResult.mergedCount}
                </span>
              </div>
            </div>

            {/* Undo Action Option */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-right text-xs max-w-lg mx-auto">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                    <span>إمكانية التراجع الفوري (Undo Import):</span>
                  </span>
                  <p className="text-amber-700 text-[11px] mt-0.5">
                    في حال تم رفع ملف خاطئ، يمكنك التراجع الآن وحذف السجلات المضافة واستعادة البيانات
                    السابقة بنقرة واحدة.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleUndo}
                  isLoading={isUndoing}
                  className="shrink-0 text-xs"
                >
                  تراجع عن العملية
                </Button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-center">
              <Button variant="primary" size="md" onClick={handleClose}>
                إغلاق والعودة لقائمة المعلمات
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
