# Generated by Django 5.0.4 on 2024-04-26 13:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_driver_phone_number_alter_fuel_number_plate'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fuel',
            name='fuel_type',
        ),
    ]
