from django.urls import path

# from . import views

from .views import (
    UserCreateView,
    CustomAuthToken,
    DriverCreateView,
    DriverDetailView,
    DriverListView,
    ImportDriver,
    VehichleCreateView,
    VehichleDetailView,
    VehichleListView,
    MaintenanceCreateView,
    MaintenanceDetailView,
    MaintenanceListView,
    SearchDriver,
    SearchVehichle,
    SearchMaintenance,
    StaffCreateView,
    ImportVehichle,
    FuelCreateView,
    FuelListView,
    FuelDetailView,
    FuelEditView,
   JobcardCreateView,
   JobcardListView,
   JobcardDetailView,
   UserListView,
   AssignEngineerView,
#    StationCreateView,
#    StationListView,
#    StationDetailView,
    

)

urlpatterns = [
    
    path('auth/register/', UserCreateView.as_view(), name='register'),
    path('staff/create/', StaffCreateView.as_view(), name='staff-create'),
    path('auth/login/', CustomAuthToken.as_view(), name='login'),
    path('drivers/', DriverListView.as_view(), name='driver'),
    path('driver/<int:pk>/', DriverDetailView.as_view(), name='driver-detail'),
    path('driver/create/', DriverCreateView.as_view(), name='driver-create'),
    path('driver/edit/<int:pk>', DriverDetailView.as_view(), name='driver-edit'),
    path('import/driver/', ImportDriver.as_view(), name='import-driver'),
    path('vehichles/', VehichleListView.as_view(), name='vehichle'),
    path('vehichle/<int:pk>/', VehichleDetailView.as_view(), name='vehichle-detail'),
    path('vehichle/edit/<int:pk>', VehichleDetailView.as_view(), name='vehichle-edit'),
    path('vehichle/create/', VehichleCreateView.as_view(), name='vehichle-create'),
    path('vehichle/costs_view/<int:pk>',VehichleDetailView.as_view(), name="costs-view"),
    path('vehichle/fuel_view/<int:pk>', VehichleDetailView.as_view(), name='fuel-view'),
    path('maintenances/', MaintenanceListView.as_view(), name='maintenance'),
    path('maintenance/<int:pk>/', MaintenanceDetailView.as_view(), name='maintenance-detail'),
    path('maintenance/edit/<int:pk>', MaintenanceDetailView.as_view(), name='maintenance-edit'),
    path('maintenance/create/', MaintenanceCreateView.as_view(), name='maintenance-create'),
    path('maintenance/work_order', MaintenanceDetailView.as_view(), name='work-order'),
    path('search/driver/', SearchDriver.as_view(), name='search-driver'),
    path('search/vehichle/', SearchVehichle.as_view(), name='search-vehichle'),
    path('search/maintenance/', SearchMaintenance.as_view(), name='search-maintenance'),
    path('import/vehichle/', ImportVehichle.as_view(), name='import-vehichle'),
    path('fuel/',FuelListView.as_view(), name='fuel'),
    path('fuel/<int:pk>/' ,FuelDetailView.as_view(), name ='fuel-detail'),
    path('fuel/create/', FuelCreateView.as_view(), name='fuel-create'),
    path('fuel/edit/<int:pk>', FuelEditView.as_view(), name='fuel-edit'),
    path('jobcards/',JobcardListView.as_view(), name='jobcards'),
    path('jobcard/<int:pk>/' ,JobcardDetailView.as_view(), name ='jobcard-detail'),
    path('jobcard/create/', JobcardCreateView.as_view(), name='jobcard-create'),
    path('jobcard/edit/<int:pk>', JobcardDetailView.as_view(), name='jobcard-edit'),
    path('users/', UserListView.as_view(), name='user'),
    path('maintenance/<int:pk>/assign-engineer/',AssignEngineerView.as_view(), name='assign-engineer'),
    # path('fuelstations/',StationListView.as_view(), name='fuelstations'),
    # path('fuelstation/<int:pk>/' ,StationDetailView.as_view(), name ='fuelstation-detail'),
    # path('fuelstation/create/', StationCreateView.as_view(), name='fuelstation-create'),
   
   

    
    
]