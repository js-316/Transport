from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from django.contrib.auth.models import PermissionsMixin, UserManager as BaseUserManager
from django.contrib.auth.models import Group

class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_staffuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        return self.create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)
    
    def create_adminuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_admin",True)
        return self.create_user(email, password, **extra_fields)
        
    def create_driveruser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_driver",True)
        return self.create_user(email, password, **extra_fields)
    
    def create_engineeruser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_engineer",True)
        return self.create_user(email, password, **extra_fields)
    

class User(AbstractUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_driver = models.BooleanField(default=False)
    is_engineer = models.BooleanField(default=False)

    # groups = models.ManyToManyField(Group, related_name='users')

    objects = UserManager()

    def __str__(self):
        return self.username
    

# is_superuser: Superuser with all permissions
# is_staff: Staff member with access to the Django admin site
# is_admin: Custom admin role (not used by Django itself)
# is_driver and is_engineer: Custom roles for drivers and engineers
# groups: Association with one or more groups for permission assignment


class ExtraMixin(object):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Driver(models.Model, ExtraMixin):
    name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20)
    age = models.IntegerField()
    date_hired = models.DateField()

    def __str__(self):
        return self.name


class Vehichle(models.Model, ExtraMixin):
    number_plate = models.CharField(max_length=20, unique=True)
    driver = models.ForeignKey('Driver', on_delete=models.CASCADE, related_name='vehichles')
    mileage = models.IntegerField()
    manufacturer = models.CharField(max_length=50)
    date_of_purchase = models.DateField()
    vehichle_type = models.CharField(max_length=50, default="Truck")
    
    def __str__(self):
        return self.number_plate


class Maintenance(models.Model, ExtraMixin):
    fleet = models.ForeignKey('Vehichle', on_delete=models.CASCADE, related_name='maintenances')
    description = models.CharField(max_length=100)
    date = models.DateField()
    cost = models.FloatField()
    status = models.CharField(max_length=20, default='Pending')
    
    def __str__(self):
        return self.description


class Fuel(models.Model, ExtraMixin):
    fuel_type = models.CharField(max_length=20, default ="Petrol")
    fuel_plate= models.ForeignKey('Vehichle', on_delete=models.CASCADE, related_name='Fuel')
    date_of_fueling = models.DateField()
    amount = models.FloatField()
    mileage = models.FloatField(default=0)
    status = models.CharField(max_length=20, default='Pending')

    def __str__(self):
        return self.status
    
class Engineer(models.Model, ExtraMixin):
    vehichle_attached = models.ForeignKey('Vehichle', on_delete=models.CASCADE, related_name='engineers')
    name = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=20)
    age = models.IntegerField()
    date_hired = models.DateField()
    email = models.CharField(max_length=30)

    def __str__(self):
        return self.name



