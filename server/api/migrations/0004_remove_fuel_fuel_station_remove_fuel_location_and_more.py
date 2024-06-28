# Generated by Django 5.0.6 on 2024-06-27 15:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_fuel_fuel_station_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fuel',
            name='fuel_station',
        ),
        migrations.RemoveField(
            model_name='fuel',
            name='location',
        ),
        migrations.RemoveField(
            model_name='maintenance',
            name='more_information',
        ),
        migrations.RemoveField(
            model_name='maintenance',
            name='photo',
        ),
        migrations.RemoveField(
            model_name='user',
            name='is_chief_executive_officer',
        ),
        migrations.RemoveField(
            model_name='user',
            name='is_chief_transport_officer',
        ),
        migrations.RemoveField(
            model_name='user',
            name='is_engineer',
        ),
        migrations.RemoveField(
            model_name='user',
            name='is_human_resource_manager',
        ),
        migrations.RemoveField(
            model_name='user',
            name='is_procurement_manager',
        ),
        migrations.DeleteModel(
            name='Station',
        ),
    ]
