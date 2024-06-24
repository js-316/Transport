from rest_framework import generics
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Q
from django.contrib import messages
from .models import User, Driver, Vehichle, Maintenance, Fuel, Engineer
from .models import Jobcard
from .serializers import UserSerializer, DriverSerializer, VehichleSerializer, MaintenanceSerializer,FuelSerializer, EngineerSerializer
from .serializers import JobcardSerializer
from django import forms
from datetime import datetime
# from .management.permissions import create_permissions
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.contrib.auth.mixins import UserPassesTestMixin

from django.views.generic import TemplateView
# from .mixins import PermissionMixin


import io
import csv

# dashboard/views.py



# NOTE: used post method to create new objects because of foreign key constraints issues

from django.http import HttpResponse


class UserCreateView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer
    queryset = User.objects.all()

class PermissionMixin(UserPassesTestMixin):
    def test_func(self):
        user = self.request.user
        permissions = [permission for group in user.groups.all() for permission in group.permissions.all()]
        print(f"Checking permissions: {permissions}")
        return any(permission in permissions for permission in self.required_permissions)
    

class StaffCreateView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    # create a new user with staff permissions
    def post(self, request, *args, **kwargs):
        data = request.data
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            is_staff=True
        )
        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'message': 'User created successfully'
        })

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
            'user_id': user.pk,
            'email': user.email,
            'is_superuser': user.is_superuser,
            'is_admin' : user.is_admin,
            'is_staff': user.is_staff,
            'is_driver': user.is_driver,
            'is_engineer': user.is_engineer,
            
            }
        })

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

