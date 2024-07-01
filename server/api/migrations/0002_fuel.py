# Generated by Django 5.0.4 on 2024-04-24 14:18

import api.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Fuel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_of_fueling', models.DateField()),
                ('amount', models.FloatField()),
                ('number_plate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fuels', to='api.vehichle')),
            ],
            bases=(models.Model, api.models.ExtraMixin),
        ),
    ]