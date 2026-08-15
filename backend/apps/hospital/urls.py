from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

from .views import (
    DepartmentViewSet,
    DoctorViewSet,
    PatientViewSet,
    AppointmentViewSet,
    PrescriptionViewSet,
    PrescriptionMedicineViewSet,
    MedicineViewSet,
    AppointmentListCreateView,
    AppointmentDetailView,
    AppointmentCancelView,
    PrescriptionListCreateView,
    PrescriptionDetailView,
)


router = DefaultRouter()

router.register(
    r"departments",
    DepartmentViewSet,
    basename="department"
)

router.register(
    "doctors",
    DoctorViewSet,
    basename="doctor"
)

router.register(
    "patients",
    PatientViewSet,
    basename="patient"
)

router.register(
    "appointments",
    AppointmentViewSet,
    basename="appointment"
)

router.register(
    r"prescriptions",
    PrescriptionViewSet,
    basename="prescription"
)

router.register(
    r"prescription-medicines",
    PrescriptionMedicineViewSet,
    basename="prescription-medicine"
)


router.register(
    r"medicines",
    MedicineViewSet,
    basename="medicine"
)


urlpatterns = [
    path("", include(router.urls)),
     path(
        "appointments/",
        AppointmentListCreateView.as_view(),
        name="appointment-list-create"
    ),

    path(
        "appointments/<int:pk>/",
        AppointmentDetailView.as_view(),
        name="appointment-detail"
    ),

    path(
        "appointments/<int:pk>/cancel/",
        AppointmentCancelView.as_view(),
        name="appointment-cancel"
    ),

    path(
        "prescriptions/",
        views.PrescriptionListCreateView.as_view(),
        name="prescription-list-create"
    ),

    path(
        "prescriptions/<int:pk>/",
        views.PrescriptionDetailView.as_view(),
        name="prescription-detail"
    ),


 
]