from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Users(models.Model):
	username_text = models.CharField(max_length=30)
	email_text = models.CharField(max_length=100)
	password_text = models.CharField(max_length=30)


