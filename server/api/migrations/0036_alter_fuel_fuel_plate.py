# Generated by Django 5.0.6 on 2024-06-15 11:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0035_alter_fuel_fuel_plate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fuel',
            name='fuel_plate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Fuel', to='api.vehichle'),
        ),
    ]
