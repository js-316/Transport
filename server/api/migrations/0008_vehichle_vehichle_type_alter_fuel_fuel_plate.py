# Generated by Django 5.0.4 on 2024-05-14 06:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_rename_number_plate_fuel_fuel_plate'),
    ]

    operations = [
        migrations.AddField(
            model_name='vehichle',
            name='vehichle_type',
            field=models.CharField(default='Truck', max_length=50),
        ),
        migrations.AlterField(
            model_name='fuel',
            name='fuel_plate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fuels', to='api.vehichle'),
        ),
    ]