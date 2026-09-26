"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Select,
  Combobox,
  DatePicker,
  TimePicker,
  FileUpload,
  Textarea,
  Checkbox,
  Radio,
  Modal,
  BottomSheet,
  ConfirmDialog,
  DataTable,
  Column,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  Dropdown,
  SkeletonLoader,
  EmptyState,
  StatsCard,
  Avatar,
  Timeline,
  TimelineItem,
  Alert,
  SuccessScreen,
  ErrorScreen,
} from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { useDisclosure } from "@/hooks/ui/useDisclosure";
import { useIsMobile } from "@/hooks/ui/useMediaQuery";
import {
  Users,
  CalendarX,
  Clock,
  FileMinus,
  Sparkles,
  Smartphone,
  Monitor,
  MoreVertical,
  Plus,
  Send,
  Eye,
  CheckCircle2,
  FileCheck2,
  ShieldAlert,
  Printer,
  RotateCcw,
} from "lucide-react";

// Prototype Mock Data for Table
interface PrototypeRecord {
  id: string;
  teacherName: string;
  nationalId: string;
  recordType: string;
  date: string;
  status: "pending" | "approved" | "justified" | "deducted";
  statusLabel: string;
}

const prototypeData: PrototypeRecord[] = [
  { id: "REC-101", teacherName: "نورة بنت عبد الله السالم", nationalId: "1087654321", recordType: "غياب بدون عذر", date: "1446/03/24", status: "pending", statusLabel: "بانتظار المساءلة" },
  { id: "REC-102", teacherName: "فاطمة محمد العتيبي", nationalId: "1098765432", recordType: "تأخر صباحي (45 د)", date: "1446/03/24", status: "justified", statusLabel: "عذر مقبول" },
  { id: "REC-103", teacherName: "منى خالد الدوسري", nationalId: "1076543210", recordType: "غياب مرضي", date: "1446/03/23", status: "approved", statusLabel: "إجازة معتمدة" },
  { id: "REC-104", teacherName: "ريم سلطان الحربي", nationalId: "1065432109", recordType: "غياب بدون عذر", date: "1446/03/22", status: "deducted", statusLabel: "صدر قرار حسم" },
  { id: "REC-105", teacherName: "أمل سعد القحطاني", nationalId: "1054321098", recordType: "تأخر صباحي (30 د)", date: "1446/03/21", status: "pending", statusLabel: "قيد المتابعة" },
  { id: "REC-106", teacherName: "عبير صالح الغامدي", nationalId: "1043210987", recordType: "غياب اضطراري", date: "1446/03/20", status: "approved", statusLabel: "معتمد" },
];

