"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  type Teacher,
  type TeacherInsertInput,
  SPECIALIZATIONS_LIST,
  EMPLOYMENT_TYPES,
  TEACHING_FIELDS,
} from "@/types/teacher";
import { teacherService } from "@/services/teacherService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { UserPlus, User, CreditCard, Phone, Mail, BookOpen } from "lucide-react";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeacherAdded: (teacher: Teacher) => void;
}

export function AddTeacherModal({
  isOpen,
  onClose,
  onTeacherAdded,
}: AddTeacherModalProps) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("معلمة");
  const [employmentType, setEmploymentType] = useState<string>(EMPLOYMENT_TYPES[0]);
  const [teachingField, setTeachingField] = useState<string>(TEACHING_FIELDS[0]);
  const [specialization, setSpecialization] = useState<string>(SPECIALIZATIONS_LIST[0]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const resetForm = () => {
    setFullName("");
    setNationalId("");
    setMobileNumber("");
    setEmail("");
    setJobTitle("معلمة");
    setEmploymentType(EMPLOYMENT_TYPES[0]);
    setTeachingField(TEACHING_FIELDS[0]);
    setSpecialization(SPECIALIZATIONS_LIST[0]);
    setErrors({});
    setGeneralError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    setIsSubmitting(true);

    const payload: TeacherInsertInput = {
      fullName,
      nationalId,
      mobileNumber,
      email: email.trim() || null,
      jobTitle,
      employmentType,
      teachingField,
      specialization,
    };

    const actor = user
      ? {
          userId: user.id,
          userName: user.fullName,
          userRole: user.role,
        }
      : undefined;

    const res = await teacherService.createTeacher(payload, actor);
    setIsSubmitting(false);

    if (res.success && res.teacher) {
      addToast({
        type: "success",
        title: "تمت إضافة المعلمة بنجاح",
        message: `تم تسجيل المعلمة ${res.teacher.fullName} في كادر المدرسة`,
      });
      onTeacherAdded(res.teacher);
      handleClose();
    } else {
      if (res.errors) {
        setErrors(res.errors);
        if (res.errors.nationalId) {
          setGeneralError(res.errors.nationalId);
        }
      } else {
        setGeneralError("فشل حفظ بيانات المعلمة. يرجى التحقق من الحقول.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="إضافة معلمة جديدة إلى الكادر"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1 font-cairo text-right" dir="rtl">
        {generalError && (
          <Alert
            variant="danger"
            title="تنبيه التحقق"
            description={generalError}
            dismissible
            onDismiss={() => setGeneralError(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <Input
              label="الاسم الرباعي للمعلمة *"
              placeholder="مثال: أ. هند بنت راشد بن محمد القحطاني"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              leftIcon={<User className="w-4 h-4" />}
              required
            />
          </div>

          {/* National ID */}
          <div>
            <Input
              label="رقم الهوية الوطنية أو الإقامة *"
              placeholder="10 أرقام تبدأ بـ 1 أو 2"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value.replace(/\D/g, "").slice(0, 10))}
              error={errors.nationalId}
              leftIcon={<CreditCard className="w-4 h-4" />}
              maxLength={10}
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <Input
              label="رقم الجوال للتواصل *"
              placeholder="05XXXXXXXX"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              error={errors.mobileNumber}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />
          </div>

          {/* Specialization */}
          <div>
            <Select
              label="التخصص التدريسي *"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              options={SPECIALIZATIONS_LIST.map((s) => ({ label: s, value: s }))}
            />
          </div>

          {/* Teaching Field */}
          <div>
            <Select
              label="مجال التدريس *"
              value={teachingField}
              onChange={(e) => setTeachingField(e.target.value)}
              options={TEACHING_FIELDS.map((f) => ({ label: f, value: f }))}
            />
          </div>

          {/* Employment Type */}
          <div>
            <Select
              label="نوع التوظيف *"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              options={EMPLOYMENT_TYPES.map((t) => ({ label: t, value: t }))}
            />
          </div>

          {/* Job Title */}
          <div>
            <Input
              label="المسمى الوظيفي"
              placeholder="معلمة، معلمة أولى، منسقة..."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              leftIcon={<BookOpen className="w-4 h-4" />}
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <Input
              label="البريد الإلكتروني (اختياري)"
              type="email"
              placeholder="teacher@school.edu.sa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            <UserPlus className="w-4 h-4 ml-2" />
            <span>حفظ بيانات المعلمة</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
