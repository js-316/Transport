# Generated by Django 5.0.6 on 2024-06-24 08:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0044_alter_fuel_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fuel',
            name='user',
        ),
    ]
