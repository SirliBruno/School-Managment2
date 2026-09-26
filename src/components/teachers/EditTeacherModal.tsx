"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  type Teacher,
  type TeacherUpdateInput,
  SPECIALIZATIONS_LIST,
  EMPLOYMENT_TYPES,
  TEACHING_FIELDS,
} from "@/types/teacher";
import { teacherService } from "@/services/teacherService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Save, User, CreditCard, Phone, Mail, BookOpen } from "lucide-react";

interface EditTeacherModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  onTeacherUpdated: (teacher: Teacher) => void;
}

export function EditTeacherModal({
  teacher,
  isOpen,
  onClose,
  onTeacherUpdated,
}: EditTeacherModalProps) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [employmentType, setEmploymentType] = useState<string>(EMPLOYMENT_TYPES[0]);
  const [teachingField, setTeachingField] = useState<string>(TEACHING_FIELDS[0]);
  const [specialization, setSpecialization] = useState<string>(SPECIALIZATIONS_LIST[0]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (teacher) {
      setFullName(teacher.fullName || "");
      setNationalId(teacher.nationalId || "");
      setMobileNumber(teacher.mobileNumber || "");
      setEmail(teacher.email || "");
      setJobTitle(teacher.jobTitle || "معلمة");
      setEmploymentType(teacher.employmentType || EMPLOYMENT_TYPES[0]);
      setTeachingField(teacher.teachingField || TEACHING_FIELDS[0]);
      setSpecialization(teacher.specialization || SPECIALIZATIONS_LIST[0]);
      setErrors({});
      setGeneralError(null);
    }
  }, [teacher]);

  if (!teacher) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    setIsSubmitting(true);

    const payload: TeacherUpdateInput = {
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

    const res = await teacherService.updateTeacher(teacher.id, payload, actor);
    setIsSubmitting(false);

    if (res.success && res.teacher) {
      addToast({
        type: "success",
        title: "تم تعديل البيانات بنجاح",
        message: `تم تحديث ملف المعلمة ${res.teacher.fullName}`,
      });
      onTeacherUpdated(res.teacher);
      onClose();
    } else {
      if (res.errors) {
        setErrors(res.errors);
        if (res.errors.nationalId) {
          setGeneralError(res.errors.nationalId);
        }
      } else {
        setGeneralError("فشل تحديث بيانات المعلمة. يرجى التحقق من الحقول.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تعديل بيانات المعلمة"
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
              label="رقم الجوال *"
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
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              leftIcon={<BookOpen className="w-4 h-4" />}
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <Input
              label="البريد الإلكتروني"
              type="email"
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
            onClick={onClose}
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
            <Save className="w-4 h-4 ml-2" />
            <span>حفظ التعديلات</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
