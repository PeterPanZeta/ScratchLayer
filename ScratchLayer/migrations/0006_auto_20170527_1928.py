# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-27 19:28
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ScratchLayer', '0005_remove_users_email_text'),
    ]

    operations = [
        migrations.RenameField(
            model_name='users',
            old_name='password_text',
            new_name='password',
        ),
        migrations.RenameField(
            model_name='users',
            old_name='username_text',
            new_name='username',
        ),
    ]
