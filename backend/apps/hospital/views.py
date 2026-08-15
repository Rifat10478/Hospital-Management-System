from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import generics
from rest_framework.views import APIView


from .models import (
    Department,
    Doctor,
    Patient,
    Appointment,
    Prescription,
    PrescriptionMedicine,
    Medicine,
    
)

from .serializers import (
    DepartmentSerializer,
    DoctorSerializer,
    PatientSerializer,
    AppointmentSerializer,
    PrescriptionSerializer,
    PrescriptionMedicineSerializer,
    MedicineSerializer,
)



class DepartmentViewSet(viewsets.ModelViewSet):

    queryset = Department.objects.all().order_by("name")

    serializer_class = DepartmentSerializer

    permission_classes = [
        IsAuthenticated
    ]


class DoctorViewSet(viewsets.ModelViewSet):

    queryset = Doctor.objects.select_related(
        "user",
        "department"
    )

    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    @action(
        detail=True,
        methods=["patch"]
    )
    def availability(self, request, pk=None):

        doctor = self.get_object()

        doctor.is_available = not doctor.is_available

        doctor.save()

        return Response({
            "id": doctor.id,
            "is_available": doctor.is_available
        })


class PatientViewSet(
    viewsets.ModelViewSet
):

    queryset = Patient.objects.select_related(
        "user"
    ).all().order_by(
        "-created_at"
    )

    serializer_class = PatientSerializer

    permission_classes = [
        IsAuthenticated
    ]


class AppointmentViewSet(viewsets.ModelViewSet):

    queryset = Appointment.objects.select_related(
        "patient",
        "doctor"
    )

    serializer_class = AppointmentSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        queryset = super().get_queryset()

        doctor = self.request.query_params.get(
            "doctor"
        )

        patient = self.request.query_params.get(
            "patient"
        )

        date = self.request.query_params.get(
            "date"
        )

        if doctor:
            queryset = queryset.filter(
                doctor_id=doctor
            )

        if patient:
            queryset = queryset.filter(
                patient_id=patient
            )

        if date:
            queryset = queryset.filter(
                appointment_date__date=date
            )

        return queryset

    @action(
        detail=True,
        methods=["patch"]
    )
    def cancel(self, request, pk=None):

        appointment = self.get_object()

        appointment.status = "cancelled"

        appointment.save()

        return Response(
            AppointmentSerializer(
                appointment
            ).data
        )


class MedicineViewSet(viewsets.ModelViewSet):

    queryset = Medicine.objects.all()

    serializer_class = MedicineSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        queryset = super().get_queryset()

        search = self.request.query_params.get(
            "search"
        )

        if search:
            queryset = queryset.filter(
                name__icontains=search
            )

        return queryset


class PrescriptionViewSet(viewsets.ModelViewSet):

    queryset = Prescription.objects.prefetch_related(
        "medicines__medicine"
    )

    serializer_class = PrescriptionSerializer

    permission_classes = [
        IsAuthenticated
    ]


class PrescriptionMedicineViewSet(
    viewsets.ModelViewSet
):

    queryset = PrescriptionMedicine.objects.select_related(
        "prescription",
        "medicine"
    )

    serializer_class = PrescriptionMedicineSerializer

    permission_classes = [
        IsAuthenticated
    ]


class AppointmentListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = AppointmentSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        queryset = Appointment.objects.select_related(
            "patient__user",
            "doctor__user",
            "doctor__department"
        ).order_by(
            "-appointment_date"
        )

        doctor = self.request.query_params.get(
            "doctor"
        )

        patient = self.request.query_params.get(
            "patient"
        )

        date = self.request.query_params.get(
            "date"
        )

        status_value = self.request.query_params.get(
            "status"
        )

        if doctor:
            queryset = queryset.filter(
                doctor_id=doctor
            )

        if patient:
            queryset = queryset.filter(
                patient_id=patient
            )

        if date:
            queryset = queryset.filter(
                appointment_date__date=date
            )

        if status_value:
            queryset = queryset.filter(
                status=status_value
            )

        return queryset

class AppointmentDetailView(
    generics.RetrieveUpdateAPIView
):

    queryset = Appointment.objects.select_related(
        "patient__user",
        "doctor__user",
        "doctor__department"
    )

    serializer_class = AppointmentSerializer

    permission_classes = [
        IsAuthenticated
    ]


class AppointmentCancelView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request, pk):

        try:

            appointment = Appointment.objects.get(
                pk=pk
            )

        except Appointment.DoesNotExist:

            return Response(
                {
                    "detail": "Appointment not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        appointment.status = "cancelled"

        appointment.save(
            update_fields=["status"]
        )

        serializer = AppointmentSerializer(
            appointment
        )

        return Response(
            serializer.data
        )


class PrescriptionListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = PrescriptionSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        user = self.request.user

        queryset = Prescription.objects.select_related(
            "appointment",
            "appointment__patient",
            "appointment__patient__user",
            "appointment__doctor",
            "appointment__doctor__user",
        ).prefetch_related(
            "medicines",
            "medicines__medicine",
        ).order_by(
            "-created_at"
        )


        # ADMIN
        if user.role == "admin":
            return queryset


        # DOCTOR
        if user.role == "doctor":

            return queryset.filter(
                appointment__doctor__user=user
            )


        # PATIENT
        if user.role == "patient":

            return queryset.filter(
                appointment__patient__user=user
            )


        # RECEPTIONIST
        return queryset.none()


class PrescriptionDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = PrescriptionSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        user = self.request.user

        queryset = Prescription.objects.select_related(
            "appointment",
            "appointment__patient",
            "appointment__patient__user",
            "appointment__doctor",
            "appointment__doctor__user",
        ).prefetch_related(
            "medicines",
            "medicines__medicine",
        )


        if user.role == "admin":
            return queryset


        if user.role == "doctor":

            return queryset.filter(
                appointment__doctor__user=user
            )


        if user.role == "patient":

            return queryset.filter(
                appointment__patient__user=user
            )


        return queryset.none()


class PrescriptionMedicineListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = PrescriptionMedicineSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        user = self.request.user

        queryset = PrescriptionMedicine.objects.select_related(
            "prescription",
            "medicine",
            "prescription__appointment",
            "prescription__appointment__doctor",
            "prescription__appointment__patient",
        )


        if user.role == "admin":
            return queryset


        if user.role == "doctor":

            return queryset.filter(
                prescription__appointment__doctor__user=user
            )


        if user.role == "patient":

            return queryset.filter(
                prescription__appointment__patient__user=user
            )


        return queryset.none()


class PrescriptionMedicineDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = PrescriptionMedicineSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        user = self.request.user

        queryset = PrescriptionMedicine.objects.select_related(
            "prescription",
            "medicine",
            "prescription__appointment",
            "prescription__appointment__doctor",
            "prescription__appointment__patient",
        )


        if user.role == "admin":
            return queryset


        if user.role == "doctor":

            return queryset.filter(
                prescription__appointment__doctor__user=user
            )


        if user.role == "patient":

            return queryset.filter(
                prescription__appointment__patient__user=user
            )


        return queryset.none()