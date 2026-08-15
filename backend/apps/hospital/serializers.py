from rest_framework import serializers
from .models import Patient

from .models import (
    Department,
    Doctor,
    Patient,
    Appointment,
    Prescription,
    PrescriptionMedicine,
    Medicine,
)


class DepartmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Department
        fields = "__all__"


class DoctorSerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(
        source="user.get_full_name",
        read_only=True
    )

    department_name = serializers.CharField(
        source="department.name",
        read_only=True
    )

    class Meta:
        model = Doctor
        fields = [
            "id",
            "user",
            "user_name",
            "department",
            "department_name",
            "specialization",
            "phone",
            "experience",
            "is_available",
        ]







class PatientSerializer(
    serializers.ModelSerializer
):

    user_name = serializers.SerializerMethodField()

    user_email = serializers.SerializerMethodField()

    class Meta:

        model = Patient

        fields = [
            "id",
            "user",
            "user_name",
            "user_email",
            "date_of_birth",
            "gender",
            "blood_group",
            "phone",
            "address",
            "emergency_contact",
            "emergency_phone",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user_name",
            "user_email",
            "created_at",
            "updated_at",
        ]


    def get_user_name(self, obj):

        return obj.user.get_full_name()


    def get_user_email(self, obj):

        return obj.user.email


class AppointmentSerializer(serializers.ModelSerializer):

    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    department_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment

        fields = [
            "id",
            "patient",
            "patient_name",
            "doctor",
            "doctor_name",
            "department_name",
            "appointment_date",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "patient_name",
            "doctor_name",
            "department_name",
            "created_at",
        ]

    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()

    def get_doctor_name(self, obj):
        return obj.doctor.user.get_full_name()

    def get_department_name(self, obj):
        if obj.doctor.department:
            return obj.doctor.department.name

        return None


class MedicineSerializer(serializers.ModelSerializer):

    class Meta:
        model = Medicine
        fields = "__all__"

class PrescriptionMedicineSerializer(
    serializers.ModelSerializer
):

    medicine_name = serializers.CharField(
        source="medicine.name",
        read_only=True
    )

    class Meta:

        model = PrescriptionMedicine

        fields = [
            "id",
            "prescription",
            "medicine",
            "medicine_name",
            "dosage",
            "duration",
        ]

        read_only_fields = [
            "id",
            "medicine_name",
        ]


class PrescriptionSerializer(
    serializers.ModelSerializer
):

    medicines = PrescriptionMedicineSerializer(
        many=True,
        read_only=True
    )

    patient_name = serializers.CharField(
        source="appointment.patient.user.get_full_name",
        read_only=True
    )

    doctor_name = serializers.CharField(
        source="appointment.doctor.user.get_full_name",
        read_only=True
    )

    appointment_date = serializers.DateTimeField(
        source="appointment.appointment_date",
        read_only=True
    )

    class Meta:

        model = Prescription

        fields = [
            "id",
            "appointment",

            "patient_name",
            "doctor_name",
            "appointment_date",

            "diagnosis",
            "notes",

            "created_at",

            "medicines",
        ]

        read_only_fields = [
            "id",
            "patient_name",
            "doctor_name",
            "appointment_date",
            "created_at",
            "medicines",
        ]


class AppointmentSerializer(serializers.ModelSerializer):

    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    department_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment

        fields = [
            "id",
            "patient",
            "patient_name",
            "doctor",
            "doctor_name",
            "department_name",
            "appointment_date",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "patient_name",
            "doctor_name",
            "department_name",
            "created_at",
        ]

    def get_patient_name(self, obj):

        return (
            obj.patient.user.get_full_name()
            or obj.patient.user.username
        )

    def get_doctor_name(self, obj):

        return (
            obj.doctor.user.get_full_name()
            or obj.doctor.user.username
        )

    def get_department_name(self, obj):

        if obj.doctor.department:
            return obj.doctor.department.name

        return None