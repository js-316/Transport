from rest_framework import serializers
from .models import Vehichle, Driver, Maintenance, User, Fuel, Engineer 
# from .models import Station
from .models import Jobcard
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# create serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_staff','is_driver', 'is_engineer','is_chief_transport_officer','is_human_resource_manager','is_procurement_manager','is_chief_executive_officer')

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'


class VehichleSerializer(serializers.ModelSerializer):

    driver = DriverSerializer(read_only=True)

    class Meta:
        model = Vehichle
        fields = '__all__'

class MaintenanceSerializer(serializers.ModelSerializer):

    fleet = VehichleSerializer(read_only=True)
    user = UserSerializer(read_only = True)
    assigned_engineer = UserSerializer()
    
    class Meta:
        model = Maintenance
        fields = '__all__'

# class StationSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Station
#         fields = '__all__'

class FuelSerializer(serializers.ModelSerializer):

    fuel_plate = VehichleSerializer(read_only = True)
    user = UserSerializer(read_only = True)
    # fuel_station = StationSerializer(read_only = True)

    class Meta:
        model = Fuel
        fields = '__all__'

class EngineerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Engineer
        fields = '__all__'

class JobcardSerializer(serializers.ModelSerializer):
    jobcard_plate = VehichleSerializer(read_only=True)
    repair = MaintenanceSerializer(read_only=True)

    class Meta:
        model = Jobcard
        fields = '__all__'

