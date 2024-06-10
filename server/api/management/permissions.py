from django.contrib.auth.management import create_permissions
from django.contrib.auth.models import Group, Permission

def create_group_permissions():
    # Create permissions for Drivers group
    driver_permissions = [
        Permission.objects.create(codename='view_dashboard', name='Can view driver dashboard'),
        Permission.objects.create(codename='view_drivers', name='Can view drivers list'),
    ]

    # Create permissions for Engineers group
    engineer_permissions = [
        Permission.objects.create(codename='view_projects', name='Can view projects list'),
        Permission.objects.create(codename='view_project_details', name='Can view project details'),
    ]

    # Assign permissions to groups
    drivers_group = Group.objects.get(name='Drivers')
    drivers_group.permissions.add(*driver_permissions)

    engineers_group = Group.objects.get(name='Engineers')
    engineers_group.permissions.add(*engineer_permissions)
