from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import RegisterView, ProfileView

from .views import (
    RegisterView,
    ProfileView,
    DoctorUserListView,
    PatientUserListView
)


urlpatterns = [

    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "login/",
        TokenObtainPairView.as_view(),
        name="login"
    ),

    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile"
    ),

    path(
        "doctor-users/",
        DoctorUserListView.as_view(),
        name="doctor-users"
    ),
    path(
    "patient-users/",
    PatientUserListView.as_view(),
    name="patient-users"
),
]