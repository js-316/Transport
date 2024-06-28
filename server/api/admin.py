from django.contrib import admin

# Register your models here.
from .models import Driver, Vehichle, Maintenance, User,Fuel,Engineer
from .models import Jobcard 
# from .models import Station



admin.site.register(Driver)
admin.site.register(Vehichle)
admin.site.register(Maintenance)
admin.site.register(Fuel)
admin.site.register(User)
admin.site.register(Engineer)
admin.site.register(Jobcard)
# admin.site.register(Station)
