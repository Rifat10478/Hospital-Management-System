from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


from django.contrib.auth import get_user_model

from .serializers import (
    RegisterSerializer,
    UserSerializer
)


User = get_user_model()


class RegisterView(generics.CreateAPIView):

    serializer_class = RegisterSerializer

    permission_classes = [
        AllowAny
    ]


class ProfileView(
    generics.RetrieveUpdateAPIView
):

    serializer_class = UserSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_object(self):
        return self.request.user


class DoctorUserListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        users = User.objects.filter(
            role="doctor"
        ).order_by(
            "first_name",
            "last_name"
        )

        serializer = UserSerializer(
            users,
            many=True
        )

        return Response(
            serializer.data
        )

class PatientUserListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]


    def get(self, request):

        users = User.objects.filter(
            role="patient"
        ).order_by(
            "first_name",
            "last_name"
        )


        serializer = UserSerializer(
            users,
            many=True
        )


        return Response(
            serializer.data
        )