from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("doctor", "Doctor"),
        ("patient", "Patient"),
        ("receptionist", "Receptionist"),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="patient"
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    address = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    date_joined = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.username