# Generated by Django 5.0.4 on 2024-06-06 13:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_delete_canaccessdriverdashboard'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='driver',
            options={'permissions': [('can_access_driver_dashboard', 'Can access driver dashboard')]},
        ),
    ]
