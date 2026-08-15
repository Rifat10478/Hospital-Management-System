from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Bill
from .serializers import BillSerializer


class BillViewSet(viewsets.ModelViewSet):

    queryset = Bill.objects.select_related(
        "patient",
        "patient__user",
        "appointment",
        "appointment__doctor",
        "appointment__doctor__user",
    ).order_by("-created_at")

    serializer_class = BillSerializer

    permission_classes = [
        IsAuthenticated
    ]

    @action(
        detail=True,
        methods=["patch"]
    )
    def mark_paid(self, request, pk=None):

        bill = self.get_object()

        bill.paid = True
        bill.save()

        return Response(
            BillSerializer(bill).data
        )