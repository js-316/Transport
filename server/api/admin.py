from django.contrib import admin

# Register your models here.
from .models import Driver, Vehichle, Maintenance, User,Fuel

admin.site.register(Driver)
admin.site.register(Vehichle)
admin.site.register(Maintenance)
admin.site.register(User)
admin.site.register(Fuel)