class DriverListView(generics.ListAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = (permissions.IsAuthenticated,)
   

class DriverDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = (permissions.IsAuthenticated,)
   

class DriverCreateView(generics.CreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    # check the data and create a new driver
    def post(self, request, *args, **kwargs):
        data = request.data
        
        driver = Driver.objects.create(
            name=data['name'],
            phone_number=data['phone_number'],
            age=data['age'],
            date_hired=data['date_hired']
        )
        return Response({
            'driver': DriverSerializer(driver, context=self.get_serializer_context()).data,
            'message': 'Driver created successfully'
        })

class ImportDriver(generics.CreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        
        # Check if the file is a CSV
        if not file.name.endswith('.csv'):
            return Response({'message': 'The file must be a CSV'}, status=400)

        try:
            data_set = file.read().decode('UTF-8')
            io_string = io.StringIO(data_set)
            csv_reader = csv.DictReader(io_string)
        except Exception as e:
            return Response({'message': f'Error reading CSV file: {e}'}, status=400)
        
        # Get the headers from the CSV file and remove BOM character if present
        header = [col.strip('\ufeff') for col in csv_reader.fieldnames]
        print("Headers:", header)  # Debug statement

        # Check if all the required columns are present in the header
        required_columns = ['name', 'phone_number', 'age', 'date_hired']
        if not all([col in header for col in required_columns]):
            return Response({'message': 'The file must contain the columns: ' + ', '.join(required_columns)}, status=400)

        # Process each row of the CSV file
        for row in csv_reader:
            print("Row data:", row)  # Debug statement
            # Check if 'name' or '\ufeffname' is present in the row
            if 'name' not in row and '\ufeffname' not in row:
                print("Skipping row without 'name' column:", row)  # Debug statement
                continue

            # Convert date format to YYYY-MM-DD
            try:
                date_hired = datetime.strptime(row['date_hired'], '%d/%m/%Y').strftime('%Y-%m-%d')
            except ValueError:
                return Response({'message': f'“{row["date_hired"]}” value has an invalid date format. It must be in DD/MM/YYYY format.'}, status=400)

            # Map the row data to the required columns
            try:
                name = row.get('name', row.get('\ufeffname', None))  # Get 'name' or '\ufeffname' from row data
                driver, created = Driver.objects.update_or_create(
                    name=name,
                    defaults={
                        'phone_number': row['phone_number'],
                        'age': row.get('age', None),  # Use None as default if 'age' is missing
                        'date_hired': date_hired,  # Use formatted date
                    }
                )
            except KeyError as e:
                return Response({'message': f'Error processing row: {e}'}, status=400)

        return Response({'message': 'Drivers imported successfully'})

# class EngineerListView(generics.ListAPIView):
#     permission_classes = [IsEngineer]
#     serializer_class = EngineerSerializer
#     queryset = Engineer.objects.all()

# CRUD

class VehichleListView(generics.ListAPIView):
    queryset = Vehichle.objects.all()
    serializer_class = VehichleSerializer
    permission_classes = (permissions.IsAuthenticated,)
    

class VehichleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehichle.objects.all()
    serializer_class = VehichleSerializer
    permission_classes = (permissions.IsAuthenticated,)

class VehichleCreateView(generics.CreateAPIView):
    queryset = Vehichle.objects.all()
    serializer_class = VehichleSerializer
    permission_classes = (permissions.IsAuthenticated,)
    # check the data and create a new vehichle
    def post(self, request, *args, **kwargs):
        data = request.data
        
        vehichle = Vehichle.objects.create(
            number_plate=data['number_plate'],
            driver=Driver.objects.get(id=data['driver']),
            mileage=data['mileage'],
            manufacturer=data['manufacturer'],
            date_of_purchase=data['date_of_purchase'],
            vehichle_type = data['vehichle_type'],
        )
        return Response({
            'vehichle': VehichleSerializer(vehichle, context=self.get_serializer_context()).data,
            'message': 'Vehichle created successfully'
        })
    
class ImportVehichle(generics.CreateAPIView):
    queryset = Vehichle.objects.all()
    serializer_class = VehichleSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        
        # Check if the file is a CSV
        if not file.name.endswith('.csv'):
            return Response({'message': 'The file must be a CSV'}, status=400)

        try:
            data_set = file.read().decode('UTF-8')
            io_string = io.StringIO(data_set)
            csv_reader = csv.DictReader(io_string)
        except Exception as e:
            return Response({'message': f'Error reading CSV file: {e}'}, status=400)
        
        # Get the headers from the CSV file and remove BOM character if present
        header = [col.strip('\ufeff') for col in csv_reader.fieldnames]
        print("Headers:", header)  # Debug statement

        # Check if all the required columns are present in the header
        required_columns = ['number_plate', 'driver', 'mileage', 'manufacturer', 'date_of_purchase']
        if not all([col in header for col in required_columns]):
            return Response({'message': 'The file must contain the columns: ' + ', '.join(required_columns)}, status=400)

        # Process each row of the CSV file
        for row in csv_reader:
            print("Row data:", row)  # Debug statement
            # Check if 'name' or '\ufeffname' is present in the row
            if 'number_plate' not in row and '\ufeffnumber_plate' not in row:
                print("Skipping row without 'number_plate' column:", row)  # Debug statement
                continue

            # Convert date format to YYYY-MM-DD
            try:
                date_of_purchase = datetime.strptime(row['date_of_purchase'], '%d/%m/%Y').strftime('%Y-%m-%d')
            except ValueError:
                return Response({'message': f'“{row["date_of_purchase"]}” value has an invalid date format. It must be in DD/MM/YYYY format.'}, status=400)

            # Map the row data to the required columns
            try:
                number_plate = row.get('number_plate', row.get('\ufeffnumber_plate', None))  # Get 'name' or '\ufeffname' from row data
                vehichle, created = Vehichle.objects.update_or_create(
                    number_plate=number_plate,
                    defaults={
                        'driver': row['driver'],
                        'mileage': row.get('mileage', None),  # Use None as default if 'age' is missing
                        'manufacturer': row['manufacturer'],
                        'date_of_purchase': date_of_purchase,  # Use formatted date
                        'vehichle_type' : row['vehichle_type'],
                    }
                )
            except KeyError as e:
                return Response({'message': f'Error processing row: {e}'}, status=400)

        return Response({'message': 'Vehicles imported successfully'})
    

class MaintenanceCreateView(generics.CreateAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        data = request.data
        
        maintenance = Maintenance.objects.create(
            fleet=Vehichle.objects.get(id=data['vehichle']),
            date=data['date'],
            description=data['description'],
            cost=data['cost'],
            
        )
        return Response({
            'maintenance': MaintenanceSerializer(maintenance, context=self.get_serializer_context()).data,
            'message': 'Maintenance created successfully'
        })

class MaintenanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    permission_classes = (permissions.IsAuthenticated,)

class MaintenanceListView(generics.ListAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        user = self.request.user
        if user.is_engineer:
            return Maintenance.objects.filter(assigned_engineer=user)
        else:
            return Maintenance.objects.all()

class SearchVehichle(generics.ListAPIView):
    serializer_class = VehichleSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        queryset = Vehichle.objects.all()

        search_term = self.request.query_params.get('search_term', None)
        if search_term is not None:
            query = Q(number_plate__icontains=search_term) | Q(driver__name__icontains=search_term) | Q(driver__phone_number__icontains=search_term) | Q(mileage__icontains=search_term) | Q(manufacturer__icontains=search_term)
            queryset = queryset.filter(query)
        return queryset




class SearchMaintenance(generics.ListAPIView):
    serializer_class = MaintenanceSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    # search by vehicle number, driver name, driver number, mileage, manufacturer, model, year
    def get_queryset(self):
        queryset = Maintenance.objects.all()
        search_term = self.request.query_params.get('search_term', None)
        if search_term is not None:
            query = Q(vehicle__number_plate__icontains=search_term) | Q(vehicle__driver__name__icontains=search_term) | Q(vehicle__driver__phone_number__icontains=search_term) | Q(vehicle__mileage__icontains=search_term) | Q(vehicle__manufacturer__icontains=search_term) | Q(vehicle__model__icontains=search_term) | Q(vehicle__year__icontains=search_term)
            queryset = queryset.filter(query)

class SearchDriver(generics.ListAPIView):
    serializer_class = DriverSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    # search by vehicle number, driver name, driver number, mileage, manufacturer, model, year
    def get_queryset(self):
        queryset = Driver.objects.all()
        search_term = self.request.query_params.get('search_term', None)
        if search_term is not None:
            query = Q(name__icontains=search_term) | Q(phone_number__icontains=search_term)
            queryset = queryset.filter(query)



# CRUD
class FuelCreateView(generics.CreateAPIView):
    queryset = Fuel.objects.all()
    serializer_class = FuelSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        data = request.data
        
        fuel = Fuel.objects.create(
            fuel_plate = Vehichle.objects.get(id=data['vehichle']),
            date_of_fueling =data['date_of_fueling'],
            mileage = data['mileage'],
            amount=data['amount'],
            fuel_type=data['fuel_type'],
            project = data['project'],
            # user = User.objects.get(id=data['user']),
            user = request.user,
        )
        return Response({
            'fuel': FuelSerializer(fuel, context=self.get_serializer_context()).data,
            'message': 'Fuel record created successfully'
        })




class FuelListView(generics.ListAPIView):
    queryset = Fuel.objects.all()
    serializer_class = FuelSerializer
    permission_classes = (permissions.IsAuthenticated,)

class FuelDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Fuel.objects.all()
    serializer_class = FuelSerializer
    permission_classes = (permissions.IsAuthenticated,)


class FuelEditView(APIView):
    def put(self, request, pk):
        fuel = Fuel.objects.get(pk=pk)
        serializer = FuelSerializer(fuel, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
# Jobcard Views

class JobcardCreateView(generics.CreateAPIView):
    queryset = Jobcard.objects.all()
    serializer_class = JobcardSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        data = request.data
        
        jobcard = Jobcard.objects.create(
            jobcard_plate=Vehichle.objects.get(id=data['vehichle']),
            date_of_jobcard =data['date_of_jobcard'],
            machine_name=data['machine_name'],
            # repair = Maintenance.objects.get(id=data['maintenance']),
            # parts_needed=data['parts_needed'],
            # status = data['status'],
        )
        return Response({
            'jobcard': JobcardSerializer(jobcard, context=self.get_serializer_context()).data,
            'message': 'Jobcard record created successfully'
        })


class JobcardListView(generics.ListAPIView):
    queryset = Jobcard.objects.all()
    serializer_class = JobcardSerializer
    permission_classes = (permissions.IsAuthenticated,)

class JobcardDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Jobcard.objects.all()
    serializer_class = JobcardSerializer
    permission_classes = (permissions.IsAuthenticated,)

    

class JobcardEditView(APIView):
    def put(self, request, pk):
        jobcard = Jobcard.objects.get(pk=pk)
        serializer = JobcardSerializer(jobcard, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

