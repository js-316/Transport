# Generated by Django 5.0.6 on 2024-06-24 14:39

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0046_fuel_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='maintenance',
            name='assigned_engineer',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
    ]
