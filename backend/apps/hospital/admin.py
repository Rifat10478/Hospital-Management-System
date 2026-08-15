from django.contrib import admin

# Register your models here.


from .models import (
    Department,
    Doctor,
    Patient,
    Appointment,
    Prescription,
    PrescriptionMedicine,
    Medicine,
)


admin.site.register(Department)

admin.site.register(Doctor)

admin.site.register(Patient)

admin.site.register(Appointment)

admin.site.register(Prescription)

admin.site.register(PrescriptionMedicine)

admin.site.register(Medicine)