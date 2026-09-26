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
  Textarea,
  Checkbox,
  Radio,
  Modal,
  BottomSheet,
  ConfirmDialog,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  Dropdown,
  SkeletonLoader,
  EmptyState,
} from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { useDisclosure } from "@/hooks/ui/useDisclosure";
import { useIsMobile } from "@/hooks/ui/useMediaQuery";
import {
  CheckCircle,
  Database,
  Layers,
  Sparkles,
  Smartphone,
  Monitor,
  MoreVertical,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default function HomePage() {
  const { success, error, warning, info } = useToast();
  const isMobile = useIsMobile();

  const modalDisclosure = useDisclosure(false);
  const sheetDisclosure = useDisclosure(false);
  const confirmDisclosure = useDisclosure(false);

  const [testInput, setTestInput] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("opt1");
  const [checkboxChecked, setCheckboxChecked] = useState(true);

  return (
    <AdminLayout>
      <PageHeader
        title="التأسيس المعماري للمنصة — Sprint 0"
        description="تم استكمال وتجهيز البنية التحتية البرمجية، نظام التصميم الموحد، وطبقات البيانات والخدمات وفق معمارية Production-Ready جاهزة لاستقبال السبرينتات التشغيلية القادمة."
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "المعمارية الأساسية" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="success" size="md" dot>
              المنصة جاهزة للإنتاج
            </Badge>
            <Button
              variant="primary"
              size="sm"
              onClick={() => success("تم التحقق بنجاح من سلامة طبقة الإشعارات والتصميم!")}
            >
              اختبار الإشعارات
            </Button>
          </div>
        }
      />

      <div className="space-y-8">
        {/* Layer Architecture Overview Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">حالة طبقات المعمارية المعتمدة</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card variant="default">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Presentation</span>
                  <Badge variant="success" size="sm">جاهز</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Next.js + Tailwind</h4>
                <p className="text-[11px] text-slate-500 mt-1">20 مكون UI، دعم RTL كامل، تصميم Mobile-First</p>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Data Fetching</span>
                  <Badge variant="success" size="sm">جاهز</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900">TanStack Query</h4>
                <p className="text-[11px] text-slate-500 mt-1">إدارة الكاش، استراتيجيات إعادة المحاولة، وHooks مخصصة</p>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Domain / Service</span>
                  <Badge variant="success" size="sm">جاهز</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900">8 Domain Services</h4>
                <p className="text-[11px] text-slate-500 mt-1">عزل تام لمنطق الأعمال وتجهيز العقود البرمجية</p>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Repository</span>
                  <Badge variant="success" size="sm">جاهز</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900">5 Repositories</h4>
                <p className="text-[11px] text-slate-500 mt-1">فصل الوصول لقاعدة البيانات ومنع الاستعلام في الواجهات</p>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Database Layer</span>
                  <Badge variant="success" size="sm">جاهز</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Supabase Typed</h4>
                <p className="text-[11px] text-slate-500 mt-1">عميل المتصفح والخادم، أنواع الكيانات كاملة</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Visual Identity & Colors */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">الهوية البصرية ونظام الألوان (Design System)</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-teal-600 text-white shadow-sm">
              <span className="text-[11px] font-bold block opacity-80">Primary Color</span>
              <span className="text-sm font-black">Teal / Blue Green</span>
              <p className="text-[10px] mt-2 opacity-90">الهوية الأساسية، الأزرار، التنقل</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-sm">
              <span className="text-[11px] font-bold block opacity-80">Success</span>
              <span className="text-sm font-black">Emerald</span>
              <p className="text-[10px] mt-2 opacity-90">التأكيدات، العمليات الناجحة، الواتساب</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500 text-white shadow-sm">
              <span className="text-[11px] font-bold block opacity-80">Warning</span>
              <span className="text-sm font-black">Amber</span>
              <p className="text-[10px] mt-2 opacity-90">التنبيهات، الإنذار المبكر</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-600 text-white shadow-sm">
              <span className="text-[11px] font-bold block opacity-80">Danger</span>
              <span className="text-sm font-black">Rose</span>
              <p className="text-[10px] mt-2 opacity-90">الحسم، الأخطاء، الحالات الحرجة</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800 text-white shadow-sm col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold block opacity-80">Neutral</span>
              <span className="text-sm font-black">Slate</span>
              <p className="text-[10px] mt-2 opacity-90">الخلفيات، الحدود، النصوص</p>
            </div>
          </div>
        </section>

        {/* Interactive UI Components Test Arena */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">اختبار المكونات الأساسية وتفاعليتها</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {isMobile ? (
                <span className="flex items-center gap-1 text-teal-600 font-semibold">
                  <Smartphone className="w-4 h-4" /> نمط الجوال نشط
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <Monitor className="w-4 h-4" /> نمط سطح المكتب نشط
                </span>
              )}
            </div>
          </div>

          <Tabs defaultValue="forms" className="w-full">
            <TabsList>
              <TabsTrigger value="forms">النماذج والحقول</TabsTrigger>
              <TabsTrigger value="overlays">النوافذ والطبقات</TabsTrigger>
              <TabsTrigger value="tables">الجداول والبيانات</TabsTrigger>
              <TabsTrigger value="feedback">التنبيهات والتحميل</TabsTrigger>
            </TabsList>

            {/* Tab 1: Forms & Inputs */}
            <TabsContent value="forms">
              <Card>
                <CardHeader>
                  <CardTitle>مكونات الإدخال التفاعلية (RTL Forms)</CardTitle>
                  <CardDescription>تدعم حالات التركيز، الخطأ، التعطيل، والتسميات التوضيحية</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="الاسم الثلاثي للمعلمة"
                    placeholder="أدخل الاسم كاملاً..."
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    helperText="حقل نصي يدعم المحاذاة العربية الكاملة"
                  />
                  <Select
                    label="نوع الإجراء الإداري"
                    options={[
                      { value: "inquiry", label: "مساءلة إدارية" },
                      { value: "delay", label: "إشعار تأخر" },
                      { value: "deduction", label: "قرار حسم" },
                    ]}
                  />
                  <div className="md:col-span-2">
                    <Textarea
                      label="ملاحظات إدارية"
                      placeholder="اكتب التوجيه الإداري هنا..."
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Checkbox
                      label="إرسال إشعار فوري عبر الواتساب"
                      description="سيتم إرسال إشعار مباشر لمعلمة المدرسة عبر الرابط المعتمد"
                      checked={checkboxChecked}
                      onChange={(e) => setCheckboxChecked(e.target.checked)}
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <Radio
                      name="optionGroup"
                      label="خيار إداري أول"
                      checked={selectedRadio === "opt1"}
                      onChange={() => setSelectedRadio("opt1")}
                    />
                    <Radio
                      name="optionGroup"
                      label="خيار إداري ثانٍ"
                      checked={selectedRadio === "opt2"}
                      onChange={() => setSelectedRadio("opt2")}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Overlays (Modal, Drawer, BottomSheet, ConfirmDialog) */}
            <TabsContent value="overlays">
              <Card>
                <CardHeader>
                  <CardTitle>نوافذ الحوار والطبقات المنبثقة</CardTitle>
                  <CardDescription>
                    Mobile-First: دعم BottomSheet للجوال وModal لسطح المكتب
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" onClick={modalDisclosure.onOpen}>
                      فتح نافذة حوار (Modal)
                    </Button>
                    <Button variant="secondary" onClick={sheetDisclosure.onOpen}>
                      فتح ورقة سفلية (BottomSheet)
                    </Button>
                    <Button variant="danger" onClick={confirmDisclosure.onOpen}>
                      فتح نافذة تأكيد الإجراء (ConfirmDialog)
                    </Button>
                    <Dropdown
                      trigger={
                        <Button variant="outline" rightIcon={<MoreVertical className="w-4 h-4" />}>
                          قائمة منسدلة (Dropdown)
                        </Button>
                      }
                      items={[
                        { id: "1", label: "عرض السجل", onClick: () => info("تم النقر على عرض السجل") },
                        { id: "2", label: "تصدير البيانات", onClick: () => success("تم تجهيز التصدير") },
                        { id: "3", label: "إلغاء المعاملة", danger: true, onClick: () => warning("تم طلب الإلغاء") },
                      ]}
                    />
                    <Tooltip content="تلميح سريع لتوضيح الوظيفة الإدارية">
                      <Button variant="ghost">تلميح (Tooltip)</Button>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Tables & Responsive Data */}
            <TabsContent value="tables">
              <Card>
                <CardHeader>
                  <CardTitle>جدول البيانات الإداري المتجاوب</CardTitle>
                  <CardDescription>يدعم التمرير الأفقي والتكيف التلقائي مع شاشات الجوال</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الرقم</TableHead>
                        <TableHead>المعمارية / الطبقة</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>التقنية المعتمدة</TableHead>
                        <TableHead>السبرينت المستهدف</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>01</TableCell>
                        <TableCell className="font-bold">إدارة المعلمات</TableCell>
                        <TableCell><Badge variant="primary" size="sm">مجهزة تقنياً</Badge></TableCell>
                        <TableCell>TeachersRepository</TableCell>
                        <TableCell>Sprint 1</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>02</TableCell>
                        <TableCell className="font-bold">رصد الغياب والتأخر</TableCell>
                        <TableCell><Badge variant="primary" size="sm">مجهزة تقنياً</Badge></TableCell>
                        <TableCell>AbsenceRecordsRepository</TableCell>
                        <TableCell>Sprint 2</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>03</TableCell>
                        <TableCell className="font-bold">المساءلات الإدارية</TableCell>
                        <TableCell><Badge variant="primary" size="sm">مجهزة تقنياً</Badge></TableCell>
                        <TableCell>InquiryService</TableCell>
                        <TableCell>Sprint 3</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>04</TableCell>
                        <TableCell className="font-bold">قرارات الحسم</TableCell>
                        <TableCell><Badge variant="primary" size="sm">مجهزة تقنياً</Badge></TableCell>
                        <TableCell>DeductionService</TableCell>
                        <TableCell>Sprint 4</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Feedback & Loading */}
            <TabsContent value="feedback">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>إرسال تنبيهات Toast</CardTitle>
                    <CardDescription>تنبيهات فورية تدعم الأنواع الإدارية الأربعة</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button variant="primary" size="sm" onClick={() => success("تم حفظ السجل بنجاح في قاعدة البيانات.")}>
                      نجاح (Success)
                    </Button>
                    <Button variant="warning" size="sm" onClick={() => warning("تنبيه: اقترب رصيد التأخر من حد المساءلة.")}>
                      تحذير (Warning)
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => error("خطأ: تعذر معالجة الطلب، يرجى المحاولة لاحقاً.")}>
                      خطأ (Danger)
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => info("معلومة: تم تحديث البيانات التلقائية.")}>
                      معلومة (Info)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>مؤشرات التحميل والحالة الفارغة</CardTitle>
                    <CardDescription>Skeleton Loader & Empty State</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <SkeletonLoader className="h-4 w-3/4" />
                      <SkeletonLoader className="h-4 w-1/2" />
                    </div>
                    <EmptyState
                      title="لا توجد بيانات تشغيلية في هذا السبرينت"
                      description="سبرينت 0 مخصص فقط للبنية التحتية التأسيسية. سيتم بناء شاشات العمليات في السبرينتات القادمة."
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>

      {/* Test Modal */}
      <Modal
        isOpen={modalDisclosure.isOpen}
        onClose={modalDisclosure.onClose}
        title="نافذة حوار إدارية تجريبية"
        description="توضيح لطريقة عمل النوافذ المنبثقة مع الحفاظ على اتجاه RTL والتحكم المرن."
      >
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          هذه النافذة مخصصة للعمليات المكتبية، وتدعم مفتاح Escape للنوافذ المنبثقة وتعتيم الخلفية تلقائياً.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={modalDisclosure.onClose}>
            إغلاق النافذة
          </Button>
          <Button variant="primary" size="sm" onClick={() => { modalDisclosure.onClose(); success("تم الإجراء بنجاح"); }}>
            موافق
          </Button>
        </div>
      </Modal>

      {/* Test BottomSheet */}
      <BottomSheet
        isOpen={sheetDisclosure.isOpen}
        onClose={sheetDisclosure.onClose}
        title="ورقة سفلية للجوال (Bottom Sheet)"
        description="مصممة خصيصاً لتسهيل الاستخدام بالإبهام على الهواتف الذكية."
      >
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          تفتح هذه الورقة من الأسفل بسلاسة عبر حركات متحركة وتدعم السحب والإغلاق السريع للمسؤولات أثناء التنقل الميداني.
        </p>
        <Button variant="primary" className="w-full" onClick={sheetDisclosure.onClose}>
          إغلاق الورقة السفلية
        </Button>
      </BottomSheet>

      {/* Test ConfirmDialog */}
      <ConfirmDialog
        isOpen={confirmDisclosure.isOpen}
        onClose={confirmDisclosure.onClose}
        onConfirm={() => {
          confirmDisclosure.onClose();
          error("تم تنفيذ الحسم التجريبي بنجاح!");
        }}
        title="تأكيد تنفيذ الحسم الإداري"
        message="هل أنتِ متأكدة من اعتماد قرار الحسم؟ هذا الإجراء يمثل نموذجاً لنوافذ التأكيد الحساسة."
        confirmText="تأكيد الحسم"
        variant="danger"
      />
    </AdminLayout>
  );
}
