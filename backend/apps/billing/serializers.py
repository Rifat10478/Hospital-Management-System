from rest_framework import serializers

from .models import Bill


class BillSerializer(serializers.ModelSerializer):

    patient_name = serializers.CharField(
        source="patient.user.get_full_name",
        read_only=True
    )

    patient_username = serializers.CharField(
        source="patient.user.username",
        read_only=True
    )

    appointment_date = serializers.DateTimeField(
        source="appointment.appointment_date",
        read_only=True
    )

    class Meta:

        model = Bill

        fields = [
            "id",
            "patient",
            "patient_name",
            "patient_username",
            "appointment",
            "appointment_date",
            "description",
            "amount",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "patient_name",
            "patient_username",
            "appointment_date",
            "created_at",
            "updated_at",
        ]