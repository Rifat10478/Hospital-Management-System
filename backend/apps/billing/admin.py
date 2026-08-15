from django.contrib import admin

from .models import Bill


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "patient",
        "appointment",
        "description",
        "amount",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "patient__user__username",
        "patient__user__first_name",
        "patient__user__last_name",
        "description",
    )

    ordering = (
        "-created_at",
    )