export default function Sprint1Page() {
  const { success, error, warning, info } = useToast();
  const isMobile = useIsMobile();

  // Modals & Sheets Disclosures
  const modalFormDisclosure = useDisclosure(false);
  const mobileSheetFormDisclosure = useDisclosure(false);
  const confirmDisclosure = useDisclosure(false);
  const successScreenDisclosure = useDisclosure(false);

  // Form State Demo
  const [formTeacher, setFormTeacher] = useState("");
  const [formDate, setFormDate] = useState("2026-09-27");
  const [formTime, setFormTime] = useState("07:45");
  const [formType, setFormType] = useState("absence");
  const [formNotes, setFormNotes] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const teacherOptions = [
    { value: "t1", label: "نورة بنت عبد الله السالم", description: "معلمة لغة عربية — هـ: 0501234567" },
    { value: "t2", label: "فاطمة محمد العتيبي", description: "معلمة رياضيات — هـ: 0559876543" },
    { value: "t3", label: "منى خالد الدوسري", description: "معلمة علوم — هـ: 0541122334" },
    { value: "t4", label: "ريم سلطان الحربي", description: "معلمة دراسات إسلامية — هـ: 0563344556" },
  ];

  const timelineItems: TimelineItem[] = [
    {
      id: "1",
      title: "رصد غياب يومي",
      timestamp: "اليوم 08:00 ص",
      description: "تم رصد الغياب وتوليد مسودة المساءلة الإدارية آلياً",
      status: "completed",
    },
    {
      id: "2",
      title: "إرسال إشعار الواتساب والمنصة",
      timestamp: "اليوم 08:15 ص",
      description: "تم إرسال رابط التبرير المباشر للمعلمة عبر الواتساب المعتمد",
      status: "completed",
      badgeText: "WhatsApp Sent",
    },
    {
      id: "3",
      title: "انتظار رد المعلمة",
      timestamp: "متبقي 24 ساعة",
      description: "النظام في انتظار إرفاق التقرير الطبي أو تقديم العذر الإداري",
      status: "current",
    },
    {
      id: "4",
      title: "اعتماد الوكيلة أو الحسم",
      timestamp: "خطوة قادمة",
      description: "مراجعة العذر الإداري أو إحالة المعاملة لإصدار قرار الحسم",
      status: "pending",
    },
  ];

  const handleValidateForm = () => {
    const errs: Record<string, string> = {};
    if (!formTeacher) errs.teacher = "يرجى اختيار المعلمة من القائمة المعتمدة";
    if (!formNotes.trim()) errs.notes = "يرجى كتابة الملاحظة أو التوجيه الإداري";

    setFormErrors(errs);
    if (Object.keys(errs).length === 0) {
      modalFormDisclosure.onClose();
      mobileSheetFormDisclosure.onClose();
      successScreenDisclosure.onOpen();
      success("تم التحقق من صحة النموذج وإرسال الإجراء الإداري!");
    } else {
      warning("يرجى إكمال الحقول الإلزامية قبل المتابعة");
    }
  };

  const tableColumns: Column<PrototypeRecord>[] = [
    {
      key: "teacherName",
      header: "اسم المعلمة",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={item.teacherName} size="sm" />
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900">{item.teacherName}</p>
            <p className="text-[10px] text-slate-400 font-mono">سجل: {item.nationalId}</p>
          </div>
        </div>
      ),
    },
    {
      key: "recordType",
      header: "نوع المعاملة",
      sortable: true,
      render: (item) => <span className="font-semibold text-slate-700">{item.recordType}</span>,
    },
    {
      key: "date",
      header: "التاريخ",
      sortable: true,
      render: (item) => <span className="text-slate-500 font-mono text-xs">{item.date}</span>,
    },
    {
      key: "status",
      header: "الحالة الإدارية",
      render: (item) => {
        const variantMap: Record<PrototypeRecord["status"], "warning" | "success" | "danger" | "neutral"> = {
          pending: "warning",
          approved: "success",
          justified: "neutral",
          deducted: "danger",
        };
        return (
          <Badge variant={variantMap[item.status]} size="sm" dot>
            {item.statusLabel}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "الإجراءات",
      render: (item) => (
        <Dropdown
          align="left"
          trigger={
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          }
          items={[
            { id: "view", label: "معاينة السجل", icon: <Eye className="w-3.5 h-3.5" />, onClick: () => info(`عرض تفاصيل المعاملة ${item.id}`) },
            { id: "confirm", label: "طلب مساءلة رسمية", icon: <Send className="w-3.5 h-3.5" />, onClick: () => confirmDisclosure.onOpen() },
            { id: "print", label: "طباعة الإشعار", icon: <Printer className="w-3.5 h-3.5" />, onClick: () => success("تم إرسال المستند للطباعة") },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="نظام التصميم المتقدم وتجربة المستخدم — Sprint 1"
        description="بيئة العرض التفاعلية الشاملة: نماذج لوحة التحكم، مكتبة مكونات الإدخال والعرض، أنماط النماذج والجداول، وأنظمة التنبيهات المؤسسية."
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "نظام التصميم وتجربة الاستخدام" },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Smartphone className="w-4 h-4 text-teal-600" />}
              onClick={mobileSheetFormDisclosure.onOpen}
            >
              نموذج الجوال (Bottom Sheet)
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={modalFormDisclosure.onOpen}
            >
              نموذج الحوار (Modal Form)
            </Button>
          </div>
        }
      />

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="w-full sm:w-auto overflow-x-auto justify-start flex-nowrap">
          <TabsTrigger value="dashboard">لوحة التحكم النموذجية (Dashboard)</TabsTrigger>
          <TabsTrigger value="forms">أنماط النماذج (Forms UX)</TabsTrigger>
          <TabsTrigger value="components">مكتبة المكونات (UI Library)</TabsTrigger>
          <TabsTrigger value="tokens">المتغيرات وسهولة الوصول (Tokens & A11y)</TabsTrigger>
        </TabsList>

        {/* TAB 1: DASHBOARD SKELETON & PROTOTYPE */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Important Alert Banner */}
          <Alert
            variant="warning"
            title="تنبيه إداري عاجل للمتابعة الصباحية"
            description="يوجد 4 معلمات لم يسجلن الحضور حتى تمام الساعة 08:15 ص. يتيح النظام إرسال المساءلات بضغطة زر واحدة."
            dismissible
            actions={
              <Button
                variant="warning"
                size="sm"
                onClick={() => success("تم تفعيل إشعار الإنذار المبكر للمعلمات")}
              >
                إرسال تنبيه جماعي عبر الواتساب
              </Button>
            }
          />

          {/* KPI Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="نسبة الحضور اليوم"
              value="96.4%"
              subtitle="من إجمالي 56 معلمة"
              variant="success"
              icon={<Users className="w-6 h-6" />}
              trend={{ value: "+2.1%", direction: "down", label: "تحسن عن الأسبوع الماضي" }}
            />

            <StatsCard
              title="غياب اليوم بدون عذر"
              value="2"
              subtitle="يتطلب إصدار مساءلة"
              variant="danger"
              icon={<CalendarX className="w-6 h-6" />}
              trend={{ value: "+1", direction: "up", label: "زيادة عن أمس" }}
            />

            <StatsCard
              title="حالات التأخر الصباحي"
              value="3"
              subtitle="إجمالي 75 دقيقة"
              variant="warning"
              icon={<Clock className="w-6 h-6" />}
              trend={{ value: "0", direction: "neutral", label: "مستقر" }}
            />

            <StatsCard
              title="قرارات الحسم المعتمدة"
              value="1"
              subtitle="العام الدراسي الحالي"
              variant="primary"
              icon={<FileMinus className="w-6 h-6" />}
            />
          </div>

          {/* Interactive DataTable & Timeline Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table Area (2 cols on desktop) */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>سجل المعاملات اليومي التفاعلي</CardTitle>
                    <CardDescription>
                      يدعم البحث، الفلترة الفورية، الفرز، تحديد الصفوف، والتكيف الذكي مع شاشات الجوال
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={tableColumns}
                    data={prototypeData}
                    searchKey="teacherName"
                    searchPlaceholder="ابحث باسم المعلمة أو السجل المدني..."
                    filterOptions={[
                      { label: "جميع السجلات", value: "all", filterFn: () => true },
                      { label: "بانتظار المساءلة", value: "pending", filterFn: (i) => i.status === "pending" },
                      { label: "معتمد ومبرر", value: "approved", filterFn: (i) => i.status === "approved" || i.status === "justified" },
                      { label: "قرارات الحسم", value: "deducted", filterFn: (i) => i.status === "deducted" },
                    ]}
                    batchActions={(ids) => (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => success(`تم إرسال مساءلات مجمعة لـ ${ids.length} سجلات`)}
                        >
                          إرسال مساءلات مجمعة
                        </Button>
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Timeline Area (1 col on desktop) */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>دورة حياة الإجراء الإداري</CardTitle>
                  <CardDescription>التسلسل الزمني لمسار المساءلة والحسم</CardDescription>
                </CardHeader>
                <CardContent>
                  <Timeline items={timelineItems} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: FORMS UX PATTERNS */}
        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>نمط النموذج الكامل (Full Page Form Pattern)</CardTitle>
              <CardDescription>
                تقسيم الحقول لمجموعات منطقية، تقليل الإدخال اليدوي، التحقق الفوري، وحظر الأخطاء الإدارية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Group 1: الأساسيات */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider pb-1 border-b border-teal-100">
                  1. البيانات الإدارية الأساسية
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Combobox
                    label="المعلمة المعنية *"
                    placeholder="ابحث بالاسم أو السجل أو التخصص..."
                    options={teacherOptions}
                    value={formTeacher}
                    onChange={(val) => {
                      setFormTeacher(val);
                      if (formErrors.teacher) setFormErrors((prev) => ({ ...prev, teacher: "" }));
                    }}
                    error={formErrors.teacher}
                    helperText="البحث الذكي يمنع كتابة الأسماء بشكل خاطئ"
                  />

                  <Select
                    label="نوع الإجراء الإداري *"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    options={[
                      { value: "absence", label: "رصد غياب بدون عذر" },
                      { value: "delay", label: "إشعار تأخر صباحي" },
                      { value: "sick", label: "إجازة مرضية معتمدة" },
                      { value: "emergency", label: "غياب اضطراري" },
                    ]}
                  />
                </div>
              </div>

              {/* Group 2: المواعيد والتوقيت */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider pb-1 border-b border-teal-100">
                  2. التاريخ والتوقيت الإداري
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                    label="تاريخ الواقعة *"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    showQuickPresets
                    onPresetSelect={(d) => setFormDate(d)}
                    helperText="أزرار (اليوم / أمس) للاختيار السريع بنقرة واحدة"
                  />

                  <TimePicker
                    label="وقت الحضور الفعلي (في حال التأخر)"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    helperText="يُحسب التأخر تلقائياً بعد الساعة 07:00 ص"
                  />
                </div>
              </div>

              {/* Group 3: الملاحظات والمرفقات */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider pb-1 border-b border-teal-100">
                  3. المبررات والمستندات الثبوتية
                </h4>
                <Textarea
                  label="الملاحظات والتوجيه الإداري *"
                  placeholder="اكتبي توجيه إدارة المدرسة أو نص المساءلة..."
                  value={formNotes}
                  onChange={(e) => {
                    setFormNotes(e.target.value);
                    if (formErrors.notes) setFormErrors((prev) => ({ ...prev, notes: "" }));
                  }}
                  error={formErrors.notes}
                  rows={3}
                />

                <FileUpload
                  label="المرفق أو التقرير الطبي (اختياري)"
                  value={formFile}
                  onChange={setFormFile}
                  accept="image/*,application/pdf"
                  maxSizeMb={5}
                  helperText="يتم فحص الامتداد وضغط الصور آلياً لتسريع الرفع"
                />

                <Checkbox
                  label="إرسال إشعار فوري مباشر عبر الواتساب"
                  description="سيتم فتح محادثة الواتساب المعتمدة وتجهيز نص الرسالة آلياً"
                  defaultChecked
                />
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setFormTeacher("");
                  setFormNotes("");
                  setFormFile(null);
                  setFormErrors({});
                }}
              >
                تفريغ الحقول
              </Button>
              <Button
                variant="primary"
                size="md"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleValidateForm}
              >
                اعتماد وتثبيت المعاملة
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* TAB 3: UI COMPONENTS SHOWCASE */}
        <TabsContent value="components" className="space-y-6">
          {/* Buttons Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>أنواع وحالات الأزرار (Buttons States & Variants)</CardTitle>
              <CardDescription>Primary, Secondary, Success, Danger, Ghost, Outline مع حالات التحميل والتعطيل</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">أساسي (Primary)</Button>
                <Button variant="secondary">ثانوي (Secondary)</Button>
                <Button variant="success">ناجح (Success)</Button>
                <Button variant="danger">حسم / خطر (Danger)</Button>
                <Button variant="warning">تحذير (Warning)</Button>
                <Button variant="outline">إطار (Outline)</Button>
                <Button variant="ghost">شفاف (Ghost)</Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                <Button variant="primary" isLoading>جاري المعالجة</Button>
                <Button variant="success" isLoading>جاري الاعتماد</Button>
                <Button variant="danger" disabled>زر معطل (Disabled)</Button>
                <Button variant="primary" size="sm">حجم صغير (sm)</Button>
                <Button variant="primary" size="md">حجم متوسط (md)</Button>
                <Button variant="primary" size="lg">حجم كبير (lg)</Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges & Avatars Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>شارات الحالة (Badges)</CardTitle>
                <CardDescription>دعم الحالات الإدارية مع النقطة النبضية</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="primary" dot>معاملة جديدة</Badge>
                <Badge variant="success" dot>إجازة مقبولة</Badge>
                <Badge variant="warning" dot>بانتظار الإفادة</Badge>
                <Badge variant="danger" dot>حسم صادر</Badge>
                <Badge variant="neutral">مؤرشف</Badge>
                <Badge variant="outline">مسودة</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الصور الرمزية (Avatars)</CardTitle>
                <CardDescription>توليد الأحرف الأولى وحالة الاتصال</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar name="سارة المنصور" size="sm" status="online" />
                <Avatar name="فاطمة العتيبي" size="md" status="busy" />
                <Avatar name="نورة السالم" size="lg" status="away" />
                <Avatar name="منى الدوسري" size="xl" status="offline" />
              </CardContent>
            </Card>
          </div>

          {/* Feedback Alerts Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>لوحات التنبيه المضمنة (Contextual Alerts)</CardTitle>
              <CardDescription>الأشكال الأربعة للتنبيهات الإدارية المباشرة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert variant="primary" title="معلومة تنظيمية" description="تم تحديث ضوابط المساءلات حسب تعميم الوزارة الأخير." dismissible />
              <Alert variant="success" title="تم الحفظ بنجاح" description="تم اعتماد التقرير الإداري وإدراجه في ملف المعلمة." dismissible />
              <Alert variant="warning" title="إنذار مبكر" description="المعلمة بلغت 210 دقيقة تأخر خلال الفصل الدراسي." dismissible />
              <Alert variant="danger" title="حالة حرجة" description="تجاوز الغياب بدون عذر الحد النظامي (5 أيام متصلة)." dismissible />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: DESIGN TOKENS & ACCESSIBILITY */}
        <TabsContent value="tokens" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>مصفوفة التباين وسهولة الوصول (Accessibility & Contrast Matrix)</CardTitle>
              <CardDescription>مطابقة معايير WCAG 2.1 AA للألوان والخطوط ومؤشرات التركيز</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                  <h5 className="font-bold text-teal-900 text-xs mb-1">التركيز عبر لوحة المفاتيح (Focus Ring)</h5>
                  <p className="text-xs text-teal-800">
                    جميع الحقول والأزرار مجهزة بحلقة تركيز مزدوجة واضحة: <code className="font-mono text-[11px] bg-white px-1 py-0.5 rounded">focus:ring-2 focus:ring-teal-500</code>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">دعم قارئات الشاشة (ARIA)</h5>
                  <p className="text-xs text-slate-700">
                    العناصر التفاعلية مثل الجداول، النوافذ، والقوائم تمتلك <code className="font-mono text-[11px] bg-white px-1 py-0.5 rounded">role</code> و <code className="font-mono text-[11px] bg-white px-1 py-0.5 rounded">aria-labels</code> عربية صريحة.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <h5 className="font-bold text-emerald-900 text-xs mb-1">المحاذاة والاتجاه (Strict RTL)</h5>
                  <p className="text-xs text-emerald-800">
                    تمت معايرة جميع الأيقونات، حقول الإدخال، الجداول، وأشرطة التمرير لتبدأ من اليمين بدون تشوهات بصرية.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL FORM PROTOTYPE */}
      <Modal
        isOpen={modalFormDisclosure.isOpen}
        onClose={modalFormDisclosure.onClose}
        title="رصد معاملة جديدة — نافذة سريعة"
        description="تسجيل غياب أو تأخر بدون مغادرة الشاشة الحالية"
        size="lg"
      >
        <div className="space-y-4 pt-1" dir="rtl">
          <Combobox
            label="اسم المعلمة *"
            options={teacherOptions}
            value={formTeacher}
            onChange={setFormTeacher}
            error={formErrors.teacher}
          />
          <div className="grid grid-cols-2 gap-3">
            <DatePicker label="التاريخ *" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
            <Select
              label="نوع المعاملة *"
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              options={[
                { value: "absence", label: "غياب بدون عذر" },
                { value: "delay", label: "تأخر صباحي" },
                { value: "sick", label: "إجازة مرضية" },
              ]}
            />
          </div>
          <Textarea
            label="نص الإشعار أو الملاحظة *"
            placeholder="اكتبي الملاحظة الإدارية..."
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            error={formErrors.notes}
            rows={2}
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={modalFormDisclosure.onClose}>
              إلغاء
            </Button>
            <Button variant="primary" size="sm" onClick={handleValidateForm}>
              حفظ المعاملة
            </Button>
          </div>
        </div>
      </Modal>

      {/* MOBILE BOTTOM SHEET FORM PROTOTYPE */}
      <BottomSheet
        isOpen={mobileSheetFormDisclosure.isOpen}
        onClose={mobileSheetFormDisclosure.onClose}
        title="تسجيل ميداني بالجوال"
        description="مصمم للاستخدام السريع بالإبهام أثناء الجولات الصباحية"
      >
        <div className="space-y-4 pt-2">
          <Combobox
            label="المعلمة *"
            options={teacherOptions}
            value={formTeacher}
            onChange={setFormTeacher}
            error={formErrors.teacher}
          />
          <div className="grid grid-cols-2 gap-3">
            <DatePicker label="التاريخ" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
            <TimePicker label="الوقت" value={formTime} onChange={(e) => setFormTime(e.target.value)} />
          </div>
          <Textarea
            label="الملاحظة"
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            error={formErrors.notes}
            placeholder="ملاحظة سريعة..."
            rows={2}
          />
          <Button variant="primary" className="w-full h-12 text-sm font-bold" onClick={handleValidateForm}>
            تأكيد التسجيل الميداني
          </Button>
        </div>
      </BottomSheet>

      {/* CONFIRM DIALOG PROTOTYPE */}
      <ConfirmDialog
        isOpen={confirmDisclosure.isOpen}
        onClose={confirmDisclosure.onClose}
        onConfirm={() => {
          confirmDisclosure.onClose();
          error("تم إصدار المساءلة الإدارية الرسمية");
        }}
        title="تأكيد إصدار مساءلة إدارية رسمية"
        message="سيترتب على هذا الإجراء إرسال خطاب رسمي ومطالبة المعلمة بالرد المبرر خلال المهلة النظامية."
        confirmText="نعم، إصدار المساءلة"
        cancelText="تراجع"
        variant="warning"
      />

      {/* SUCCESS SCREEN MODAL PROTOTYPE */}
      <Modal
        isOpen={successScreenDisclosure.isOpen}
        onClose={successScreenDisclosure.onClose}
        size="lg"
      >
        <SuccessScreen
          title="تم اعتماد المعاملة الإدارية بنجاح"
          description="تم تسجيل المعاملة في ملف المعلمة، وتحديث إحصائيات الحضور والغياب، وإشعار المعلمة إلكترونياً."
          referenceNumber="INQ-1446-089"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => success("تمت طباعة المستند")}
              >
                طباعة النموذج
              </Button>
              <Button variant="outline" size="sm" onClick={successScreenDisclosure.onClose}>
                إغلاق
              </Button>
            </div>
          }
        />
      </Modal>
    </AdminLayout>
  );
}
